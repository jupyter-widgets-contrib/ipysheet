
var clone_deep = function(obj) {
    return JSON.parse(JSON.stringify(obj))
}

/*
    Object to avoid infinte loops when two objects van update eachother
*/
Lock = function() {
    var locked = false;
    this.with = function(f, context) {
        locked = true
        try {
            f.apply(context, arguments)
        } finally {
            locked = false
        }
    }
    this.without = function(f, context) {
        if(!locked) {
            f.apply(context, arguments)
        }
    }
}
