# unimoji

**Universal Emoji Toolkit** for TypeScript — parse, clean, count, extract, and manipulate emojis in text with ease.

---

## ✨ Features

- Extract emojis with position info
- Remove or replace emojis
- Count, filter, and sort emoji usage
- Restore emojis into cleaned text
- Handle skin tone modifiers
- Works in Node.js environments

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
    removeDuplicates
} from 'unimoji';

const input = 'Hello 👋 world 🌍!';

console.log(extractEmoji(input));
// => [ { emoji: '👋', indices: [6, 7] }, { emoji: '🌍', indices: [14, 15] } ]

console.log(removeFromText(input));
// => 'Hello  world !'

console.log(textLength(input));
// => 13

console.log(format([{ emoji: '🌍', indices: [5, 6] }], 'Hello !'));
// => 'Hello🌍!'

console.log(lengthWithEmojis(input));
// => 15

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
| `removeDuplicates`     | Remove duplicate emojis               |

---

## 📄 License

MIT © 2025 Vadym Dordiienko
