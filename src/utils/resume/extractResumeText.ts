import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import * as mammoth from "mammoth/mammoth.browser";

function ensurePdfWorker() {
  // Vite-friendly worker URL
  if (!GlobalWorkerOptions.workerSrc) {
    GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.mjs",
      import.meta.url
    ).toString();
  }
}

async function extractTextFromPdf(file: File): Promise<string> {
  ensurePdfWorker();
  const data = await file.arrayBuffer();
  const pdf = await getDocument({ data }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      // pdfjs types are broad; "str" exists on TextItem
      .map((it: any) => (typeof it?.str === "string" ? it.str : ""))
      .filter(Boolean)
      .join(" ");
    text += `${pageText}\n`;
  }
  return text;
}

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value || "";
}

export async function extractResumeText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const mime = file.type?.toLowerCase();

  const isPdf = ext === "pdf" || mime === "application/pdf";
  const isDocx =
    ext === "docx" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (isPdf) return extractTextFromPdf(file);
  if (isDocx) return extractTextFromDocx(file);

  throw new Error("Unsupported file type. Please upload a PDF or DOCX resume.");
}

