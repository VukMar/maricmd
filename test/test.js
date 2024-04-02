const fs = require('fs');
const assert = require('assert');
const maricmd = require('../src/maricmd'); // Adjust the path as needed

// Read the Markdown file
fs.readFile('test/test.md', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading MD file:', err);
        return;
    }

    // Test parsing Markdown
    const result  = new maricmd(data);
    const { html, elements } = result;

    // Test HTML output
    assert.strictEqual(typeof html, 'string', 'HTML output should be a string');
    console.log('HTML output:\n', html);

    // Test parsed elements
    assert.ok(Array.isArray(elements), 'Parsed elements should be an array');
    console.log('Parsed elements:\n', elements);
});
