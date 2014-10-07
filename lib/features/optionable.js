module.exports = function ( Class ) {
    var Util = require( 'findhit-util' );

    var origExtend = Class.extend;
    Class.extend = function ( props ) {
        var NewClass = origExtend.apply( this, arguments ),
            proto = NewClass.prototype,
            parentProto = NewClass.__super__;

        if( typeof NewClass !== 'function' ) {
            return NewClass;
        }

        // merge options
        if ( Util.is.Object( props.options ) ) {
            proto.options = Util.extend( Class.Util.create( proto.options ), props.options );
        }

        proto.setOptions = function ( options ) {
            return Class.Util.setOptions( this, options );
        };

        return NewClass;
    };

    // merge new default options to the Class
    Class.mergeOptions = function ( options ) {
        Util.extend(this.prototype.options, options);
    };

};
