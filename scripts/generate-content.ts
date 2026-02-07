#!/usr/bin/env node

/**
 * PriceDex: AI Content Generation Pipeline
 *
 * Generates template-based descriptions for Pokémon cards.
 * This is a placeholder for future AI-generated content.
 *
 * Usage:
 *   npx ts-node scripts/generate-content.ts              # Generate all missing content
 *   npx ts-node scripts/generate-content.ts --limit 100  # Process only 100 cards
 *   npx ts-node scripts/generate-content.ts --force      # Regenerate all content
 *   npx ts-node scripts/generate-content.ts --dry-run    # Test without saving
 */

import * as fs from 'fs';
import * as path from 'path';

// Constants
const DATA_DIR = path.join(__dirname, '../data');
const CONTENT_DIR = path.join(DATA_DIR, 'content');
const CARDS_FILE = path.join(DATA_DIR, 'cards.json');

// Interfaces
interface Card {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: number;
  types?: string[];
  evolves_from?: string;
  abilities?: Array<{
    name: string;
    text: string;
    type: string;
  }>;
  attacks?: Array<{
    name: string;
    cost: string[];
    converted_energy_cost: number;
    damage: string;
    text: string;
  }>;
  rarity?: string;
  flavor_text?: string;
  artist?: string;
  set: {
    id: string;
    name: string;
    series: string;
    printed_total: number;
  };
  number: string;
  count: number;
}

interface GeneratedContent {
  cardId: string;
  cardName: string;
  generated_at: string;
  description: string;
  rarity_analysis: string;
  collector_value: string;
  market_position: string;
  key_features: string[];
}

// Utility: Parse command line arguments
function getForceRegenerate(): boolean {
  return process.argv.includes('--force');
}

function getDryRun(): boolean {
  return process.argv.includes('--dry-run');
}

function getCardLimit(): number | null {
  const limitArg = process.argv.find((arg) => arg.startsWith('--limit'));
  if (limitArg) {
    const limit = parseInt(limitArg.split('=')[1], 10);
    return isNaN(limit) ? null : limit;
  }
  return null;
}

// Utility: Create content directory if it doesn't exist
function ensureContentDir(): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

// Utility: Check if content already exists
function hasContent(cardId: string): boolean {
  const contentFile = path.join(CONTENT_DIR, `${cardId}.json`);
  return fs.existsSync(contentFile);
}

// Utility: Load existing content
function loadContent(cardId: string): GeneratedContent | null {
  const contentFile = path.join(CONTENT_DIR, `${cardId}.json`);
  if (!fs.existsSync(contentFile)) {
    return null;
  }

  const content = fs.readFileSync(contentFile, 'utf-8');
  return JSON.parse(content) as GeneratedContent;
}

// Utility: Load cards
function loadCards(): Card[] {
  if (!fs.existsSync(CARDS_FILE)) {
    console.error(`❌ Cards file not found: ${CARDS_FILE}`);
    console.error('   Run "npx ts-node scripts/fetch-cards.ts" first');
    process.exit(1);
  }

  const content = fs.readFileSync(CARDS_FILE, 'utf-8');
  return JSON.parse(content) as Card[];
}

// Utility: Generate rarity description
function generateRarityAnalysis(card: Card): string {
  const rarity = card.rarity || 'common';
  const rarityDescriptions: { [key: string]: string } = {
    common: 'Common cards are the foundation of any collection, widely available and affordable.',
    uncommon:
      'Uncommon cards are moderately rare and offer good value for casual collectors.',
    rare: 'Rare cards are harder to find and command higher prices from serious collectors.',
    'rare holo':
      'Rare Holo cards feature holographic patterns and are highly sought after by collectors.',
    'rare rainbow':
      'Rainbow Rare cards feature a full-card holographic pattern and are among the most valuable.',
    'rare secret': 'Secret Rare cards have collector numbers beyond the set total and are extremely rare.',
    'rare ultra': 'Ultra Rare cards combine special attributes with high rarity, making them very desirable.',
    'rare lv.x': 'Lv.X cards were powerful tournament staples and are now highly collectible.',
    'rare star': 'Star cards feature unique artwork and are prized by collectors.',
  };

  const description = rarityDescriptions[rarity.toLowerCase()] || rarityDescriptions['rare'];
  return `This ${rarity} card. ${description}`;
}

