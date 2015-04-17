function strToBoolean() {
    var testString = "";
    var STR_TRUE = "true";
    var STR_FALSE = "false";

    // Ternary operator
    var strBool = testString === STR_TRUE;

    var advStrBool = (testString === STR_TRUE?  true  :
                      testString === STR_FALSE? false : undefined);

    // or simplier...
    var simpleBool = testString? true : false;

    // if-else
    var condBool = false;
    if (testString === STR_TRUE) {
        condBool = true;
    }

    var advCondBool = undefined;
    if (testString === STR_TRUE) {
        advCondBool = true;
    }
    else if (testString === STR_FALSE) {
        advCondBool = false;
    }

    // Switch-case
    var swBool;
    switch (testString) {
        case STR_TRUE:
            swBool = true;
            break;
        case STR_FALSE:
            swBool = false;
            break;
        default:
            swBool = undefined;
    }
}

function intToBoolean() {
    var testNumber = 0;

    var opBool = testNumber? true : false;

    var condBool;
    if (testNumber) {
        condBool = true;
    }
    else {
        condBool = false;
    }
}
