/* eslint-disable */

let root;
const delimiters = ' &|!?()[]{},.+-*%/=';
const alphaNumerics = 'abcdefghijklmnopqrstuvwxyz'
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
    cacheHelper(root, word, 0);
}

/*
Handles all possible responses to any given
keystroke, parsing when appropriate and handing off work to
a subroutine: cacheWord(), searchPrefix(), or cleanUp().
*/
export function registerKeyStroke(word) {
    cacheWord(word);
}

/*
- Called on any non-space, non-delimiter key press, with
the prefix currently being typed by client as argument;
- Does not modify the persistent cache;
- Performs a very fast search for the prefix and returns
an array of completion suggestions
*/
function searchPrefix(prefix) {
    let node = root;
    for (const chr of prefix) {
        const nextLinks = Array.from(node.links.keys());
        if (!nextLinks.includes(chr)) return null;
        node = node.links.get(chr);
    }
    return node.words;
}

/*
Repeatedly tokenizes the input string on any of the specified 
delimeters, flattening the results into a 1-d array of words
*/
function parseFileText(text) {
    let parsedText = [text];

    for (const delim of delimiters) {
        parsedText = parsedText.map(function (s) {
            return s.split(delim);
        });
        parsedText = [].concat.apply([], parsedText);
    }

    parsedText = parsedText.filter(function (s) {
        return (s !== '' && s !== "");
    });
    return parsedText;
}
