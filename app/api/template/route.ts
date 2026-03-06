import { NextRequest, NextResponse } from "next/server";
import { ResumeData } from "../../../lib/types";
import { generatePortfolio } from "../../../lib/generatePortfolio";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resumeData: ResumeData = body.data;

    if (!resumeData || !resumeData.name) {
      return NextResponse.json(
        { error: "Invalid resume data." },
        { status: 400 }
      );
    }

    const html = generatePortfolio(resumeData, "modern");

    return NextResponse.json({ html });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate portfolio." },
      { status: 500 }
    );
  }
}
