#!/usr/bin/env tsx

import * as cheerio from 'cheerio';
import { createHash } from 'crypto';

/**
 * OpenStax Physics Scraper
 *
 * CRITICAL FILTERING RULES:
 * - Volume 1: ALL chapters
 * - Volume 2: Chapters 1-4 ONLY
 * - Volume 3: Chapters 1-4 ONLY
 *
 * Usage:
 *   npm run scrape -- --dry-run    (preview what will be scraped)
 *   npm run scrape                 (actually scrape and import)
 */

interface ScrapedFormula {
  title: string;
  latex: string;
  description: string;
  chapterId: string;
  volume: 'VOL1' | 'VOL2' | 'VOL3';
  chapterNumber: number;
  sourceUrl: string;
  hash: string;
}

interface ScrapedChapter {
  volume: 'VOL1' | 'VOL2' | 'VOL3';
  number: number;
  title: string;
  description: string;
  sourceUrl: string;
}

// Configuration from environment variables
const SCRAPE_CONFIG = {
  VOL1_URL: process.env.SCRAPE_VOL1_URL || 'https://openstax.org/books/university-physics-volume-1/pages/',
  VOL2_URL: process.env.SCRAPE_VOL2_URL || 'https://openstax.org/books/university-physics-volume-2/pages/',
  VOL3_URL: process.env.SCRAPE_VOL3_URL || 'https://openstax.org/books/university-physics-volume-3/pages/',
};

// Chapter filtering rules
const CHAPTER_RULES = {
  VOL1: 'all', // All chapters
  VOL2: [1, 2, 3, 4], // Chapters 1-4 only
  VOL3: [1, 2, 3, 4], // Chapters 1-4 only
};

const isDryRun = process.argv.includes('--dry-run');

console.log('='.repeat(60));
console.log('OpenStax Physics Scraper');
console.log('='.repeat(60));
console.log(`Mode: ${isDryRun ? 'DRY RUN (preview only)' : 'LIVE (will import data)'}`);
console.log('');

/**
 * Fetch and parse a URL
 */
async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; EducationalBot/1.0; +Physics4CTA)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  await sleep(1000); // Rate limiting: 1 request per second
  return response.text();
}

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract chapter information from OpenStax page
 */
async function scrapeChapter(
  volume: 'VOL1' | 'VOL2' | 'VOL3',
  chapterNumber: number,
  baseUrl: string
): Promise<{ chapter: ScrapedChapter; formulas: ScrapedFormula[] }> {
  const url = `${baseUrl}${chapterNumber}-introduction`;
  console.log(`  Fetching: ${url}`);

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    // Extract chapter title
    const chapterTitle = $('h1, .os-title, [data-type="document-title"]')
      .first()
      .text()
      .trim() || `Chapter ${chapterNumber}`;

    // Extract chapter description (first paragraph)
    const description = $('p').first().text().trim().substring(0, 500);

    const chapter: ScrapedChapter = {
      volume,
      number: chapterNumber,
      title: chapterTitle,
      description,
      sourceUrl: url,
    };

    // Extract formulas from the chapter
    const formulas: ScrapedFormula[] = [];

    // Look for math elements (LaTeX in OpenStax is usually in <math> or marked elements)
    $('[data-type="equation"], .equation, math, .os-equation').each((_, elem) => {
      const $elem = $(elem);

      // Try to extract LaTeX
      let latex = $elem.attr('data-math') ||
                  $elem.find('[data-math]').attr('data-math') ||
                  $elem.text().trim();

      if (!latex || latex.length < 3) return; // Skip empty or trivial

      // Clean up latex
      latex = latex.replace(/\s+/g, ' ').trim();

      // Get surrounding context for description
      const context = $elem.parent().text().trim().substring(0, 200);

      // Generate title from context or formula
      const title = generateFormulaTitle(latex, context);

      const formula: ScrapedFormula = {
        title,
        latex,
        description: context,
        chapterId: `${volume}-CH${chapterNumber}`,
        volume,
        chapterNumber,
        sourceUrl: url,
        hash: hashFormula(latex),
      };

      formulas.push(formula);
    });

    // Also look for explicit formula sections
    $('.formula, .os-formula, [data-type="formula"]').each((_, elem) => {
      const $elem = $(elem);
      const formulaText = $elem.text().trim();

      if (formulaText.length < 3) return;

      const title = $elem.find('.title, .os-title').text().trim() ||
                    generateFormulaTitle(formulaText, '');
      const description = $elem.find('.description, p').first().text().trim();

      const formula: ScrapedFormula = {
        title,
        latex: formulaText,
        description: description || formulaText.substring(0, 200),
        chapterId: `${volume}-CH${chapterNumber}`,
        volume,
        chapterNumber,
        sourceUrl: url,
        hash: hashFormula(formulaText),
      };

      // Check for duplicates
      if (!formulas.some(f => f.hash === formula.hash)) {
        formulas.push(formula);
      }
    });

    console.log(`    ✓ Found: "${chapterTitle}" with ${formulas.length} formulas`);

    return { chapter, formulas };

  } catch (error: any) {
    console.error(`    ✗ Error scraping chapter ${chapterNumber}:`, error.message);
    throw error;
  }
}

