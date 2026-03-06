import { NextRequest, NextResponse } from "next/server";
import { parseResume } from "../../../lib/parseResume";
import { extractWithGemini } from "../../../lib/extractWithGemini";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/x-pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please select a PDF or DOCX file." },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isValidType =
      ALLOWED_TYPES.includes(file.type) ||
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".docx");

    if (!isValidType) {
      return NextResponse.json(
        {
          error:
            "Unsupported file format. Please upload a PDF or DOCX file.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Determine MIME type
    let mimeType = file.type;
    if (!ALLOWED_TYPES.includes(mimeType)) {
      if (fileName.endsWith(".pdf")) mimeType = "application/pdf";
      else if (fileName.endsWith(".docx"))
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    // Parse file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text: string;
    try {
      text = await parseResume(buffer, mimeType);
    } catch {
      return NextResponse.json(
        {
          error:
            "Failed to read the file. The file may be corrupted or password-protected.",
        },
        { status: 400 }
      );
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough text from the file. The resume may be image-based or empty.",
        },
        { status: 400 }
      );
    }

    // Extract with Gemini
    let resumeData;
    try {
      resumeData = await extractWithGemini(text);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "AI extraction failed.";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ data: resumeData });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
