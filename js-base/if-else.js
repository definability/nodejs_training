function numberCheck (number) {
    if (!Number.isInteger(number)) {
        console.log(number + " is not an integer");
    } else if (number % 5) {
        console.log('Next number');
    } else {
        console.log('Correct number');
    }
}

function RESTServer (requestType) {
    if (requestType.toLowerCase() == 'post') {
        console.log('New item created');
    } else if (requestType.toLowerCase() == 'put') {
        console.log('Item updated');
    } else {
        console.log('Check operation value!');
    }
}
