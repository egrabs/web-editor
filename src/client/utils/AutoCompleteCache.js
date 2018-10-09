/* eslint-disable */

let root;
const delimiters = Array.from(' &|!?()[]{},.+-*%/=');
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
Handles all possible responses to any given
keystroke, parsing when appropriate and handing off work to
a subroutine: cacheWord(), searchPrefix(), or cleanUp().
*/
export function registerKeyStroke(data, text) {
    const eventKey = data.text[0];
    const textByLine = text.split('\n');
    const lineNum = data.from.line;
    const charNum = data.from.ch;
    const backspace = data.origin === '+delete';
    let word;

    if (delimiters.includes(eventKey)){
        word = getLastWord(textByLine[lineNum], charNum);
        cacheWord(word);
        return 'null'
    }
    else if (alphaNumerics.includes(eventKey) || backspace) {
        word = getLastWord(textByLine[lineNum], charNum+1);
        return searchPrefix(word);
    }
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
an array of completion suggestions
*/
function searchPrefix(prefix) {
    if (root === undefined) return null;
    if (prefix === '') return 'null';
    let node = root;

    for (const chr of prefix) {
        const nextLinks = Array.from(node.links.keys());
        if (!nextLinks.includes(chr)) return null;
        node = node.links.get(chr);
    }
    return Array.from(node.words);
}


function getLastWord(line, charN) {
    let i = charN-1;
    while (i > 0) {
        if (delimiters.includes(line.charAt(i))){
            i++;
            break;
        }
        i--;
    }
    const lastWord = line.substring(i, charN);
    return (lastWord !== '') ? lastWord : 'none';
}


/*
Repeatedly tokenizes the input string on any of the specified 
delimeters, flattening the results into a 1-d array of words

for (const delim of delimiters) {
    parsedText = parsedText.map(function (s) {
        return s.split(delim);
    });
    parsedText = [].concat.apply([], parsedText);
}

parsedText = parsedText.filter(function (s) {
    return (s !== '' && s !== "");
});
*/
