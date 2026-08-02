import { emojis } from '../data/emojis';

/**
 * An extracted emoji and its position in text.
 *
 * `indices` is a `[start, end]` range in grapheme-cluster space
 * (as segmented by `Intl.Segmenter`), not in UTF-16 code units.
 */
export interface EmojiEntry {
    emoji: string;
    indices: [number, number];
}

/**
 * Set of all known fully-qualified emoji sequences.
 */
export const emojiList: Set<string> = new Set(emojis);

/**
 * Longest emoji sequence to attempt when matching, in grapheme clusters.
 * Modern segmenters treat ZWJ sequences, flags, and keycaps as a single
 * grapheme, but older ICU data may split them — the lookahead covers that.
 */
const MAX_EMOJI_GRAPHEMES = 8;

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

function toGraphemes(text: string): string[] {
    return Array.from(segmenter.segment(text), s => s.segment);
}

function extractFromGraphemes(graphemes: string[]): EmojiEntry[] {
    const entries: EmojiEntry[] = [];
    let i = 0;

    while (i < graphemes.length) {
        for (let j = Math.min(i + MAX_EMOJI_GRAPHEMES, graphemes.length); j > i; j--) {
            const candidate = graphemes.slice(i, j).join('');
            if (emojiList.has(candidate)) {
                entries.push({ emoji: candidate, indices: [i, j] });
                i = j - 1;
                break;
            }
        }

        i++;
    }

    return entries;
}

/**
 * Extracts all known emojis from text along with their positions.
 *
 * @param text The input text.
 * @returns Entries with the emoji and its `[start, end]` grapheme range.
 */
export function extractEmoji(text: string): EmojiEntry[] {
    return extractFromGraphemes(toGraphemes(text));
}

/**
 * Replaces every emoji in the text using the given replacer function.
 *
 * @param text The input text.
 * @param replacer Receives each emoji and returns its replacement.
 * @returns The text with all emojis replaced.
 */
export function replaceEmojis(text: string, replacer: (emoji: string) => string): string {
    const graphemes = toGraphemes(text);
    let result = '';
    let last = 0;

    for (const { emoji, indices } of extractFromGraphemes(graphemes)) {
        result += graphemes.slice(last, indices[0]).join('');
        result += replacer(emoji);
        last = indices[1];
    }

    result += graphemes.slice(last).join('');
    return result;
}

/**
 * Removes all emojis from the text.
 *
 * @param text The input text.
 * @returns The text without emojis.
 */
export function removeFromText(text: string): string {
    return replaceEmojis(text, () => '');
}

/**
 * Length of the text (in UTF-16 code units) after removing all emojis.
 *
 * @param text The input text.
 * @returns The emoji-free length.
 */
export function textLength(text: string): number {
    return removeFromText(text).length;
}

/**
 * Restores emojis into a base text at the given grapheme positions.
 * Each entry's `[start, end]` grapheme range is replaced by its emoji.
 *
 * @param emojiEntries Entries to insert (as produced by `extractEmoji`).
 * @param originalText The base text to insert into.
 * @returns The text with emojis restored.
 */
export function format(emojiEntries: EmojiEntry[], originalText: string): string {
    const graphemes = toGraphemes(originalText);
    // Splice from the end so earlier replacements don't shift later indices.
    const sorted = [...emojiEntries].sort((a, b) => b.indices[0] - a.indices[0]);
    for (const { emoji, indices } of sorted) {
        graphemes.splice(indices[0], indices[1] - indices[0], emoji);
    }
    return graphemes.join('');
}

/**
 * Length of the text in Unicode code points, emojis included.
 *
 * @param text The input text.
 * @returns The code-point count.
 */
export function lengthWithEmojis(text: string): number {
    return [...text].length;
}

/**
 * Whether the text contains at least one emoji.
 *
 * @param text The input text.
 * @returns `true` if an emoji is present.
 */
export function hasEmoji(text: string): boolean {
    return extractEmoji(text).length > 0;
}

/**
 * Counts occurrences of each emoji in the text.
 *
 * @param text The input text.
 * @returns A map from emoji to its number of occurrences.
 */
export function countUnique(text: string): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const { emoji } of extractEmoji(text)) {
        counts[emoji] = (counts[emoji] || 0) + 1;
    }
    return counts;
}

/**
 * Extracts only the emojis from the text, in order of appearance.
 *
 * @param text The input text.
 * @returns The emojis found.
 */
