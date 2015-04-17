function intToStr() {
    // good
    var strNumber = new String(1) + new String(2);
    var result = "Result is " + strNumber;
    // or
    var result = "Result is ".concat(1, 2);
    // bad
    var result = "Result is " + 1 + 2;
}

function strMethods() {
    var test = "test";
    test = test.toUpperCase(); // "TEST"
    test = test.toLowerCase(); // "test"
    test = "  " + test; // "  test"
    test += "  "; // "  test  "
    test = test.trimRight(); // "test"
    test = "  " + test + "  "; // "  test  "
    test = test.trim(); // "test"
    test = test.concat(" me"); // "test me"
    test.split(); // ["test", "me"]
    test.endsWith("me"); // true
    test.startsWith(" "); // false
}
