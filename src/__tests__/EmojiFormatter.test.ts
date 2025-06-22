import {
    EmojiEntry,
    extractEmoji,
    removeFromText,
    textLength,
    format,
    lengthWithEmojis,
    hasEmoji,
    onlyEmojis,
    stripAllButEmojis,
    normalizeSkinTones,
    emojiFrequencySorted,
    filterByEmojiSet,
    annotateText,
    getFirstEmoji,
    removeDuplicates,
    isOnlyEmoji,
} from '../utils/EmojiFormatter';

describe('EmojiFormatter', () => {
    test('extractEmoji should find emojis with correct indices', () => {
        const text = 'Hello 👋 world 🌍!';
        const result = extractEmoji(text);

        expect(result).toEqual([
            { emoji: '👋', indices: [6, 7] },
            { emoji: '🌍', indices: [14, 15] },
        ]);
    });

    test('removeFromText should strip emojis', () => {
        const input = 'Hi 👋🌍!';
        const result = removeFromText(input);
        expect(result).toBe('Hi !');
    });

    test('textLength should count characters without emojis', () => {
        const result = textLength('Test 🚀');
        expect(result).toBe(5);
    });

    test('lengthWithEmojis should count all characters including emojis', () => {
        const result = lengthWithEmojis('Test 🚀');
        expect(result).toBe(6);
    });

    test('hasEmoji should detect presence of emoji', () => {
        expect(hasEmoji('No emoji here')).toBe(false);
        expect(hasEmoji('One 😊 here')).toBe(true);
    });

    test('onlyEmojis should return emojis only', () => {
        const result = onlyEmojis('Hey 🌟✨');
        expect(result).toEqual(['🌟', '✨']);
    });

    test('stripAllButEmojis should remove non-emojis', () => {
        const result = stripAllButEmojis('Hi 💥 there 🎉!');
        expect(result).toBe('💥🎉');
    });

    test('normalizeSkinTones should remove tone modifiers', () => {
        expect(normalizeSkinTones('👍🏽')).toBe('👍');
    });

    test('emojiFrequencySorted should return sorted emoji usage', () => {
        const result = emojiFrequencySorted('🔥🔥💧💧💧');
        expect(result).toEqual([
            { emoji: '💧', count: 3 },
            { emoji: '🔥', count: 2 },
        ]);
    });

    test('annotateText should wrap emojis in tags', () => {
        const result = annotateText('Go 🚗 now');
        expect(result).toBe('Go <emoji>🚗</emoji> now');
    });

    test('getFirstEmoji should return the first emoji', () => {
        expect(getFirstEmoji('Some 🎯 emoji')).toBe('🎯');
        expect(getFirstEmoji('No emoji')).toBeNull();
    });

    test('removeDuplicates should keep only first occurrence', () => {
        expect(removeDuplicates('😄😄😃😄')).toBe('😄😃');
    });

    test('filterByEmojiSet should filter only allowed emojis', () => {
        const text = '👋🌍✨👍';
        const set = new Set(['🌍', '👍']);
        const result = filterByEmojiSet(text, set);
        expect(result).toEqual([
            { emoji: '🌍', indices: [1, 2] },
            { emoji: '👍', indices: [3, 4] },
        ]);
    });

    test('format should restore emojis into text', () => {
        const base = 'abcde';
        const emojis: EmojiEntry[] = [
            { emoji: '🎯', indices: [1, 2] },
            { emoji: '🚀', indices: [3, 4] },
        ];
        const result = format(emojis, base);
        expect(result).toBe('a🎯c🚀e');
    });

    test('isOnlyEmoji should validate emoji-only strings', () => {
        expect(isOnlyEmoji('😊👍')).toBe(true);
        expect(isOnlyEmoji('😊 text')).toBe(false);
    });
});
