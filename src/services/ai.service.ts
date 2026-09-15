import mammoth from 'mammoth';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AIService {
  /**
   * Extracts raw text from a .docx file.
   */
  async extractTextFromDocx(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      console.error('Error extracting text from .docx:', error);
      throw new Error('Failed to parse Word document.');
    }
  }

  /**
   * Uses Claude to map extracted text to a structured JSON object based on the template's required fields.
   */
  async mapTextToTemplate(text: string, requiredFields: string[]): Promise<Record<string, any>> {
    const prompt = `You are an expert funeral coordinator. Extract the following details from the provided text for a funeral program:
${requiredFields.map(field => `- ${field}`).join('\n')}

Return the result strictly as a JSON object. If a field is missing, return null for that field.

Text:
${text}`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: 'You are a precise data extraction assistant. Always respond with valid JSON.',
        messages: [{ role: 'user', content: prompt }],
      });

      // The response content is an array of blocks. We need the text from the first block.
      const contentBlock = response.content[0];
      if (!contentBlock || contentBlock.type !== 'text') {
        throw new Error('Unexpected response format from AI: First content block is not text');
      }
      const textContent = contentBlock.text;

      // Basic JSON extraction from potential markdown blocks
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error mapping text to template:', error);
      throw new Error('AI failed to extract structured data.');
    }
  }
}

export const aiService = new AIService();
