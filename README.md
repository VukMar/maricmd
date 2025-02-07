![Maricmd Logo](https://vukmaric.com/backend/api/maricmd/maricmd.png)

# MARICMD

Maricmd is a simple Markdown to HTML converter written in JavaScript. It allows you to easily convert Markdown text into HTML markup.


## Installation

You can install maricmd via npm:

```bash
npm install maricmd
```

## Usage

### Common:

```javascript
const maricmd = require('maricmd');

const markdownText = `
# Hello, world!

This is **bold** and *italic* text.

Here are [link1](https://www.example1.com) and [link2](https://www.example2.com) in one paragraph.

`;

const maricmdInstance = new maricmd(markdownText);

console.log("Elements:\n");
console.log(maricmdInstance.elements);

console.log("HTML:\n");
console.log(maricmdInstance.html);

```

Parsing Markdown Elements
The maricmd function returns an object containing both the HTML markup (html) and an array of parsed Markdown elements (elements). You can use these elements to further manipulate or analyze the Markdown content in your application.

For example, you can iterate over the elements array to extract specific information or apply custom styling based on the Markdown structure.

Rendering HTML
The html string generated by maricmd can be directly inserted into your HTML documents to render the Markdown content. You can use it within React components, server-side templates, or any other HTML-rendering environment.

#### For example, in a React component, you can render the HTML markup using the dangerouslySetInnerHTML attribute:

```javascript
import React from 'react';
import maricmd from 'maricmd';

const MarkdownComponent = () => {
  const markdownText = `
# Hello, world!

This is **bold** and *italic* text.

Here are [link1](https://www.example1.com) and [link2](https://www.example2.com) in one paragraph.
`;

  const maricmdInstance = new maricmd(markdownText);

  return <div dangerouslySetInnerHTML={{ __html: maricmdInstance.html }} />;
};

export default MarkdownComponent;
```

## Supported Markdown Elements

Below is a list of Markdown elements and their implementation status in maricmd:

- [x] Headings
- [x] Paragraphs
- [x] Emphasis (Italic and Bold)
- [x] Lists (Ordered and Unordered)
- [x] Links
- [x] Images
- [x] Code Blocks
- [x] Horizontal Rules
- [x] Blockquotes
- [x] Inline Code
- [ ] Tables
- [ ] Strikethrough
- [ ] Task lists
- [ ] Definition lists
- [ ] Footnotes

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
