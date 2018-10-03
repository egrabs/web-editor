/* eslint-disable */

export function registerKeyStroke(text) {
    var prefixeCache = new PrefixStruct(text);
    return
}

function AlphaNode(values=[]){
    this.words = values;
    this.links = new Map();
}

function PrefixStruct(words){
    const alphaNumerics = 'abcdefghijklmnopqrstuvwxyz';
    this.root = new AlphaNode(words);

    this.populateStruct = function populate(node, s_idx){
        for (let chr of alphaNumerics){
            var wordGroup = node.words.filter(function(s){
                return ((s.length > s_idx) && (s.charAt(s_idx) === chr))
            });
            if (wordGroup === []) continue;

            node.links.set(chr, new AlphaNode(wordGroup));  
            populate(node.links.get(chr), s_idx+1);
        }
    }
    this.populateStruct(this.root, 0);

    this.searchPrefix = function(prefix){
        var subTreeRoot = this.root;
        for (let chr of prefix){
            if (!(subTreeRoot.links.keys().includes(chr))){
                return null;
            }
            subTreeRoot = subTreeRoot.links.get(chr)
        }
        return subTreeRoot.words;
    }
}







// function MyObjConstructor(param1, param2) {
//     this.param1 = param1;
//     this.param2 = param2;
// }

// let stupidObj = new MyObjConstructor('hurr', 'durr');

// let stupidObj = {
//     param1: 'hurr',
//     param2: 'durr',
//     param3: 'duhh',
//     someMethod: function() {
//         return this.param3;
//     }
// }

// let stupidObj2 = {
//     param1: 'asdff',
//     param2: 'booty',
// }

// stupidObj.someMethod.apply(stupidObj2, []);