module.exports = {

	setOptions: function ( obj, options ) {
		if (!obj.hasOwnProperty('options')) {
			obj.options = obj.options ? Util.create(obj.options) : {};
		}
		for (var i in options) {
			obj.options[i] = options[i];
		}
		return obj.options;
	},

	create: Object.create || (function () {
		function F() {}
		return function (proto) {
			F.prototype = proto;
			return new F();
		};
	})(),

	construct: function ( constructor, args ) {
		var NewClass = function () {
			return constructor.apply(this, args);
		};

		NewClass.prototype = constructor.prototype;
		return new NewClass();
	},

};
