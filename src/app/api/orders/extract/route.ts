import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/ai.service';
import { prisma } from '@/lib/prisma';

function requiredFieldNames(value: string): string[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('Template requiredFields is not valid JSON');
  }
  if (!Array.isArray(parsed) || !parsed.every((field) => typeof field === 'string')) {
    throw new Error('Template requiredFields must be a JSON array of strings');
  }
  return parsed;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const templateId = formData.get('templateId') as string;

    if (!file || !templateId) {
      return NextResponse.json({ error: 'Missing file or templateId' }, { status: 400 });
    }

    const template = await prisma.template.findUnique({ where: { id: templateId } });
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawText = await aiService.extractTextFromDocx(buffer);
    const structuredData = await aiService.mapTextToTemplate(rawText, requiredFieldNames(template.requiredFields));

    return NextResponse.json(structuredData);
  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
