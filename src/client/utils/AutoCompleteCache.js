/* eslint-disable */

var   root;
const delimiters    = ' &|!?()[]{},.+-*%/=';
const alphaNumerics = 'abcdefghijklmnopqrstuvwxyz'+
                      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'+
                      '0123456789_';

// Node object we use to maintain a persistent and quickly 
// searchable representation of the words Client has used
function AlphaNode(values=new Set([])){
    this.words = values;
    this.links = new Map();
}


/*
This function will handle all possible responses to any given
keystroke, parsing when appropriate and handing off work to 
a subroutine: insertWord(), searchPrefix(), or cleanUp().
*/ 
export function registerKeyStroke(word) {
    // The first time registerKeyStroke() is called on a space,
    // it initializes the root of the tree structure 
    // we use to quickly search for prefixes
    if (root === undefined){
        root = new AlphaNode();
        insertWord(root, word);
        return;
    }
    // If we've previously stored the same word, dont do anything
    else if (root.words.has(word)) return;


    return; 
}

function insertWord(rt, word){
    rt.words.push(word);
    insertHelper(rt, word, 0);
    return
}
function insertHelper(node, word, sIdx){
    return 'potato'
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

        for (let chr of alphaNumerics){

            var wordGroup = node.words.filter(function(s){
                return (s.length > s_idx)&&(s.charAt(s_idx) === chr)
            });
            if (wordGroup.length === 0) continue;

            node.links.set(chr, new AlphaNode(wordGroup));  
            populate(node.links.get(chr), s_idx+1);
        }
    }

    this.searchPrefix = function(prefix){
        var subTreeRoot = this.root;
        for (let chr of prefix){
            var nextLinks = Array.from(subTreeRoot.links.keys())
            if (!nextLinks.includes(chr)) return null;
            subTreeRoot = subTreeRoot.links.get(chr)
        }
        return subTreeRoot.words;
    }

    this.root = new AlphaNode(words);
    this.populateStruct(this.root, 0);
}
*/