export function onlyEmojis(text: string): string[] {
    return extractEmoji(text).map(e => e.emoji);
}

/**
 * Removes everything except emojis from the text.
 *
 * @param text The input text.
 * @returns All emojis concatenated in order of appearance.
 */
export function stripAllButEmojis(text: string): string {
    return onlyEmojis(text).join('');
}

const SKIN_TONE_REGEX = /[\u{1F3FB}-\u{1F3FF}]/gu;

/**
 * Removes skin tone modifiers (U+1F3FB–U+1F3FF) from an emoji or text.
 *
 * @param emoji The emoji or text to normalize.
 * @returns The input without skin tone modifiers.
 */
export function normalizeSkinTones(emoji: string): string {
    return emoji.replace(SKIN_TONE_REGEX, '');
}

/**
 * Emoji usage in the text, sorted by frequency (descending).
 *
 * @param text The input text.
 * @returns Entries of `{ emoji, count }`, most frequent first.
 */
export function emojiFrequencySorted(text: string): { emoji: string; count: number }[] {
    return Object.entries(countUnique(text))
        .map(([emoji, count]) => ({ emoji, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Extracts only the emojis that are present in the given allow-set.
 *
 * @param text The input text.
 * @param emojiSet The set of allowed emojis.
 * @returns Entries for allowed emojis only.
 */
export function filterByEmojiSet(text: string, emojiSet: Set<string>): EmojiEntry[] {
    return extractEmoji(text).filter(entry => emojiSet.has(entry.emoji));
}

/**
 * Wraps every emoji in the text in `<emoji>` tags.
 *
 * @param text The input text.
 * @returns The annotated text.
 */
export function annotateText(text: string): string {
    return replaceEmojis(text, emoji => `<emoji>${emoji}</emoji>`);
}

/**
 * Whether the text consists solely of emojis and whitespace.
 *
 * @param text The input text.
 * @returns `true` if nothing but emojis and whitespace is present.
 */
export function isOnlyEmoji(text: string): boolean {
    return removeFromText(text).trim().length === 0;
}

/**
 * Returns the first emoji in the text, if any.
 *
 * @param text The input text.
 * @returns The first emoji, or `null` if none is present.
 */
export function getFirstEmoji(text: string): string | null {
    const found = extractEmoji(text);
    return found.length > 0 ? found[0].emoji : null;
}

/**
 * Removes duplicate emojis, keeping only the first occurrence of each.
 *
 * @param text The input text.
 * @returns The text with duplicate emojis removed.
 */
export function removeDuplicates(text: string): string {
    const seen = new Set<string>();
    return replaceEmojis(text, emoji => {
        if (seen.has(emoji)) return '';
        seen.add(emoji);
        return emoji;
    });
}

/**
 * Total number of emojis in the text (including duplicates).
 *
 * @param text The input text.
 * @returns The emoji count.
 */
export function countEmojis(text: string): number {
    return extractEmoji(text).length;
}

/**
 * Unique emojis in the text, in order of first appearance.
 *
 * @param text The input text.
 * @returns The unique emojis.
 */
export function uniqueEmojis(text: string): string[] {
    return [...new Set(onlyEmojis(text))];
}

/**
 * Returns the last emoji in the text, if any.
 *
 * @param text The input text.
 * @returns The last emoji, or `null` if none is present.
 */
export function getLastEmoji(text: string): string | null {
    const found = extractEmoji(text);
    return found.length > 0 ? found[found.length - 1].emoji : null;
}

/**
 * Returns the most frequent emoji in the text.
 * Ties are resolved in favor of the emoji that appeared first.
 *
 * @param text The input text.
 * @returns The most frequent emoji, or `null` if none is present.
 */
export function mostFrequentEmoji(text: string): string | null {
    const sorted = emojiFrequencySorted(text);
    return sorted.length > 0 ? sorted[0].emoji : null;
}

/**
 * Whether the value is exactly one known fully-qualified emoji.
 *
 * @param value The string to check.
 * @returns `true` if the value is a single known emoji.
 */
export function isEmoji(value: string): boolean {
    return emojiList.has(value);
}

/**
 * A contiguous piece of text: either plain text or a single emoji.
 */
export interface TextSegment {
    type: 'text' | 'emoji';
    value: string;
}

/**
 * Splits the text into a sequence of plain-text and emoji segments.
 * Useful for renderers that replace emojis with custom elements.
 *
 * @param text The input text.
 * @returns Segments in original order; adjacent plain text is merged.
 */
export function segmentText(text: string): TextSegment[] {
    const graphemes = toGraphemes(text);
    const segments: TextSegment[] = [];
    let last = 0;

    for (const { emoji, indices } of extractFromGraphemes(graphemes)) {
        if (indices[0] > last) {
            segments.push({ type: 'text', value: graphemes.slice(last, indices[0]).join('') });
        }
        segments.push({ type: 'emoji', value: emoji });
        last = indices[1];
    }

    if (last < graphemes.length) {
        segments.push({ type: 'text', value: graphemes.slice(last).join('') });
    }

    return segments;
}

/**
 * Share of the text taken up by emojis, from 0 to 1,
 * measured in grapheme clusters.
 *
 * @param text The input text.
 * @returns The emoji density (0 for empty text).
 */
export function emojiDensity(text: string): number {
    const graphemes = toGraphemes(text);
    if (graphemes.length === 0) return 0;

    const emojiGraphemes = extractFromGraphemes(graphemes)
        .reduce((sum, { indices }) => sum + (indices[1] - indices[0]), 0);
    return emojiGraphemes / graphemes.length;
}

/**
 * Supported skin tone names, mapping to modifiers U+1F3FB–U+1F3FF.
 */
export type SkinTone = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';

const SKIN_TONE_MODIFIERS: Record<SkinTone, string> = {
    'light': '\u{1F3FB}',
    'medium-light': '\u{1F3FC}',
    'medium': '\u{1F3FD}',
    'medium-dark': '\u{1F3FE}',
    'dark': '\u{1F3FF}',
};

const SKIN_TONE_TEST_REGEX = /[\u{1F3FB}-\u{1F3FF}]/u;

/**
 * Whether the emoji (or text) contains a skin tone modifier.
 *
 * @param emoji The emoji or text to check.
 * @returns `true` if a skin tone modifier is present.
 */
export function hasSkinTone(emoji: string): boolean {
    return SKIN_TONE_TEST_REGEX.test(emoji);
}

/**
 * Applies a skin tone to an emoji, replacing any existing tone.
 * Returns the emoji unchanged if it does not support skin tones.
 *
 * @param emoji The emoji to modify.
 * @param tone The skin tone to apply.
 * @returns The toned emoji, or the original if unsupported.
 */
export function applySkinTone(emoji: string, tone: SkinTone): string {
    const modifier = SKIN_TONE_MODIFIERS[tone];
    const base = normalizeSkinTones(emoji);
    // Toned forms drop the variation selector (e.g. ✍️ U+270D U+FE0F → ✍🏽 U+270D U+1F3FD),
    // so try both the base as-is and with selectors stripped.
    const bases = new Set([base, base.replace(/\uFE0F/gu, '')]);

    for (const candidate of bases) {
        const codePoints = Array.from(candidate);
        for (let i = 1; i <= codePoints.length; i++) {
            const toned = [...codePoints.slice(0, i), modifier, ...codePoints.slice(i)].join('');
            if (emojiList.has(toned)) return toned;
        }
    }

    return emoji;
}

/**
 * Converts an emoji (or any string) to its Unicode code point notation.
 *
 * @param emoji The emoji to convert.
 * @returns Code points like `["U+1F44D", "U+1F3FD"]`.
 */
export function toCodePoints(emoji: string): string[] {
    return Array.from(emoji).map(ch => 'U+' + ch.codePointAt(0)!.toString(16).toUpperCase());
}

/**
 * Builds a string from Unicode code point notation, inverse of `toCodePoints`.
 *
 * @param codePoints Code points like `["U+1F44D", "U+1F3FD"]` (the `U+` prefix is optional).
 * @returns The assembled string.
 * @throws {TypeError} If a code point is not valid.
 */
export function fromCodePoints(codePoints: string[]): string {
    return codePoints
        .map(cp => {
            const value = Number.parseInt(cp.replace(/^U\+/i, ''), 16);
            if (Number.isNaN(value)) {
                throw new TypeError(`Invalid code point: ${cp}`);
            }
            return String.fromCodePoint(value);
        })
        .join('');
}

/**
 * Returns a random emoji from the full emoji list.
 *
 * @returns A random known emoji.
 */
export function randomEmoji(): string {
    return emojis[Math.floor(Math.random() * emojis.length)];
}
