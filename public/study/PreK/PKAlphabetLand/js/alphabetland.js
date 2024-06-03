var arrAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u' ,'v', 'w', 'x', 'y', 'z' ];


function GetAlphabet(pNum) {
    return arrAlphabet[pNum - 1].toUpperCase();
}

function GetOrder(pLetter) {
    var n = pLetter.charCodeAt(0) - 65;
    return n + 1;
}

function GetRound(pLetter) {
    var round;
    var order = GetOrder(pLetter).toString();
    if (order.length == 1) {
        round = '00' + order;
    } else if (order.length == 2) {
        round = '0' + order;
    } else if (order.length == 3) {
        round = order;
    }

    return round;
}

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

function ChoiceShuffle(pArr) {
    var currentIndex = pArr.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = pArr[currentIndex];
        pArr[currentIndex] = pArr[randomIndex];
        pArr[randomIndex] = temporaryValue;
    }

    return pArr;
}