// Utility: Generate collector value assessment
function generateCollectorValue(card: Card): string {
  const rarity = (card.rarity || 'common').toLowerCase();
  const hasArtist = !!card.artist;
  const isOldSet = card.set.series && ['Base', 'Jungle', 'Fossil'].includes(card.set.series);
  const isHolofoil = card.supertype === 'Pokémon' && rarity.includes('holo');

  let value = 'This card has moderate collector appeal.';

  if (isOldSet) {
    value = 'Being from a classic early set, this card has significant vintage appeal.';
  } else if (rarity.includes('secret') || rarity.includes('rainbow')) {
    value = 'As a highly exclusive card, this commands premium prices from serious collectors.';
  } else if (rarity.includes('rare')) {
    value = 'This rare card is sought after by intermediate to advanced collectors.';
  }

  if (hasArtist) {
    value += ` The artwork by ${card.artist} adds to its appeal.`;
  }

  if (card.hp && card.hp > 150) {
    value += ' Its high HP also makes it popular among players.';
  }

  return value;
}

// Utility: Determine market position based on rarity
function generateMarketPosition(card: Card): string {
  const rarity = (card.rarity || 'common').toLowerCase();
  const isHolo = rarity.includes('holo') || rarity.includes('rainbow') || rarity.includes('rare');

  const positions: { [key: string]: string } = {
    common: 'Budget-friendly entry point for collectors',
    uncommon: 'Affordable option for casual collectors',
    rare: 'Mid-tier market with moderate trading activity',
    holofoil: 'Premium tier with strong collector demand',
    secret: 'Exclusive tier reserved for serious collectors',
  };

  if (isHolo && rarity.includes('secret')) {
    return positions['secret'];
  } else if (isHolo) {
    return positions['holofoil'];
  } else if (rarity.includes('rare')) {
    return positions['rare'];
  } else if (rarity.includes('uncommon')) {
    return positions['uncommon'];
  }

  return positions['common'];
}

// Utility: Extract key features
function extractKeyFeatures(card: Card): string[] {
  const features: string[] = [];

  // Type features
  if (card.types && card.types.length > 0) {
    features.push(`${card.types[0]}-type Pokémon`);
  }

  // Attack features
  if (card.attacks && card.attacks.length > 0) {
    const strongAttack = card.attacks.find((a) => parseInt(a.damage || '0') > 100);
    if (strongAttack) {
      features.push(`Powerful ${strongAttack.name} attack`);
    }
  }

  // Ability features
  if (card.abilities && card.abilities.length > 0) {
    features.push(`Ability: ${card.abilities[0].name}`);
  }

  // Evolution features
  if (card.evolves_from) {
    features.push(`Evolves from ${card.evolves_from}`);
  }

  // HP features
  if (card.hp) {
    if (card.hp >= 150) {
      features.push('High HP');
    } else if (card.hp >= 100) {
      features.push('Moderate HP');
    }
  }

  // Rarity features
  if (card.rarity) {
    const rarityLevel = card.rarity.toLowerCase();
    if (rarityLevel.includes('rainbow') || rarityLevel.includes('secret')) {
      features.push('Ultra-rare variant');
    } else if (rarityLevel.includes('holo')) {
      features.push('Holographic variant');
    }
  }

  return features.slice(0, 5); // Limit to 5 key features
}

// Utility: Generate main description
function generateDescription(card: Card): string {
  const name = card.name;
  const setName = card.set.name;
  const setYear = card.set.series;
  const rarity = card.rarity || 'Unknown';
  const types = card.types && card.types.length > 0 ? card.types[0] : 'Unknown-type';

  let description = `The ${name} from ${setName} is a ${rarity} ${types} Pokémon card. `;

  if (card.flavor_text) {
    description += `${card.flavor_text.substring(0, 150)}... `;
  }

  if (card.hp) {
    description += `This card features ${card.hp} HP. `;
  }

  if (card.attacks && card.attacks.length > 0) {
    const firstAttack = card.attacks[0];
    description += `Its primary attack, ${firstAttack.name}, deals ${firstAttack.damage || 'variable'} damage. `;
  }

  if (card.artist) {
    description += `The artwork was created by ${card.artist}.`;
  }

  return description;
}

