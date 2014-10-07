module.exports = function ( Class ) {
    var ClassUtil = require( './util' );

    Class.construct = function () {
        return ClassUtil.construct( this, arguments );
    };

};
