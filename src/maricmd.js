function parseLink(info, startIndex){
    let linkText = '';
    let linkUrl = '';
    let j = startIndex + 1;
    while (j < info.length && info[j] !== ']') {
        linkText += info[j];
        j++;
    }
    j++;
    if (info[j] === '(') {
        j++;
    
        while (j < info.length && info[j] !== ')') {
            linkUrl += info[j];
            j++;
        }
        j++;
    }
    let element ={ type: 'link',   content: {text: linkText, url: linkUrl} };
    return {element: element, i: j};
}

function parseInlineCode(markdown, startIndex) {
    let endIndex = startIndex + 1;
    while (endIndex < markdown.length && markdown[endIndex] !== '`') {
        endIndex++;
    }
    const codeContent = markdown.substring(startIndex + 1, endIndex);
    const inlineCodeElement = { type: 'inlineCode', content: codeContent };
    return { element: inlineCodeElement, i: endIndex+1 };
}

function parseCodeBlock(markdown, startIndex) {
    let endIndex = startIndex + 3; // Skip the opening ```
    let language = '';
    while (endIndex < markdown.length && markdown[endIndex] !== '\n') {
        language += markdown[endIndex];
        endIndex++;
    }
    endIndex++; // Move past the newline character
    let content = '';
    while (endIndex < markdown.length && markdown.substring(endIndex, endIndex + 3) !== '```') {
        content += markdown[endIndex];
        endIndex++;
    }
    return {
        element: { type: 'codeBlock', language: language.trim(), content: content.trim() },
        endIndex: endIndex + 3 // Skip the closing ```
    };
}

function parseImage(markdown, startIndex) {
    let endIndex = markdown.indexOf(')', startIndex + 1);
    if (endIndex !== -1) {
        const imageSyntax = markdown.substring(startIndex, endIndex + 1);
        const altTextStartIndex = markdown.indexOf('[', startIndex);
        const altTextEndIndex = markdown.indexOf(']', altTextStartIndex + 1);
        if (altTextStartIndex !== -1 && altTextEndIndex !== -1) {
            const altText = markdown.substring(altTextStartIndex + 1, altTextEndIndex);
            const imageUrl = imageSyntax.substring(imageSyntax.indexOf('(') + 1, imageSyntax.lastIndexOf(')'));
            return { element: {type: 'image', altText: altText, imageUrl: imageUrl}, endIndex: endIndex };
        }
    }
    return { element: {type: 'image', altText: '', imageUrl: ''}, endIndex: endIndex };
}

function parseItallicBold(markdown, index) {
    let content = '';
    let endIndex = index;

    if (markdown[index + 2] === '*') {
        endIndex += 3;
        content += "<em><strong>";
        while (endIndex < markdown.length && markdown[endIndex] !== '*') {
            content += markdown[endIndex];
            endIndex++;
        }
        content += "</strong></em>";
        endIndex += 3;
    } else if (markdown[index + 1] === '*') {
        endIndex += 2;
        content += "<strong>";
        while (endIndex < markdown.length && markdown[endIndex] !== '*') {
            content += markdown[endIndex];
            endIndex++;
        }
        content += "</strong>";
        endIndex += 2;
    } else {
        endIndex++;
        content += "<em>";
        while (endIndex < markdown.length && markdown[endIndex] !== '*') {
            content += markdown[endIndex];
            endIndex++;
        }
        content += "</em>";
        endIndex++;
    }

    return { content: content, index: endIndex };
}


function parseParagraph(markdown, i) {
    let index = i;
    let content = '';
    while (
        markdown[index] !== undefined &&
        markdown[index] !== '\n' &&
        markdown[index] !== '\n\n' &&
        markdown[index] !== '\r'
    ) {
        if (markdown[index] === '[') {
            const linkParse = parseLink(markdown, index);
            content += decodeElement(linkParse.element);
            index = linkParse.i;
        } else if (markdown[index] === '`') {
            const inlineCode = parseInlineCode(markdown, index);
            content += decodeElement(inlineCode.element);
            index = inlineCode.i;
        } else if (markdown[index] === '*'){
            const inlineBoldItallic = parseItallicBold(markdown, index);
            index = inlineBoldItallic.index;
            content += inlineBoldItallic.content;
        } else {
            content += markdown[index];
            index++;
        }
    }
    return {
        element: { type: 'paragraph', content: content},
        endIndex: index
    };
}

function getListElement(markdown, i){
    let index = i + 2;
    let content = '';
    while(index < markdown.length && markdown[index] !== '\r' && markdown[index] !== '\n'){
        content += markdown[index];
        index++;
    }

    let newContent = '';
    let j = 0;
    while (j < content.length){
        if (content[j] === '[') {
            const linkParse = parseLink(content, j);
            newContent += decodeElement(linkParse.element);
            j = linkParse.i;
        } else if (content[j] === '`') {
            const inlineCode = parseInlineCode(content, j);
            newContent += decodeElement(inlineCode.element);
            j = inlineCode.i;
        } else if (content[j] === '*'){
            const inlineBoldItallic = parseItallicBold(content, j);
            j = inlineBoldItallic.j;
            newContent += inlineBoldItallic.content;
        } else {
            newContent += content[j];
            j++;
        }
    }

    return {index: index, content: `<li>${newContent}</li>`};
}