// Utility: Generate content for a card
function generateCardContent(card: Card): GeneratedContent {
  const timestamp = new Date().toISOString();
  const keyFeatures = extractKeyFeatures(card);

  return {
    cardId: card.id,
    cardName: card.name,
    generated_at: timestamp,
    description: generateDescription(card),
    rarity_analysis: generateRarityAnalysis(card),
    collector_value: generateCollectorValue(card),
    market_position: generateMarketPosition(card),
    key_features: keyFeatures,
  };
}

// Utility: Save content to file
function saveContent(content: GeneratedContent, dryRun: boolean): void {
  if (dryRun) {
    console.log(`🏜️  [DRY RUN] Would save content for ${content.cardId}`);
    return;
  }

  const contentFile = path.join(CONTENT_DIR, `${content.cardId}.json`);
  fs.writeFileSync(contentFile, JSON.stringify(content, null, 2));
}

// Main execution
async function main(): Promise<void> {
  try {
    const forceRegenerate = getForceRegenerate();
    const dryRun = getDryRun();
    const cardLimit = getCardLimit();

    console.log('\n📝 PriceDex: Content Generation Pipeline');
    console.log('==========================================');

    if (dryRun) {
      console.log('🏜️  Running in DRY RUN mode - no files will be saved');
    }

    if (forceRegenerate) {
      console.log('🔄 FORCE mode: Regenerating all content');
    }

    // Ensure content directory exists
    ensureContentDir();

    // Load cards
    console.log('\n📖 Loading cards...');
    const cards = loadCards();
    console.log(`✅ Loaded ${cards.length} cards`);

    // Filter cards to process
    const cardsToProcess = cardLimit ? cards.slice(0, cardLimit) : cards;
    const cardsNeedingContent = forceRegenerate
      ? cardsToProcess
      : cardsToProcess.filter((card) => !hasContent(card.id));

    console.log(`\n📝 Generating content for ${cardsNeedingContent.length} cards...`);

    let generatedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < cardsNeedingContent.length; i++) {
      const card = cardsNeedingContent[i];

      try {
        // Generate content
        const content = generateCardContent(card);
        saveContent(content, dryRun);
        generatedCount++;

        // Progress output every 50 cards
        if ((i + 1) % 50 === 0) {
          const progressPercent = Math.round(((i + 1) / cardsNeedingContent.length) * 100);
          console.log(
            `✅ Generated content for ${i + 1}/${cardsNeedingContent.length} cards (${progressPercent}%)`
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.warn(`⚠️  Error generating content for ${card.id}: ${errorMsg}`);
        skippedCount++;
      }
    }

    console.log(`\n✅ Content generation complete`);
    console.log(`   Generated: ${generatedCount} cards`);
    if (!forceRegenerate) {
      console.log(`   Skipped (already exist): ${skippedCount} cards`);
    }

    // Summary statistics
    const totalContentFiles = fs.readdirSync(CONTENT_DIR).length;
    console.log(`   Total content files: ${totalContentFiles}`);

    // Example: Show sample content
    if (cardsNeedingContent.length > 0 && !dryRun) {
      const sampleCard = cardsNeedingContent[0];
      const sampleContent = loadContent(sampleCard.id);
      if (sampleContent) {
        console.log(`\n📄 Sample content for "${sampleContent.cardName}":`);
        console.log(`   Description: ${sampleContent.description.substring(0, 80)}...`);
        console.log(`   Market Position: ${sampleContent.market_position}`);
        console.log(`   Key Features: ${sampleContent.key_features.join(', ')}`);
      }
    }

    console.log('\n🎉 Content generation pipeline complete!');
    console.log('💡 Tip: Use --force to regenerate all content, --dry-run to test first');
    process.exit(0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`\n💥 Script failed: ${errorMsg}`);
    process.exit(1);
  }
}

main();
