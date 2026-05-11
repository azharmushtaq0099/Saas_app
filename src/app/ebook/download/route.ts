import { NextResponse } from "next/server";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

import { getUserOrThrow, assertProOrThrow } from "@/lib/entitlements";
import { EBOOK_CHAPTERS, EBOOK_TITLE } from "@/lib/ebook-content";

export const runtime = "nodejs";

export async function GET() {
  const user = await getUserOrThrow();
  await assertProOrThrow(user.id);

  const paragraphs: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: EBOOK_TITLE, bold: true })],
      spacing: { after: 300 },
    }),
  ];

  for (const chapter of EBOOK_CHAPTERS) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: chapter.title, bold: true })],
        spacing: { before: 220, after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: chapter.summary })],
        spacing: { after: 120 },
      }),
    );

    for (const point of chapter.points) {
      paragraphs.push(
        new Paragraph({
          text: point,
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
      );
    }

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Thinking Block: ", bold: true }),
          new TextRun({
            text: `[${chapter.thinking[0]}] -> [${chapter.thinking[1]}] -> [${chapter.thinking[2]}]`,
          }),
        ],
        spacing: { before: 80, after: 140 },
      }),
    );
  }

  const doc = new Document({
    sections: [
      {
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": 'attachment; filename="saas-learning-ebook.docx"',
    },
  });
}

