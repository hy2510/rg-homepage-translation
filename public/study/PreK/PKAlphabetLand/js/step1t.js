var _choice;

function GetChoice(pLetter) {
    var randomValue;
    _choice = new Array();
    _choice.push(pLetter);

    while (true) {
        randomValue = arrAlphabet[Math.floor(arrAlphabet.length * Math.random())];
        if (randomValue != _choice[0]) {
            _choice.push(randomValue);
            break;
        }
    }

    while (true) {
        randomValue = arrAlphabet[Math.floor(arrAlphabet.length * Math.random())];
        if (randomValue != _choice[0] && randomValue != _choice[1]) {
            _choice.push(randomValue);
            break;
        }
    }
    
    ChoiceShuffle(_choice);
}
