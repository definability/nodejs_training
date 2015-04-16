function variablesComparison () {
    // good

    var stringToCheck = "Good";
    var GOOD_STRING = "Good";
    var isGood = stringToCheck === GOOD_STRING

    // bad

    var stringToCheck = "Bad";
    var GOOD_STRING = "Good";
    var isGood = stringToCheck == GOOD_STRING
}

function codeColumns () {
    // good

    var stringToCheck = "Good";
    var GOOD_STRING = "Good";
    var BAD_STRING = "Bad";
    var isStringCorrect = (stringToCheck == GOOD_STRING ?
                           1 : stringToCheck == BAD_STRING ?
                           1 : -1);

    // bad

    var stringToCheck = "Good";
    var GOOD_STRING = "Bad";
    var BAD_STRING = "Bad";
    var isStringCorrect = ((stringToCheck == GOOD_STRING || stringToCheck == BAD_STRING) ? 1 : -1);
}
