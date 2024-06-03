var _completed = ['1', '0', '1', '1', '1', '1', '1', '1', '1', '0',
                '1', '0', '1', '1', '1', '1', '0', '0', '1', '1',
                '1', '0', '1', '1', '1', '1', '1', '1', '1', '0',
                '1', '0', '1', '0', '1', '1', '1', '1', '1', '1',
                '1', '0', '1', '0', '0', '1', '1', '1', '1', '1',
                '1', '0', '1', '1', '0', '1', '1', '1', '1', '1',
                '1', '0', '1', '1', '1', '1', '1', '1', '1', '1',
                '1', '0', '1', '1', '1', '0', '1', '1', '1', '1',
                '1', '0', '1', '1', '1', '0', '1', '1', '1', '1',
                '1', '0', '1', '0', '1', '1', '1', '1', '1', '0'
];

var _phonics = [
    ['A', 'an', 'f┒', 'c┒', 'p┒', 'v┒'],
    ['B', 'am', 'h┒', 'j┒', 'd┒'],
    ['A', 'ag', 'b┒', 't┒', 'dr┒', 'fl┒'],
    ['B', 'ad', 'b┒', 'd┒', 'm┒', 's┒'],
    ['A', 'at', 'b┒', 'c┒', 'h┒', 'm┒'],
    ['B', 'ap', 'c┒', 'm┒', 't┒', 'tr┒'],
    ['A', 'ed', 'b┒', 'r┒', 'w┒', 'sl┒'],
    ['B', 'et', 'j┒', 'n┒', 'v┒', 'w┒'],
    ['A', 'eg', 'l┒', '┒g', 'b┒'],
    ['B', 'en', 'h┒', 'm┒', 'p┒', 't┒'],

    ['B', 'ell', 'b┒', 's┒', 't┒', 'w┒'],
    ['A', 'ib', 'b┒', 'n┒', 'r┒'],
    ['B', 'ig', 'b┒', 'd┒', 'p┒', 'w┒'],
    ['A', 'id', 'k┒', 'l┒', 'm┒', 'r┒'],
    ['B', 'in', 'f┒', 'b┒', 'p┒', 'w┒'],
    ['A', 'ip', 'h┒', 'l┒', 'r┒', 's┒'],
    ['B', 'it', 'f┒', 'h┒', 's┒', 'k┒'],
    ['A', 'ix', 'm┒', 's┒', 'f┒'],
    ['B', 'ot', 'd┒', 'h┒', 'p┒'],
    ['A', 'op', 'c┒', 'h┒', 'm┒', 't┒'],

    ['A', 'ob', 'j┒', 'r┒', 's┒'],
    ['A', 'og', 'd┒', 'j┒', 'l┒', 'fr┒'],
    ['B', 'ox', 'f┒', 'b┒', '┒'],
    ['A', 'od', 'n┒', 'p┒', 'r┒', 'c┒'],
    ['A', 'ub', 'c┒', 'r┒', 't┒'],
    ['A', 'ud', 'b┒', 'm┒', 'st┒'],
    ['A', 'ug', 'b┒', 'h┒', 'j┒', 'r┒'],
    ['A', 'un', 'b┒', 'g┒', 'r┒', 's┒'],
    ['B', 'up', '┒', 'c┒', 'p┒'],
    ['A', 'ut', 'c┒', 'h┒', 'n┒', 'sh┒'],

    ['B', 'y', 'sk┒', 'cr┒', 'fl┒', 'dr┒'],
    ['B', 'ace', 'f┒', 'l┒', 'pl┒', 'r┒'],
    ['B', 'age', 'c┒', 'w┒', 'p┒'],
    ['B', 'ake', 'b┒', 'c┒', 'l┒', 'r┒'],
    ['B', 'ale', 's┒', 'p┒', 't┒', 'wh┒'],
    ['B', 'ame', 'g┒', 'n┒', 's┒', 'fr┒'],
    ['B', 'ane', 'c┒', 'm┒', 'l┒', 'v┒'],
    ['B', 'ape', 'c┒', 't┒', 'gr┒'],
    ['B', 'are', 'b┒', 'c┒', 'f┒', 'h┒'],
    ['B', 'ase', 'b┒', 'c┒', 'v┒', 'ch┒'],

    ['B', 'ate', 'g┒', 'h┒', 'l┒', 'pl┒'],
    ['A', 'ea', 'p┒', 'm┒t', '┒t', 'fl┒'],
    ['A', 'ee', 'b┒', 'fl┒', 'f┒d', 'tr┒'],
    ['B', 'ice', 'd┒', 'm┒', 'n┒', 'r┒'],
    ['B', 'ide', 'h┒', 'r┒', 'sl┒', 'br┒'],
    ['B', 'ike', 'b┒', 'h┒', 'l┒', 'm┒'],
    ['B', 'ife', 'f┒', 'w┒', 'kn┒'],
    ['B', 'ile', 'f┒', 'p┒', 'sm┒', 't┒'],
    ['B', 'ime', 'l┒', 'm┒', 't┒'],
    ['B', 'ine', 'l┒', 'n┒', 'p┒', 'v┒'],

    ['B', 'ipe', 'p┒', 'r┒', 'w┒', 'str┒'],
    ['B', 'ole', 'h┒', 'm┒', 'p┒'],
    ['B', 'ome', 'd┒', 'h┒', 'R┒'],
    ['B', 'one', 'b┒', 'c┒', 'z┒'],
    ['B', 'ope', 'h┒', 'r┒', 'sl┒'],
    ['B', 'ose', 'h┒', 'n┒', 'r┒', 'p┒'],
    ['B', 'ue', 'cl┒', 'bl┒', 'gl┒'],
    ['A', 'ui', 'j┒ce', 'fr┒t', 's┒t'],
    ['B', 'ay', 'h┒', 'p┒', 'cl┒', 'pl┒'],
    ['A', 'ai', 'n┒l', 't┒l', 'r┒n', 'gr┒n'],

    ['B', 'ow', 'c┒', '┒l', 'cr┒n', 'cl┒n'],
    ['B', 'ou', 'cl┒d', 'h┒se', 'm┒se', 'r┒nd'],
    ['B', 'oo', 'b┒k', 'c┒k', 'g┒se', 'm┒n'],
    ['B', 'oa', 'b┒t', 'c┒t', 'g┒t', 's┒p'],
    ['A', 'oy', 'b┒', 'j┒', 's┒', 't┒'],
    ['B', 'oi', 'b┒l', '┒l', 's┒l'],
    ['A', 'aw', 'j┒', 'p┒', 'cr┒l', 'dr┒'],
    ['A', 'ew', 'd┒', 'n┒s', 'j┒el', 'ch┒'],
    ['B', 'or', 'c┒n', 'f┒k', 'h┒n', 'st┒m'],
    ['B', 'ur', 'f┒', 'b┒n', 'n┒se', 'p┒se'],

    ['B', 'ar', 'c┒d', 'b┒n', 'f┒m', 'sh┒k'],
    ['B', 'er', 'bak┒', 'farm┒', 'riv┒', 'sing┒'],
    ['B', 'ir', 'b┒d', 'c┒cle', 'g┒l', 'sh┒t'],
    ['A', 'bl', '┒ack', '┒ow', '┒ue', '┒anket'],
    ['A', 'cl', '┒ap', '┒ass', '┒ick', '┒oud'],
    ['A', 'fl', '┒ag', '┒ute', '┒ower', '┒y'],
    ['A', 'gl', '┒ass', '┒ider', '┒ow', '┒ue'],
    ['A', 'pl', '┒ane', '┒ant', '┒ate', '┒um'],
    ['A', 'sl', '┒ed', '┒ip', '┒eep', '┒ide'],
    ['A', 'br', '┒ead', '┒ick', '┒idge', '┒ush'],

    ['A', 'cr', '┒ab', '┒adle', '┒ash', '┒own'],
    ['B', 'dr', '┒ag', '┒eam', '┒ink', '┒um'],
    ['A', 'fr', '┒ame', '┒og', '┒iend', '┒ozen'],
    ['B', 'gr', '┒ab', '┒ass', '┒ape', '┒ow'],
    ['A', 'pr', '┒ay', '┒ince', '┒int'],
    ['B', 'tr', '┒ee', '┒ain', '┒ip', '┒oll'],
    ['A', 'sk', '┒i', '┒ip', '┒ull', '┒y'],
    ['B', 'sm', '┒all', '┒ash', '┒ell', '┒oke'],
    ['A', 'sn', '┒ake', '┒ail', '┒iff', '┒ow'],
    ['B', 'sp', '┒in', '┒ider', '┒ill', '┒oon'],

    ['B', 'st', '┒ar', '┒op', '┒ick', '┒udy'],
    ['B', 'sw', '┒eet', '┒eat', '┒im', '┒ing'],
    ['A', 'sh', '┒ell', '┒ip', '┒eep', '┒op'],
    ['B', 'ch', '┒ess', '┒eese', '┒ick', '┒op'],
    ['B', 'th', 'ba┒', 'ma┒', 'mo┒', 'too┒'],
    ['B', 'ph', '┒one', '┒oto', 'gra┒'],
    ['B', 'wh', '┒ale', '┒eel', '┒eat', '┒ite'],
    ['A', 'ck', 'blo┒', 'pi┒', 'si┒', 'so┒'],
    ['B', 'ng', 'ki┒', 'lo┒', 'ri┒', 'so┒'],
    ['A', 'kn', '┒ee', '┒ife', '┒it', '┒ock']
];

