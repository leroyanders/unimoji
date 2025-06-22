"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const EMOJI_URL = 'https://unicode.org/Public/emoji/latest/emoji-test.txt';
const OUTPUT_PATH = path_1.default.resolve(__dirname, '../emoji.json');
/**
 * Converts emoji characters into an array of cleaned Unicode strings like ["U+1F600", "U+1F3FB"],
 * excluding variation selectors like U+FE0F.
 *
 * @param emoji The emoji string.
 * @returns An array of Unicode strings.
 */
function toUnicodeSequence(emoji) {
    return Array.from(emoji)
        .filter(char => char.codePointAt(0) !== 0xFE0F)
        .map(char => 'U+' + char.codePointAt(0).toString(16).toUpperCase());
}
/**
 * Downloads the Unicode emoji-test.txt and extracts emoji + Unicode array.
 */
function downloadAndExtractEmojis() {
    https_1.default.get(EMOJI_URL, (res) => {
        let rawData = '';
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => {
            const results = [];
            for (const line of rawData.split('\n')) {
                if (line.includes('; fully-qualified')) {
                    const parts = line.split('#');
                    if (parts.length >= 2) {
                        const rawEmoji = parts[1].trim().split(' ')[0];
                        const emoji = rawEmoji.trim();
                        results.push({
                            emoji,
                            unicode: toUnicodeSequence(emoji)
                        });
                    }
                }
            }
            fs_1.default.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), 'utf-8');
            console.log(`✅ Saved ${results.length} emojis to emoji.json`);
        });
    }).on('error', (err) => {
        console.error('❌ Failed to download emoji list:', err);
    });
}
downloadAndExtractEmojis();