function parseList(markdown, i, listType) {
    let listitems = ''
    let index = i;
    if(listType === 'ul'){
        while (markdown[index] === '-' && index < markdown.length){
            const listitem = getListElement(markdown, index, listType);
            listitems += listitem.content;
            index = listitem.index + 2;
            console.log(markdown[index]);
        }
        return {element: {type: 'ul', content: listitems}, index: index};
    }else if (listType === 'ol') {
        while (/^\d+\./.test(markdown.substring(index, index + 3)) && index < markdown.length) {
            const listItem = getListElement(markdown, index, listType);
            listitems += listItem.content.trim();
            index = listItem.index + 2;
        }
        return { element: { type: 'ol', content: listitems }, index: index };
    }
}

function getElements(markdown, isParagraph){

    let elements = [];

    for (let i = 0; i < markdown.length; i++) {

        // Headings
        if (markdown[i] === '#' && !isParagraph) {
            let content = '';
            let level = 0;
            while (markdown[i] === '#') {
                level++;
                i++;
            }
            while (i < markdown.length && markdown[i] !== '\n') {
                content += markdown[i];
                i++;
            }
            elements.push({ type: 'heading', level: level, content: content.trim() });
        }

        // Links
        else if (markdown[i] === '[') {
            const linkParse = parseLink(markdown,i);
            elements.push(linkParse.element);
            i=linkParse.i;
        }

        // Code

        else if(markdown[i] === '`'){
            if(markdown[i+2] === '`'){
                const CodeBlock = parseCodeBlock(markdown, i);
                i = CodeBlock.endIndex;
                elements.push(CodeBlock.element);
            }else{
                const inlineCode = parseInlineCode(markdown, i);
                i = inlineCode.i;
                elements.push(inlineCode.element);
            }
        }

        // Image

        else if (markdown[i] === '!'){
            const image = parseImage(markdown, i);
            i = image.endIndex;
            elements.push(image.element);
        }
        
        // Blockquotes

        else if (markdown[i] === '>') {
            i += 1;
            let content = '';
            // Accumulate characters until a line break
            while (markdown[i] !== '\n' && i < markdown.length) {
                content += markdown[i];
                i++;
            }
            elements.push({ type: 'blockquote', content: content.trim() });
        }

        // Orderd list

        else if(/^\d+\./.test(markdown.substring(i, i + 3)) && i < markdown.length){
            const uorderedList = parseList(markdown, i, 'ol');
            i = uorderedList.index;
            elements.push(uorderedList.element);
        }

        //Horizontal rules , italic/bold and unordered list

        else if (markdown[i] === '-' || markdown[i] === '_' || markdown[i] === '*') {
            
            if (i + 3 === markdown.length || markdown[i + 3] === '\n' || markdown[i + 3] === '\r') {
                elements.push({ type: 'hr' });
                i = i+3;
            }else if(markdown[i] === '*'){
                const italicBold = parseItallicBold(markdown, i);
                i = italicBold.index;
                elements.push({type: "italicBold", content: italicBold.content});
            }else if(markdown[i] === '-'){
                const unorderedList = parseList(markdown, i, 'ul');
                i = unorderedList.index;
                elements.push(unorderedList.element);
            }
        }

        //paragraph

        else{
            const p = parseParagraph(markdown, i);
            if(p.element.content !== '' && p.element.content !== ' ' && p.element.content !== '\r'){
                elements.push(p.element);
            }
            i = p.endIndex;
        }

    }

    return elements;
}

function decodeElement(element){
        switch (element.type) {
            case 'heading':
                return `<h${element.level}>${element.content}</h${element.level}>`;
            case 'image':
                return `<img src="${element.imageUrl}" alt="${element.altText}"/>`;
            case 'paragraph':
                return `<p>${element.content}</p>`;
            case 'hr':
                return `<hr>`;
            case 'italicBold':
                return element.content;
            case 'blockquote':
                return `<blockquote>${element.content}</blockquote>`;
            case 'inlineCode':
                return `<code>${element.content}</code>`;
            case 'link':
                return `<a href="${element.content.url}">${element.content.text}</a>`;
            case 'ul':
                return `<ul>${element.content}</ul>`;
            case 'ol':
                return `<ol>${element.content}</ol>`;
            case 'codeBlock':
                return `<pre><code${element.language !== ''? " class=language-" + element.language : ''}>${element.content}</code></pre>`
        }
}

class maricmd {
    constructor(markdown) {
        this.markdown = markdown;
        this.elements = [];
        this.html = '';
        this.parseMarkdown();
    }

    parseMarkdown() {
        this.elements = getElements(this.markdown.trim(), false);
        this.html = this.elements.map(el => decodeElement(el)).join('\n');
    }
}

module.exports = maricmd;