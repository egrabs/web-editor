/* eslint-disable no-restricted-syntax */

let root;
const delims = ' ~^&|!?()[]{}:;,.+-*%/=<>`';
const alphaNums = 'abcdefghijklmnopqrstuvwxyz'
                      + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                      + '0123456789_';

/*
Node object we leverage to maintain a persistent and quickly
searchable cache containing all words Client has typed so far.
'words' is a set of single-word strings.
'links' is a map w/ single-char keys mapped to AlphaNode objects
*/
function AlphaNode(values = new Set([])) {
    this.words = values;
    this.links = new Map();
}

/*
Simple helper function to retrieve words for cacheing
or prefixes for searching
*/
function getLastWord(line, charNum) {
    let i = charNum - 1;
    while (i >= 0) {
        if (delims.includes(line.charAt(i))) {
            i++;
            break;
        }
        i--;
    }
    if (i < 0) i = 0;
    const lastWord = line.substring(i, charNum);
    return (lastWord !== '') ? lastWord : null;
}

/*
Simple helper function that parses editor text on all
specified delimiters
*/
function parseToWords(text) {
    let parsedText = [text];
    delims.split('').forEach((delim) => {
        parsedText = parsedText.map(s => (s.split(delim)));
        parsedText = [].concat(...parsedText);
    });
    parsedText = parsedText.filter(s => (s !== ''));
    return parsedText;
}

/*
Called on space key press, w/ last word typed by client as argument;
Modifies the persistent cache of used words
*/
function cacheHelper(word) {
    let node = root;
    let sIdx = 0;
    node.words.add(word);
    while (sIdx < word.length) {
        const nextLinks = Array.from(node.links.keys());
        const chr = word.charAt(sIdx);

        if (!nextLinks.includes(chr)) {
            node.links.set(chr, new AlphaNode());
        }

        node = node.links.get(chr);
        node.words.add(word);
        sIdx += 1;
    }
}
function cacheWord(word) {
    if (root === undefined) root = new AlphaNode();
    else if (root.words.has(word)) return;
    cacheHelper(word);
}

/*
- Called on any non-space, non-delimiter key press, with
the prefix currently being typed by client as argument;
- Does not modify the persistent cache;
- Performs a very fast search for the prefix and returns
an array of suggestion objects
*/
function searchPrefix(prefix) {
    if (root === undefined) return [];
    let node = root;

    for (const chr of prefix) {
        const nextLinks = Array.from(node.links.keys());
        if (!nextLinks.includes(chr)) return [];
        node = node.links.get(chr);
    }

    return [...node.words].map(w => ({
        remaining: w.substring(prefix.length),
        typed: prefix,
        all: w,
    }));
}

/*
Handles all possible responses to any given
keystroke, parsing when appropriate and handing off work to
a subroutine: cacheWord(), searchPrefix(), or cleanUp().
*/
export function registerKeyStroke(data, text) {
    const eventKey = data.text[0];
    const txtByLn = text.split('\n');
    const lnNum = data.from.line;
    const txtLn = txtByLn[lnNum];
    const chNum = data.from.ch;
    let word;

    if (data.origin === '+delete') {
        // Handle backspace
        const preCh = (chNum !== 0) ? txtLn.charAt(chNum - 1) : ' ';
        if (alphaNums.includes(preCh)
            && (!alphaNums.includes(txtLn.charAt(chNum))
                || chNum === txtLn.length)) {
            word = getLastWord(txtLn, chNum);
            return searchPrefix(word);
        }
    } else if (data.origin === 'paste') {
        // Handle paste
        let newWords = data.text.join();
        newWords = parseToWords(newWords);
        newWords.forEach(cacheWord);
    } else if (delims.includes(eventKey)) {
        // Handle character insert (delimiter)
        word = getLastWord(txtLn, chNum);
        if (word !== null) cacheWord(word);
    } else if (alphaNums.includes(eventKey)) {
        // Handle character instert (valid alpha-numeric)
        if (chNum + 1 === txtLn.length
            || !alphaNums.includes(txtLn.charAt(chNum + 1))) {
            word = getLastWord(txtLn, chNum + 1);
            return searchPrefix(word);
        }
    }
    return [];
}

/*
Cleans the persistent cache, removing any values which
no longer appear in the file text
*/
function removeWord(word) {
    root.words.delete(word);
    let node = root;
    word.split('').forEach((ch) => {
        node = node.links.get(ch);
        node.words.delete(word);
    });
}
export function cleanCache(text) {
    if (root === undefined) return;
    const currWords = parseToWords(text);
    const toRemove = [...root.words].filter(w => !currWords.includes(w));
    toRemove.forEach(removeWord);
}
