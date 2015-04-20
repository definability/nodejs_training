function cyclicGraph() {
    var acyclicGraph = [1, 2, [3, 4, [5, 6]]];

    // bad (cyclicGraph is undefined yet)
    var cyclicGraph = [acyclicGraph, cyclicGraph];

    // good
    var cyclicGraph = [acyclicGraph];
    cyclicGraph.push(cyclicGraph);
}

function strings() {
    var text = ['Hello', 'pretty', 'world'];
    var hpw = text.join(' ').concat('!'); // 'Hello my pretty world!'
}

function collections() {
    /**
     * Abstract collection with pop and push functions.
     * Can be initialized from array.
     */
    var AbstractCollection = (function() {
        var constructor = function (initialValue) {
            this.value = [];
            if (Array.isArray(initialValue)) {
                this.value = initialValue.slice(0);
            }
        };
        var proto = constructor.prototype;

        proto.push = function (value) {
            console.log('Value wasn\'t pushed');
        };

        proto.pop = function () {
            console.log('Value wasn\'t popped');
        };

        return constructor;
    })();

    /**
     * Code was mainly taken from http://coffeescript.org/
     */
    var extendClass = function (Parent, Child) {
        // Append all functions to the Child.
        // It's not easier to use Child.prototype = new Parent(),
        // because Parent can have static variables for example,
        // with counter of instances.
        if (Child === undefined) {
            Child = function() {
                Parent.prototype.constructor.apply(this, arguments);
            };
        }
        for (var key in Parent) {
            if (Parent.hasOwnProperty(key)) Child[key] = Parent[key];
        }

        function ctor() {
            this.constructor = Child;
        }
        ctor.prototype = Parent.prototype;
        Child.prototype = new ctor();
        Child.__super__ = Parent.prototype;
        return Child;
    };

    var Stack = (function() {
        var constructor = extendClass(AbstractCollection);
        var proto = constructor.prototype;

        proto.push = function (value) {
            this.value.push(value);
        }

        proto.pop = function() {
            return this.value.pop();
        }
        return constructor;
    })();

    var Queue= (function() {
        var constructor = extendClass(AbstractCollection);
        var proto = constructor.prototype;

        proto.push = function (value) {
            this.value.push(value);
        }

        proto.pop = function() {
            return this.value.shift();
        }
        return constructor;
    })();
}
