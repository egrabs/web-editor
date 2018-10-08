/* eslint-disable */

var   root;
const delimiters    = ' &|!?()[]{},.+-*%/=';
const alphaNumerics = 'abcdefghijklmnopqrstuvwxyz'+
                      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'+
                      '0123456789_';

/*
Node object we leverage to maintain a persistent and quickly
searchable cache containing all words Client has typed so far. 
'words' is a set of single-word strings.
'links' is a map w/ single-char keys mapped to AlphaNode objects
*/
function AlphaNode(values=new Set([])){
    this.words = values;
    this.links = new Map();
}


/*
This function handles all possible responses to any given
keystroke, parsing when appropriate and handing off work to 
a subroutine: cacheWord(), searchPrefix(), or cleanUp().
*/ 
export function registerKeyStroke(word) {
    cacheWord(word);
    return; 
}

// To be called on space key press
function cacheWord(word){
    // The first time cacheWord() is called, it initializes the 
    // root of the tree structure we use to quickly search a prefix
    if (root === undefined) root = new AlphaNode();
    else if (root.words.has(word)) return;
    cacheHelper(root, word, 0);
    return
}
function cacheHelper(node, word, sIdx){
    while (sIdx < word.length){
        var nextLinks = Array.from(node.links.keys());
        var chr = word.charAt(sIdx)

        node.words.add(word);

        if (!nextLinks.includes(chr)){
            node.links.set(chr, new AlphaNode());
        }
        node = node.links.get(chr)
    }
    return 
}

function parseFileText(text){
    var parsedText = [text];

    for (let delim of delimiters){
        parsedText = parsedText.map(function(s){
            return s.split(delim)
        })
        parsedText = [].concat.apply([], parsedText);
    }

    parsedText = parsedText.filter(function(s){
        return (s != '' && s != "");
    })
    return parsedText;
}

/*
function PrefixStruct(words){
    this.populateStruct = function populate(node, s_idx){
    this.root = new AlphaNode(words);
    populateStruct(this.root, 0);
}
const alphaNumerics = 'abcdefghijklmnopqrstuvwxyz'+
                      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'+
                      '0123456789_';

function searchPrefix(prefix){
    var subTreeRoot = this.root;
    for (let chr of prefix){
        var nextLinks = Array.from(subTreeRoot.links.keys())
        if (!nextLinks.includes(chr)) return null;
        subTreeRoot = subTreeRoot.links.get(chr)
    }
    return subTreeRoot.words;
}

function populateStruct(node, s_idx){
    const alphaNumerics = 'abcdefghijklmnopqrstuvwxyz';

    for (let chr of alphaNumerics){

        var wordGroup = node.words.filter(function(s){
            return (s.length > s_idx)&&(s.charAt(s_idx) === chr)
        });
        if (wordGroup.length === 0) continue;

        node.links.set(chr, new AlphaNode(wordGroup));  
        populateStruct(node.links.get(chr), s_idx+1);
    }
}
*/


