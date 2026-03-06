import { ResumeData } from "./types";
import { generateModernPortfolio } from "../templates/modern";

type TemplateName = "modern";

const templates: Record<TemplateName, (data: ResumeData) => string> = {
  modern: generateModernPortfolio,
};

export function generatePortfolio(
  data: ResumeData,
  template: TemplateName = "modern"
): string {
  const generator = templates[template];
  if (!generator) {
    throw new Error(`Template "${template}" not found.`);
  }
  return generator(data);
}
