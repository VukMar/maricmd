# VMark - Markdown to HTML Converter

VMark is a lightweight Markdown to HTML converter written in pure JavaScript. It allows you to easily convert Markdown text to HTML for rendering in web applications.

## Installation

You can install VMark via npm:

```
npm install vmark
```

## Usage

```javascript
const vmark = require('vmark');

const markdownText = `
# My Markdown Example

This is a **bold** text and this is *italic*.

- Item 1
- Item 2
- Item 3
`;

const html = vmark(markdownText);
console.log(html);
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Feel free to adjust and customize the content as needed for your project's specific requirements.