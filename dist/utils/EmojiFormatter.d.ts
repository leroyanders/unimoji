/**
 * Type representing an extracted emoji and its position in text.
 */
export interface EmojiEntry {
    emoji: string;
    indices: [number, number];
}
export declare const emojiList: Set<string>;
export declare function extractEmoji(text: string): EmojiEntry[];
export declare function removeFromText(text: string): string;
export declare function textLength(text: string): number;
export declare function format(emojiEntries: EmojiEntry[], originalText: string): string;
export declare function lengthWithEmojis(text: string): number;
export declare function hasEmoji(text: string): boolean;
export declare function replaceEmojis(text: string, replacer: (emoji: string) => string): string;
export declare function countUnique(text: string): Record<string, number>;
export declare function onlyEmojis(text: string): string[];
export declare function stripAllButEmojis(text: string): string;
export declare function normalizeSkinTones(emoji: string): string;
export declare function emojiFrequencySorted(text: string): {
    emoji: string;
    count: number;
}[];
export declare function filterByEmojiSet(text: string, emojiSet: Set<string>): EmojiEntry[];
export declare function annotateText(text: string): string;
export declare function isOnlyEmoji(text: string): boolean;
export declare function getFirstEmoji(text: string): string | null;
export declare function removeDuplicates(text: string): string;
