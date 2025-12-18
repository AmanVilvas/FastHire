/// <reference lib="deno.ns" />

import { corsHeaders } from "../_shared/cors.ts";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined };

function jsonResponse(body: JsonValue, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(init.headers || {}),
    },
  });
}

function extractModelText(geminiResponse: any): string {
  return (
    geminiResponse?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text)
      ?.filter(Boolean)
      ?.join("\n") ?? ""
  );
}

const schemaHint = `Return ONLY valid JSON matching this TypeScript type (no markdown):
{
  "personalInfo": {
    "firstName": string,
    "lastName": string,
    "email": string,
    "phone": string,
    "location": string,
    "linkedIn": string,
    "portfolio": string
  },
  "experience": Array<{
    "company": string,
    "position": string,
    "startDate": string, // yyyy-mm if possible else ""
    "endDate": string,   // yyyy-mm if possible else ""
    "current": boolean,
    "achievements": string[]
  }>,
  "education": Array<{
    "institution": string,
    "degree": string,
    "field": string,
    "graduationYear": string,
    "gpa": string
  }>,
  "skills": {
    "technical": string[],
    "soft": string[],
    "languages": string[]
  }
}

Rules:
- If unknown, use empty string/empty array.
- Do NOT hallucinate employers/schools; only extract from the provided text.
- Normalize URLs to start with https:// when possible.
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text } = (await req.json().catch(() => ({}))) as { text?: string };
    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return jsonResponse(
        { error: "Missing or too-short resume text." },
        { status: 400 },
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return jsonResponse(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 },
      );
    }

    const model = Deno.env.get("GEMINI_MODEL") || "gemini-1.5-flash";

    const prompt =
      `${schemaHint}\n\nRESUME_TEXT:\n` +
      text.slice(0, 120_000); // keep within reasonable limits

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "");
      return jsonResponse(
        { error: "Gemini request failed.", details: errText.slice(0, 2000) },
        { status: 502 },
      );
    }

    const geminiJson = await geminiRes.json();
    const raw = extractModelText(geminiJson).trim();
    if (!raw) {
      return jsonResponse(
        { error: "Gemini returned empty output." },
        { status: 502 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Sometimes models wrap JSON; attempt to salvage the first {...} block.
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start >= 0 && end > start) {
        parsed = JSON.parse(raw.slice(start, end + 1));
      } else {
        throw new Error("Invalid JSON from Gemini.");
      }
    }

    return jsonResponse({ data: parsed });
  } catch (e) {
    console.error(e);
    return jsonResponse(
      { error: "Unexpected server error." },
      { status: 500 },
    );
  }
});