/**
 * Generate a descriptive title for a formula
 */
function generateFormulaTitle(latex: string, context: string): string {
  // Try to extract from context first
  const contextMatch = context.match(/(?:equation|formula|law|theorem|principle|relation)[:\s]+([^.]{5,50})/i);
  if (contextMatch) {
    return contextMatch[1].trim();
  }

  // Generate from latex
  if (latex.includes('=')) {
    const parts = latex.split('=');
    return `${parts[0].trim()} Formula`;
  }

  return latex.substring(0, 50);
}

/**
 * Hash formula for deduplication
 */
function hashFormula(latex: string): string {
  const normalized = latex.replace(/\s+/g, '').toLowerCase();
  return createHash('md5').update(normalized).digest('hex');
}

/**
 * Main scraping logic
 */
async function scrapeAllVolumes(): Promise<{
  chapters: ScrapedChapter[];
  formulas: ScrapedFormula[];
}> {
  const allChapters: ScrapedChapter[] = [];
  const allFormulas: ScrapedFormula[] = [];

  // Volume 1: ALL chapters (estimate 1-17)
  console.log('\nVolume 1: Scraping ALL chapters...');
  const vol1Chapters = CHAPTER_RULES.VOL1 === 'all' ? Array.from({ length: 17 }, (_, i) => i + 1) : [];

  for (const chNum of vol1Chapters) {
    try {
      const { chapter, formulas } = await scrapeChapter('VOL1', chNum, SCRAPE_CONFIG.VOL1_URL);
      allChapters.push(chapter);
      allFormulas.push(...formulas);
    } catch (error) {
      console.error(`  Skipping Volume 1 Chapter ${chNum} due to error`);
    }
  }

  // Volume 2: Chapters 1-4 ONLY
  console.log('\nVolume 2: Scraping chapters 1-4 ONLY...');
  for (const chNum of CHAPTER_RULES.VOL2) {
    try {
      const { chapter, formulas } = await scrapeChapter('VOL2', chNum, SCRAPE_CONFIG.VOL2_URL);
      allChapters.push(chapter);
      allFormulas.push(...formulas);
    } catch (error) {
      console.error(`  Skipping Volume 2 Chapter ${chNum} due to error`);
    }
  }

  // Volume 3: Chapters 1-4 ONLY
  console.log('\nVolume 3: Scraping chapters 1-4 ONLY...');
  for (const chNum of CHAPTER_RULES.VOL3) {
    try {
      const { chapter, formulas } = await scrapeChapter('VOL3', chNum, SCRAPE_CONFIG.VOL3_URL);
      allChapters.push(chapter);
      allFormulas.push(...formulas);
    } catch (error) {
      console.error(`  Skipping Volume 3 Chapter ${chNum} due to error`);
    }
  }

  return { chapters: allChapters, formulas: allFormulas };
}

/**
 * Deduplicate formulas by hash
 */
function deduplicateFormulas(formulas: ScrapedFormula[]): ScrapedFormula[] {
  const seen = new Set<string>();
  return formulas.filter(f => {
    if (seen.has(f.hash)) {
      return false;
    }
    seen.add(f.hash);
    return true;
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    const { chapters, formulas: rawFormulas } = await scrapeAllVolumes();
    const formulas = deduplicateFormulas(rawFormulas);

    console.log('\n' + '='.repeat(60));
    console.log('SCRAPING COMPLETE');
    console.log('='.repeat(60));
    console.log(`Total chapters scraped: ${chapters.length}`);
    console.log(`  - Volume 1: ${chapters.filter(c => c.volume === 'VOL1').length}`);
    console.log(`  - Volume 2: ${chapters.filter(c => c.volume === 'VOL2').length}`);
    console.log(`  - Volume 3: ${chapters.filter(c => c.volume === 'VOL3').length}`);
    console.log(`Total formulas found: ${rawFormulas.length}`);
    console.log(`Unique formulas (after dedup): ${formulas.length}`);
    console.log('');

    if (isDryRun) {
      console.log('DRY RUN - No data was imported to database');
      console.log('\nSample chapters:');
      chapters.slice(0, 3).forEach(ch => {
        console.log(`  - ${ch.volume} Ch${ch.number}: ${ch.title}`);
      });
      console.log('\nSample formulas:');
      formulas.slice(0, 5).forEach(f => {
        console.log(`  - ${f.title} (${f.chapterId})`);
        console.log(`    ${f.latex.substring(0, 80)}...`);
      });
      console.log('\nRun without --dry-run to import to database');
    } else {
      console.log('IMPORTING TO DATABASE...');
      console.log('(Database import not yet implemented)');
      console.log('TODO: Use Amplify client to batch-import chapters and formulas');
    }

  } catch (error: any) {
    console.error('\n❌ SCRAPER FAILED:', error.message);
    process.exit(1);
  }
}

main();