var arrAlphabet1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var _choice;

function GetChoice1(pLetter) {
    var randomValue;
    _choice = new Array();
    _choice.push(pLetter);

    while (true) {
        randomValue = arrAlphabet1[Math.floor(arrAlphabet1.length * Math.random())];
        if (randomValue != _choice[0]) {
            _choice.push(randomValue);
            break;
        }
    }

    while (true) {
        randomValue = arrAlphabet1[Math.floor(arrAlphabet1.length * Math.random())];
        if (randomValue != _choice[0] && randomValue != _choice[1]) {
            _choice.push(randomValue);
            break;
        }
    }

    ChoiceShuffle(_choice);
    return _choice;
}

var arrAlphabet2 = ['an', 'am', 'ag', 'ad', 'at', 'ap', 'ed', 'et', 'eg',
                    'en', 'ib', 'ig', 'id', 'in', 'ip', 'it', 'ix', 'ot',
                    'op', 'ob', 'og', 'ox', 'od', 'ub', 'ud', 'ug', 'un', 
                    'up', 'ut', 'ea', 'ee', 'ue', 'ui', 'ay', 'ai', 'ow',
                    'ou', 'oo', 'oa', 'oy', 'oi', 'aw', 'ew', 'or', 'ur',
                    'ar', 'er', 'ir', 'bl', 'cl', 'fl', 'gl', 'pl', 'sl',
                    'br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'sk', 'sm',
                    'sn', 'sp', 'sw', 'sh', 'ch', 'th', 'ph', 'wh', 'ck',
                    'ng',
];

