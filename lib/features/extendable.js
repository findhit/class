module.exports = function ( Class ) {
    var Util = require( 'findhit-util' ),
        ClassUtil = require( '../util' );

    Class.extend = function ( props ) {

        // extended class with the new prototype
        var NewClass = function () {
            var r;

            // Recall as new if new isn't provided :)
            if( Util.isnt.instanceof( NewClass, this ) ) {
                return ClassUtil.construct( NewClass, arguments );
            }

            // call the constructor
            if ( Util.is.Function( this.initialize ) ) {
                r = this.initialize.apply(this, arguments);
            }

            // call all constructor hooks
            this.callInitHooks();

            return typeof r != 'undefined' ? r : this;
        };

        // Create a prototype
        var proto = ClassUtil.create( this.prototype );
        proto.constructor = NewClass;
        NewClass.prototype = proto;

        // inherit parent's statics
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'prototype') {
                NewClass[i] = this[i];
            }
        }

        // mix static properties into the class
        if ( props.statics ) {
            Util.extend( NewClass, props.statics );
            delete props.statics;
        }

        // Apply over statics the parent Class
        NewClass.parent = this;

        // mix includes into the prototype
        if ( props.includes ) {
            Util.extend.apply( null, [ proto ].concat( props.includes ) );
            delete props.includes;
        }

        // mix given properties into the prototype
        Util.extend( proto, props );

        return NewClass;
    };


    // method for adding properties to prototype
    Class.mixin = Class.include = function (props) {
        Util.extend(this.prototype, props);
    };

};
