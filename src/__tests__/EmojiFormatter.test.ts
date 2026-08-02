import {
    EmojiEntry,
    emojiList,
    extractEmoji,
    removeFromText,
    textLength,
    format,
    lengthWithEmojis,
    hasEmoji,
    replaceEmojis,
    countUnique,
    onlyEmojis,
    stripAllButEmojis,
    normalizeSkinTones,
    emojiFrequencySorted,
    filterByEmojiSet,
    annotateText,
    getFirstEmoji,
    removeDuplicates,
    isOnlyEmoji,
    countEmojis,
    uniqueEmojis,
    getLastEmoji,
    mostFrequentEmoji,
    isEmoji,
    segmentText,
    emojiDensity,
    hasSkinTone,
    applySkinTone,
    toCodePoints,
    fromCodePoints,
    randomEmoji,
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

    test('replaceEmojis should apply the replacer to each emoji', () => {
        const result = replaceEmojis('Hello 👋 world 🌍!', e => `[${e}]`);
        expect(result).toBe('Hello [👋] world [🌍]!');
    });

    test('countUnique should count occurrences of each emoji', () => {
        expect(countUnique('😊😊😊😄')).toEqual({ '😊': 3, '😄': 1 });
    });

    test('emojiList should contain known emojis', () => {
        expect(emojiList.size).toBeGreaterThan(3000);
        expect(emojiList.has('😀')).toBe(true);
        expect(emojiList.has('a')).toBe(false);
    });

    test('should handle ZWJ sequences as a single emoji', () => {
        const family = '👨‍👩‍👧‍👦';
        expect(onlyEmojis(`hi ${family}!`)).toEqual([family]);
        expect(removeFromText(`hi ${family}!`)).toBe('hi !');
    });

    test('should handle flag emojis', () => {
        expect(onlyEmojis('go 🇺🇦 team')).toEqual(['🇺🇦']);
    });

    test('should handle skin tone variants', () => {
        expect(onlyEmojis('nice 👍🏽!')).toEqual(['👍🏽']);
        expect(hasEmoji('👍🏽')).toBe(true);
    });

    test('format should handle multi-grapheme ranges without shifting later indices', () => {
        const base = 'aabcc';
        const emojis: EmojiEntry[] = [
            { emoji: '🎯', indices: [0, 2] },
            { emoji: '🚀', indices: [3, 4] },
        ];
        expect(format(emojis, base)).toBe('🎯b🚀c');
    });

    test('format should accept entries in any order', () => {
        const base = 'abcde';
        const emojis: EmojiEntry[] = [
            { emoji: '🚀', indices: [3, 4] },
            { emoji: '🎯', indices: [1, 2] },
        ];
        expect(format(emojis, base)).toBe('a🎯c🚀e');
    });

    test('should handle empty strings', () => {
        expect(extractEmoji('')).toEqual([]);
        expect(removeFromText('')).toBe('');
        expect(hasEmoji('')).toBe(false);
        expect(getFirstEmoji('')).toBeNull();
        expect(countUnique('')).toEqual({});
    });

    test('countEmojis should count all emojis including duplicates', () => {
        expect(countEmojis('🔥🔥💧 text 💧💧')).toBe(5);
        expect(countEmojis('no emoji')).toBe(0);
    });

    test('uniqueEmojis should return unique emojis in order of appearance', () => {
        expect(uniqueEmojis('🔥💧🔥✨💧')).toEqual(['🔥', '💧', '✨']);
        expect(uniqueEmojis('none')).toEqual([]);
    });

    test('getLastEmoji should return the last emoji', () => {
        expect(getLastEmoji('a 🎯 b 🚀 c')).toBe('🚀');
        expect(getLastEmoji('no emoji')).toBeNull();
    });

    test('mostFrequentEmoji should return the top emoji', () => {
        expect(mostFrequentEmoji('🔥🔥💧💧💧')).toBe('💧');
        expect(mostFrequentEmoji('no emoji')).toBeNull();
    });

    test('mostFrequentEmoji should break ties by first appearance', () => {
        expect(mostFrequentEmoji('🎯🚀🎯🚀')).toBe('🎯');
    });

    test('isEmoji should check for a single known emoji', () => {
        expect(isEmoji('😀')).toBe(true);
        expect(isEmoji('👨‍👩‍👧‍👦')).toBe(true);
        expect(isEmoji('😀😀')).toBe(false);
        expect(isEmoji('a')).toBe(false);
        expect(isEmoji('')).toBe(false);
    });

    test('segmentText should split text into text and emoji segments', () => {
        expect(segmentText('Hi 👋 world 🌍!')).toEqual([
            { type: 'text', value: 'Hi ' },
            { type: 'emoji', value: '👋' },
            { type: 'text', value: ' world ' },
            { type: 'emoji', value: '🌍' },
            { type: 'text', value: '!' },
        ]);
        expect(segmentText('👋🌍')).toEqual([
            { type: 'emoji', value: '👋' },
            { type: 'emoji', value: '🌍' },
        ]);
        expect(segmentText('plain')).toEqual([{ type: 'text', value: 'plain' }]);
        expect(segmentText('')).toEqual([]);
    });

    test('emojiDensity should return the emoji share of the text', () => {
        expect(emojiDensity('👋🌍')).toBe(1);
        expect(emojiDensity('ab👋🌍')).toBe(0.5);
        expect(emojiDensity('plain')).toBe(0);
        expect(emojiDensity('')).toBe(0);
    });

    test('hasSkinTone should detect skin tone modifiers', () => {
        expect(hasSkinTone('👍🏽')).toBe(true);
        expect(hasSkinTone('👍')).toBe(false);
        expect(hasSkinTone('text 👋🏿 here')).toBe(true);
    });

    test('applySkinTone should apply a tone to supporting emojis', () => {
        expect(applySkinTone('👍', 'medium')).toBe('👍🏽');
        expect(applySkinTone('👋', 'dark')).toBe('👋🏿');
    });

    test('applySkinTone should replace an existing tone', () => {
        expect(applySkinTone('👍🏻', 'dark')).toBe('👍🏿');
    });

    test('applySkinTone should handle variation selector emojis', () => {
        expect(applySkinTone('✍️', 'medium')).toBe('✍🏽');
    });

    test('applySkinTone should leave unsupported emojis unchanged', () => {
        expect(applySkinTone('🌍', 'dark')).toBe('🌍');
        expect(applySkinTone('🔥', 'light')).toBe('🔥');
    });

    test('toCodePoints should convert an emoji to code point notation', () => {
        expect(toCodePoints('😀')).toEqual(['U+1F600']);
        expect(toCodePoints('👍🏽')).toEqual(['U+1F44D', 'U+1F3FD']);
    });

    test('fromCodePoints should build a string from code points', () => {
        expect(fromCodePoints(['U+1F600'])).toBe('😀');
        expect(fromCodePoints(['U+1F44D', 'U+1F3FD'])).toBe('👍🏽');
        expect(fromCodePoints(['1F600'])).toBe('😀');
    });

    test('fromCodePoints should round-trip with toCodePoints', () => {
        const family = '👨‍👩‍👧‍👦';
        expect(fromCodePoints(toCodePoints(family))).toBe(family);
    });

    test('fromCodePoints should throw on invalid input', () => {
        expect(() => fromCodePoints(['not-a-code-point'])).toThrow(TypeError);
    });

    test('randomEmoji should return a known emoji', () => {
        for (let i = 0; i < 20; i++) {
            expect(emojiList.has(randomEmoji())).toBe(true);
        }
    });
});
