import fs from 'fs';
import path from 'path';

const EMOJI_URL = 'https://unicode.org/Public/emoji/latest/emoji-test.txt';
const OUTPUT_PATH = path.resolve(__dirname, '../data/emojis.ts');
const EMOJIS_PER_LINE = 16;

/**
 * Parses unicode.org's emoji-test.txt and returns all fully-qualified
 * emoji sequences, in file order, without duplicates.
 */
function parseEmojiTest(rawData: string): string[] {
    const seen = new Set<string>();

    for (const line of rawData.split('\n')) {
        if (!line.includes('; fully-qualified')) continue;

        // Format: "<codepoints> ; fully-qualified # <emoji> E<version> <name>"
        const comment = line.split('#')[1];
        if (!comment) continue;

        const emoji = comment.trim().split(' ')[0];
        if (emoji) seen.add(emoji);
    }

    return [...seen];
}

function renderModule(emojis: string[]): string {
    const lines: string[] = [];
    for (let i = 0; i < emojis.length; i += EMOJIS_PER_LINE) {
        lines.push('    ' + emojis.slice(i, i + EMOJIS_PER_LINE).map(e => JSON.stringify(e)).join(', ') + ',');
    }

    return `/**
 * List of all fully-qualified Unicode emoji sequences.
 *
 * Generated from ${EMOJI_URL}
 * by \`npm run generate:emoji\` — do not edit by hand.
 */
export const emojis: readonly string[] = [
${lines.join('\n')}
];
`;
}

async function main(): Promise<void> {
    const response = await fetch(EMOJI_URL);
    if (!response.ok) {
        throw new Error(`Failed to download emoji list: HTTP ${response.status} ${response.statusText}`);
    }

    const emojis = parseEmojiTest(await response.text());
    if (emojis.length === 0) {
        throw new Error('No fully-qualified emojis found — has the emoji-test.txt format changed?');
    }

    fs.writeFileSync(OUTPUT_PATH, renderModule(emojis), 'utf-8');
    console.log(`Saved ${emojis.length} emojis to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

main().catch(err => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
});
