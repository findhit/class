module.exports = function ( Class ) {

    Class.construct = function () {
        return Class.Util.construct( this, arguments );
    };

};
