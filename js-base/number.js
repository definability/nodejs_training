function numberMinMax() {
    var integerMin = Number.MIN_SAFE_INTEGER,
        integerMax = Number.MAX_SAFE_INTEGER,
        floatMin = Number.MIN_VALUE,
        floatMax = Number.MAX_VALUE;
}

function numberToString() {
    var value = 2.2E-2;
    value.toPrecision(); // "0.022"
    value.toExponential(); // "2.2E-2"

    1E-7.toString(); // "1E-6"
    1E-6.toString(); // "0.000001"

    1.5.toFixed(); // "2"
    1.4.toFixed(); // "1"
}
