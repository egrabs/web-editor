/* eslint-disable */

export function registerKeyStroke(text) {
    var parsedText = [text];
    const delimiters = ' &|!?()[]{},.+-=*/%';

    for (let delim of delimiters){
        parsedText = parsedText.map(function(s){
            return s.split(delim)
        })
        parsedText = [].concat.apply([], parsedText);
    }
    parsedText = parsedText.filter(function(s){
        return (s != '' && s != "");
    })
    //console.log(parsedText); //demo

    var prefixeCache = new PrefixStruct(parsedText);
    var deleteMe = prefixeCache.searchPrefix('he'); //demo
    if (deleteMe != null) console.log(deleteMe); //demo
    return
}

function AlphaNode(values=[]){
    this.words = values;
    this.links = new Map();
}

function PrefixStruct(words){
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


