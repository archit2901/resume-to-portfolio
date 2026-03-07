import Anthropic from "@anthropic-ai/sdk";
import { ResumeData } from "./types";

const EXTRACTION_PROMPT = `You are a resume parser. Extract structured data from the following resume text and return it as a JSON object.

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON. No markdown fences, no code blocks, no preamble, no explanation.
- Your entire response must be parseable by JSON.parse().
- Leave fields as empty strings ("") if the information is not found in the resume.
- Leave array fields as empty arrays ([]) if the information is not found.
- Infer a professional title from context if not explicitly stated (e.g., if they have software engineering experience, use "Software Engineer").
- Group skills into logical categories like "Frontend", "Backend", "DevOps", "Languages", "Frameworks", "Tools", "Databases", etc.
- For LinkedIn and GitHub, extract the full URL if available.
- Parse all dates, durations, and locations as they appear in the resume.

Return this exact JSON structure:
{
  "name": "",
  "title": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "summary": "",
  "skills": [{ "category": "", "items": [""] }],
  "experience": [{ "company": "", "role": "", "duration": "", "location": "", "bullets": [""] }],
  "education": [{ "institution": "", "degree": "", "duration": "", "gpa": "" }],
  "projects": [{ "name": "", "description": "", "techStack": [""], "link": "" }],
  "certifications": [""],
  "languages": [""],
  "awards": [""]
}

RESUME TEXT:
`;

const client = new Anthropic();

const MAX_RESUME_CHARS = 30000; // ~7500 tokens, plenty for any resume

export async function extractWithGemini(
  resumeText: string
): Promise<ResumeData> {
  // Truncate overly long text to prevent excessive token costs
  const truncated = resumeText.length > MAX_RESUME_CHARS
    ? resumeText.slice(0, MAX_RESUME_CHARS) + "\n\n[Resume text truncated]"
    : resumeText;

  let responseText: string;
  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 4096,
      messages: [
        { role: "user", content: EXTRACTION_PROMPT + truncated },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude.");
    }
    responseText = textBlock.text;
  } catch (error: unknown) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new Error(
        "Invalid Anthropic API key. Please check ANTHROPIC_API_KEY in your .env.local file."
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new Error(
        "Rate limited. Please try again in a moment."
      );
    }
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API error (${error.status}): ${error.message}`);
    }
    throw error;
  }

  // Strip accidental markdown fences
  let cleaned = responseText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  try {
    const data: ResumeData = JSON.parse(cleaned);
    return data;
  } catch {
    throw new Error(
      "Failed to parse the AI response. The resume may be in an unusual format. Please try again."
    );
  }
}
