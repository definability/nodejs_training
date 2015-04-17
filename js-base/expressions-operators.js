function variablesComparison() {
    // good

    var stringToCheck = "Good";
    var GOOD_STRING = "Good";
    var isGood = stringToCheck === GOOD_STRING

    // bad

    var stringToCheck = "Bad";
    var GOOD_STRING = "Good";
    var isGood = stringToCheck == GOOD_STRING
}

function codeColumns() {
    // good

    var stringToCheck = "Good";
    var GOOD_STRING = "Good";
    var BAD_STRING = "Bad";
    var isStringCorrect = (stringToCheck === GOOD_STRING?
                           1 : stringToCheck === BAD_STRING?
                           1 : -1);

    // bad

    var stringToCheck = "Good";
    var GOOD_STRING = "Bad";
    var BAD_STRING = "Bad";
    var isStringCorrect = ((stringToCheck == GOOD_STRING || stringToCheck == BAD_STRING)? 1 : -1);
}

function increment() {
    // good

    var i = 1;
    i++;
    i *= 3;
    i++;

    // bad

    var i = 1;
    i += i+++++i;
}

function floatComparison() {
    // good

    var f1 = 1.0;
    var f2 = Math.sqrt(1.0);
    var TOLERANCE = Number.EPSILON === undefined? 1E-6 : Number.EPSILON;

    var areEqual = Math.abs(f1 - f2) < TOLERANCE;

    // bad

    var f1 = 1.0;
    var f2 = 1.0 * Math.sqrt(1.0);
    var areEqual = f1 == f2;
}
