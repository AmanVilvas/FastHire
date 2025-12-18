import type { UserData } from "@/types/userData";
import { initialUserData } from "@/types/userData";

function clean(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function uniq(arr: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of arr.map((x) => x.trim()).filter(Boolean)) {
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function takeFirstMatch(text: string, re: RegExp) {
  const m = text.match(re);
  return m?.[0] || "";
}

function guessName(lines: string[]) {
  const candidates = lines
    .slice(0, 8)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/@/.test(l))
    .filter((l) => !/\d/.test(l))
    .filter((l) => l.length >= 5 && l.length <= 50)
    .filter((l) => !/resume|curriculum|vitae/i.test(l));

  const best = candidates[0] || "";
  const parts = best.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(" "),
    };
  }
  return { firstName: "", lastName: "" };
}

function extractSection(text: string, header: RegExp) {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const idx = lines.findIndex((l) => header.test(l));
  if (idx === -1) return "";

  const out: string[] = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    // naive stop if we hit another all-caps-ish header or common section name
    if (/^(experience|work experience|education|projects|skills|certifications|summary|profile)$/i.test(line)) break;
    if (/^[A-Z][A-Z\s&/]{3,}$/.test(line)) break;
    out.push(line);
    if (out.length > 80) break;
  }
  return out.join("\n");
}

function parseSkills(text: string) {
  const skillsBlock =
    extractSection(text, /^skills\b/i) ||
    extractSection(text, /^technical skills\b/i) ||
    extractSection(text, /^core skills\b/i);

  const tokens = uniq(
    skillsBlock
      .split(/[,•|/]|(?:\s-\s)|(?:\s•\s)/g)
      .map((t) => clean(t))
      .filter((t) => t.length >= 2 && t.length <= 40)
  );

  const languageWords = new Set([
    "english",
    "hindi",
    "spanish",
    "french",
    "german",
    "arabic",
    "urdu",
    "bengali",
    "tamil",
    "telugu",
    "marathi",
    "gujarati",
    "kannada",
    "malayalam",
    "punjabi",
  ]);
  const softWords = new Set([
    "communication",
    "leadership",
    "teamwork",
    "collaboration",
    "problem solving",
    "problem-solving",
    "time management",
    "adaptability",
    "critical thinking",
    "ownership",
  ]);

  const languages: string[] = [];
  const soft: string[] = [];
  const technical: string[] = [];

  for (const t of tokens) {
    const lower = t.toLowerCase();
    if (languageWords.has(lower)) languages.push(t);
    else if (softWords.has(lower)) soft.push(t);
    else technical.push(t);
  }

  return { technical: uniq(technical), soft: uniq(soft), languages: uniq(languages) };
}

function parseExperience(text: string): UserData["experience"] {
  const block =
    extractSection(text, /^experience\b/i) ||
    extractSection(text, /^work experience\b/i) ||
    extractSection(text, /^professional experience\b/i);
  if (!block) return [];

  const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const entries: UserData["experience"] = [];

  let current: UserData["experience"][number] | null = null;

  const dateRangeRe =
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)?\.?\s*(\d{4})\s*[-–—to]+\s*(present|(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)?\.?\s*(\d{4}))/i;

  for (const line of lines) {
    const hasDate = dateRangeRe.test(line) || /\b(20\d{2})\s*[-–—to]+\s*(20\d{2}|present)\b/i.test(line);
    const isBullet = /^[-•*]/.test(line);

    if (hasDate && !isBullet) {
      // start a new entry; try to infer company/position from same line or previous line(s)
      if (current) entries.push(current);
      current = {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: /present/i.test(line),
        achievements: [],
      };

      // best-effort: split "Role - Company" or "Company — Role"
      const parts = line.replace(/\s+/g, " ").split(/[-–—|•]/).map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        current.position = parts[0];
        current.company = parts[1];
      } else {
        current.position = line;
      }
      continue;
    }

    if (!current) {
      // maybe first lines are "Role, Company" before dates; create entry lazily
      if (!isBullet && line.length <= 80) {
        current = {
          company: "",
          position: line,
          startDate: "",
          endDate: "",
          current: false,
          achievements: [],
        };
      }
      continue;
    }

    if (isBullet) {
      current.achievements.push(clean(line.replace(/^[-•*]\s*/, "")));
    } else {
      // extra info line; if company empty, try to use it
      if (!current.company && line.length <= 60) current.company = line;
      else if (line.length <= 120) current.achievements.push(clean(line));
    }

    if (current.achievements.length > 8) break;
  }

  if (current) entries.push(current);
  return entries.slice(0, 4).map((e) => ({
    ...e,
    achievements: uniq(e.achievements).slice(0, 6),
  }));
}

function parseEducation(text: string): UserData["education"] {
  const block = extractSection(text, /^education\b/i);
  if (!block) return [];
  const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const entries: UserData["education"] = [];
  for (const line of lines) {
    const year = takeFirstMatch(line, /\b(19\d{2}|20\d{2})\b/);
    if (!year && line.length < 6) continue;

    // naive: "Degree, Field - University"
    const parts = line.split(/[-–—|]/).map((p) => p.trim()).filter(Boolean);
    const left = parts[0] || "";
    const right = parts[1] || "";
    const leftParts = left.split(/,\s*/).map((p) => p.trim()).filter(Boolean);

    entries.push({
      institution: right || "",
      degree: leftParts[0] || "",
      field: leftParts.slice(1).join(", "),
      graduationYear: year || "",
      gpa: "",
    });

    if (entries.length >= 3) break;
  }

  return entries;
}

export function parseResumeToUserData(text: string): Partial<UserData> {
  const normalized = text.replace(/\t/g, " ").replace(/[ ]{2,}/g, " ").trim();
  const lines = normalized.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const header = lines.slice(0, 12).join("\n");

  const email = takeFirstMatch(normalized, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneRaw = takeFirstMatch(normalized, /(\+?\d[\d\s().-]{8,}\d)/);
  const phone = phoneRaw ? clean(phoneRaw).replace(/\s+/g, " ") : "";

  const linkedIn =
    takeFirstMatch(normalized, /https?:\/\/(www\.)?linkedin\.com\/in\/[^\s)]+/i) ||
    takeFirstMatch(normalized, /(www\.)?linkedin\.com\/in\/[^\s)]+/i);

  const urls = (normalized.match(/https?:\/\/[^\s)]+/gi) || []).map((u) => u.trim());
  const portfolio =
    urls.find((u) => !/linkedin\.com/i.test(u)) ||
    takeFirstMatch(normalized, /(www\.)?github\.com\/[^\s)]+/i);

  const { firstName, lastName } = guessName(lines);

  const location =
    takeFirstMatch(header, /([A-Za-z][A-Za-z .'-]+,\s*[A-Za-z]{2,})/) ||
    "";

  const skills = parseSkills(normalized);
  const experience = parseExperience(normalized);
  const education = parseEducation(normalized);

  return {
    ...initialUserData,
    personalInfo: {
      ...initialUserData.personalInfo,
      firstName,
      lastName,
      email,
      phone,
      location,
      linkedIn: linkedIn ? (linkedIn.startsWith("http") ? linkedIn : `https://${linkedIn}`) : "",
      portfolio: portfolio ? (portfolio.startsWith("http") ? portfolio : `https://${portfolio}`) : "",
    },
    experience,
    education,
    skills: {
      technical: skills.technical,
      soft: skills.soft,
      languages: skills.languages,
    },
  };
}

