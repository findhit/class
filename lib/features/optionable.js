module.exports = function ( Class ) {
    var Util = require( 'findhit-util' ),
        ClassUtil = require( '../util' );

    var origExtend = Class.extend;
    Class.extend = function ( props ) {
        var NewClass = origExtend.apply( this, arguments ),
            proto = NewClass.prototype,
            parentProto = NewClass.parent.prototype;

        if( typeof NewClass !== 'function' ) {
            return NewClass;
        }

        // merge options if they exist
        if ( parentProto.options ) {

            // Create prototyped options on class's prototype
            proto.options = ClassUtil.create( parentProto.options );

            // Now extend from props
            if( props.options ) {
                Util.extend( proto.options, props.options );
            }
        }

        proto.setOptions = function ( options ) {

            // If this object doesn't have options directly
            if ( ! this.hasOwnProperty('options') ) {

                // We should create it from a parent proto, or just a new object
                this.options = this.options ? ClassUtil.create( this.options ) : {};

            }

            // Now extend from props
            Util.extend( this.options, options );

            // Return always options object, someone could reuse any var with this
            // Example: function ( o ) { o = this.setOptions( o ); /* ... */ }
            return this.options;
        };

        return NewClass;
    };

    // merge new default options to the Class
    Class.mergeOptions = function ( options ) {
        return Util.extend( this.prototype.options, options );
    };

};
