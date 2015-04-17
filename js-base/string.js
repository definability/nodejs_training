function intToStr() {
    // good
    var strNumber = new String(1) + new String(2);
    var result = "Result is " + strNumber;
    // bad
    var result = "Result is " + 1 + 2;
}
