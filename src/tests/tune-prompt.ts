import 'dotenv/config';
import { aiService } from '../services/ai.service';

async function testPrompt() {
  const sampleText = `
    Celebration of Life for Robert 'Bobby' Smith
    Born: January 12, 1945
    Passed Away: September 10, 2026

    Robert was a loving husband, father, and grandfather. He spent 40 years working as a structural engineer in New York City. He loved fishing, jazz music, and spending time with his grandchildren.

    The service will be held on September 15, 2026, at 11:00 AM at the Grace Community Chapel, 123 Faith Lane, Springfield.

    He is survived by his wife, Mary Smith, and his two children, James and Sarah.
  `;

  const requiredFields = ['deceased_name', 'birth_date', 'death_date', 'obituary', 'service_date', 'service_time', 'service_location', 'surviving_family'];

  console.log('Testing AI Extraction...');
  try {
    const result = await aiService.mapTextToTemplate(sampleText, requiredFields);
    console.log('Extracted JSON:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Extraction failed:', error);
  }
}

testPrompt();