function GetChoice2(pLetter) {
    var randomValue;
    _choice = new Array();
    _choice.push(pLetter);

    while (true) {
        randomValue = arrAlphabet2[Math.floor(arrAlphabet2.length * Math.random())];
        if (randomValue != _choice[0]) {
            _choice.push(randomValue);
            break;
        }
    }

    while (true) {
        randomValue = arrAlphabet2[Math.floor(arrAlphabet2.length * Math.random())];
        if (randomValue != _choice[0] && randomValue != _choice[1]) {
            _choice.push(randomValue);
            break;
        }
    }

    ChoiceShuffle(_choice);
    return _choice;
}


var arrAlphabet3 = ['ell', 'ace', 'age', 'ake', 'ale', 'ame', 'ane', 'ape',
                    'are', 'ase', 'ate', 'ice', 'ide', 'ike', 'ife', 'ile',
                    'lme', 'ine', 'ipe', 'ole', 'ome', 'one', 'ope', 'ose'
];             

function GetChoice3(pLetter) {
    var randomValue;
    _choice = new Array();
    _choice.push(pLetter);

    while (true) {
        randomValue = arrAlphabet3[Math.floor(arrAlphabet3.length * Math.random())];
        if (randomValue != _choice[0]) {
            _choice.push(randomValue);
            break;
        }
    }

    while (true) {
        randomValue = arrAlphabet3[Math.floor(arrAlphabet3.length * Math.random())];
        if (randomValue != _choice[0] && randomValue != _choice[1]) {
            _choice.push(randomValue);
            break;
        }
    }

    ChoiceShuffle(_choice);
    return _choice;
}

