function strToBoolean() {
    var testString = "",
        STR_TRUE = "true",
        STR_FALSE = "false";

    // Negation operator
    var strTrue = !!"string";
    var strFalse = !!"";

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

    // 0, 0.0, NaN give false
    // other numbers (including Infinity) give true
    var opBool = testNumber? true : false;

    var condBool;
    if (testNumber) {
        condBool = true;
    }
    else {
        condBool = false;
    }

    var numFalse = !!0;
    var numTrue = !!7;
}
