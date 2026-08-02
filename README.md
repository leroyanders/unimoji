# unimoji

**Universal Emoji Toolkit** for TypeScript — parse, clean, count, extract, and manipulate emojis in text with ease.

---

## ✨ Features

- Extract emojis with position info
- Remove or replace emojis
- Count, filter, and sort emoji usage
- Restore emojis into cleaned text
- Handle skin tone modifiers, ZWJ sequences, and flags
- Zero runtime dependencies
- Works in Node.js ≥ 18 and any environment with [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)

---

## 📦 Installation

```bash
npm install unimoji
```

---

## 🛠 Usage

```ts
import {
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
    isOnlyEmoji,
    getFirstEmoji,
    removeDuplicates,
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
    randomEmoji
} from 'unimoji';

const input = 'Hello 👋 world 🌍!';

console.log(extractEmoji(input));
// => [ { emoji: '👋', indices: [6, 7] }, { emoji: '🌍', indices: [14, 15] } ]

console.log(removeFromText(input));
// => 'Hello  world !'

console.log(textLength(input));
// => 14

console.log(format([{ emoji: '🌍', indices: [5, 6] }], 'Hello !'));
// => 'Hello🌍!'

console.log(lengthWithEmojis(input));
// => 16

console.log(hasEmoji('One 😊 here'));
// => true

console.log(replaceEmojis(input, (e) => `[${e}]`));
// => 'Hello [👋] world [🌍]!'

console.log(countUnique('😊😊😊😄'));
// => { '😊': 3, '😄': 1 }

console.log(onlyEmojis(input));
// => ['👋', '🌍']

console.log(stripAllButEmojis(input));
// => '👋🌍'

console.log(normalizeSkinTones('👍🏽'));
// => '👍'

console.log(emojiFrequencySorted('🔥🔥💧💧💧'));
// => [ { emoji: '💧', count: 3 }, { emoji: '🔥', count: 2 } ]

console.log(filterByEmojiSet('👋🌍✨👍', new Set(['🌍', '👍'])));
// => [ { emoji: '🌍', indices: [1, 2] }, { emoji: '👍', indices: [3, 4] } ]

console.log(annotateText('Go 🚗 now'));
// => 'Go <emoji>🚗</emoji> now'

console.log(isOnlyEmoji('😊👍'));
// => true

console.log(getFirstEmoji('Some 🎯 emoji'));
// => '🎯'

console.log(removeDuplicates('😄😄😃😄'));
// => '😄😃'

console.log(countEmojis('🔥🔥💧'));
// => 3

console.log(uniqueEmojis('🔥💧🔥✨'));
// => ['🔥', '💧', '✨']

console.log(getLastEmoji('a 🎯 b 🚀 c'));
// => '🚀'

console.log(mostFrequentEmoji('🔥🔥💧💧💧'));
// => '💧'

console.log(isEmoji('😀'));
// => true

console.log(segmentText('Hi 👋!'));
// => [ { type: 'text', value: 'Hi ' }, { type: 'emoji', value: '👋' }, { type: 'text', value: '!' } ]

console.log(emojiDensity('ab👋🌍'));
// => 0.5

console.log(hasSkinTone('👍🏽'));
// => true

console.log(applySkinTone('👍', 'medium'));
// => '👍🏽'

console.log(toCodePoints('👍🏽'));
// => ['U+1F44D', 'U+1F3FD']

console.log(fromCodePoints(['U+1F44D', 'U+1F3FD']));
// => '👍🏽'

console.log(randomEmoji());
// => e.g. '🎲'
```

---

## 📚 API

All methods are fully typed with JSDoc and available as named exports.

| Function               | Description                           |
|------------------------|---------------------------------------|
| `extractEmoji`         | Extract emojis with character indices |
| `removeFromText`       | Remove all emojis from text           |
| `textLength`           | Length of text without emojis         |
| `format`               | Reconstruct emojis into base text     |
| `lengthWithEmojis`     | Length of full text with emojis       |
| `hasEmoji`             | Whether any emoji is present          |
| `replaceEmojis`        | Replace emojis with custom string     |
| `countUnique`          | Count occurrences of each emoji       |
| `onlyEmojis`           | Get array of only emojis              |
| `stripAllButEmojis`    | Keep only emojis in text              |
| `normalizeSkinTones`   | Remove skin tone modifiers            |
| `emojiFrequencySorted` | Get emojis sorted by frequency        |
| `filterByEmojiSet`     | Filter emojis from allowed set        |
| `annotateText`         | Wrap each emoji in tags               |
| `isOnlyEmoji`          | Check if text contains only emojis    |
| `getFirstEmoji`        | Return first emoji (if any)           |
| `getLastEmoji`         | Return last emoji (if any)            |
| `removeDuplicates`     | Remove duplicate emojis               |
| `countEmojis`          | Total emoji count (with duplicates)   |
| `uniqueEmojis`         | Unique emojis in order of appearance  |
| `mostFrequentEmoji`    | The most used emoji in the text       |
| `isEmoji`              | Check if a string is a single emoji   |
| `segmentText`          | Split text into text/emoji segments   |
| `emojiDensity`         | Emoji share of the text (0 to 1)      |
| `hasSkinTone`          | Check for a skin tone modifier        |
| `applySkinTone`        | Apply or replace a skin tone          |
| `toCodePoints`         | Emoji → `U+...` code point notation   |
| `fromCodePoints`       | `U+...` code points → string          |
| `randomEmoji`          | Random emoji from the full list       |
| `emojiList`            | `Set` of all known emoji sequences    |

> **Note:** `indices` in `EmojiEntry` are `[start, end)` positions in
> grapheme clusters (as segmented by `Intl.Segmenter`), not UTF-16 code units.

---

## 🧑‍💻 Development

```bash
npm ci             # install dependencies
npm test           # run tests
npm run build      # compile to dist/
npm run generate:emoji  # regenerate src/data/emojis.ts from unicode.org
```

---

## 📄 License

MIT © 2025 Leroy Anders
