import type { UserData } from "@/types/userData";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function uniqLower(arr: string[]) {
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

export function mergeUserData(base: UserData, incoming?: Partial<UserData>): UserData {
  if (!incoming) return base;

  const merged: UserData = {
    ...base,
    personalInfo: {
      ...base.personalInfo,
      ...(incoming.personalInfo || {}),
    },
    targetJob: {
      ...base.targetJob,
      ...(incoming.targetJob || {}),
    },
    skills: {
      technical: uniqLower([
        ...(base.skills?.technical || []),
        ...(incoming.skills?.technical || []),
      ]),
      soft: uniqLower([...(base.skills?.soft || []), ...(incoming.skills?.soft || [])]),
      languages: uniqLower([
        ...(base.skills?.languages || []),
        ...(incoming.skills?.languages || []),
      ]),
    },
    experience: incoming.experience?.length ? incoming.experience : base.experience,
    education: incoming.education?.length ? incoming.education : base.education,
    summary: isNonEmptyString(incoming.summary) ? incoming.summary : base.summary,
  };

  // Only overwrite scalar personal fields if incoming is non-empty
  const pi = merged.personalInfo;
  const inPi = incoming.personalInfo || {};
  merged.personalInfo = {
    ...pi,
    firstName: isNonEmptyString(inPi.firstName) ? inPi.firstName : pi.firstName,
    lastName: isNonEmptyString(inPi.lastName) ? inPi.lastName : pi.lastName,
    email: isNonEmptyString(inPi.email) ? inPi.email : pi.email,
    phone: isNonEmptyString(inPi.phone) ? inPi.phone : pi.phone,
    location: isNonEmptyString(inPi.location) ? inPi.location : pi.location,
    linkedIn: isNonEmptyString(inPi.linkedIn) ? inPi.linkedIn : pi.linkedIn,
    portfolio: isNonEmptyString(inPi.portfolio) ? inPi.portfolio : pi.portfolio,
  };

  return merged;
}

