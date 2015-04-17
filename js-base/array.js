function badTree() {
    var goodTree = [1, 2, [3, 4, [5, 6]]];
    var badTree  = [goodTree];
    badTree.push(badTree); // Good luck visiting all children!
}


