module.exports = function ( Class ) {
    var Util = require( 'findhit-util' );

    var origExtend = Class.extend;
    Class.extend = function ( props ) {
        var NewClass = origExtend.apply( this, arguments ),
            proto = NewClass.prototype,
            parentProto = NewClass.parent.prototype;

        if( typeof NewClass !== 'function' ) {
            return NewClass;
        }

        populateProto( proto, parentProto );

        return NewClass;
    };

    // add a constructor hook
    Class.addInitHook = function (fn) { // (Function) || (String, args...)
        var args = Array.prototype.slice.call(arguments, 1);

        var init = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };

        this.prototype._initHooks = this.prototype._initHooks || [];
        this.prototype._initHooks.push(init);
    };

    // add a destruction hook
    Class.addDestroyHook = function ( fn ) { // (Function) || (String, args...)
        var args = Array.prototype.slice.call( arguments, 1 );

        var destroy = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };

        this.prototype._destroyHooks = this.prototype._destroyHooks || [];
        this.prototype._destroyHooks.push(destroy);
    };

    // Private functions
    var populateProto = function ( proto, parentProto ) {

        proto._initHooks = [];
        proto._destroyHooks = [];

        // add method for calling all init hooks
        proto.callInitHooks = function () {

            if ( this._initHooksCalled ) { return; }

            if ( parentProto ) {
                parentProto.callInitHooks.call(this);
            }

            this._initHooksCalled = true;

            for (var i = 0, len = proto._initHooks.length; i < len; i++) {
                proto._initHooks[i].call(this);
            }
        };

        // add method for calling all destroy hooks
        proto.callDestroyHooks = function () {

            if ( this._destroyHooksCalled ) { return; }

            if ( parentProto.callDestroyHooks ) {
                parentProto.callDestroyHooks.call(this);
            }

            this._destroyHooksCalled = true;

            for (var i = 0, len = proto._destroyHooks.length; i < len; i++) {
                proto._destroyHooks[i].call(this);
            }
        };

    };

    // Because class isnt extended, run populateProto on it
    populateProto( Class.prototype, null );

};
