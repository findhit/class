module.exports = function ( Class ) {
	var Util = Class.Util = {};

	Util.setOptions = function ( obj, options ) {
		if (!obj.hasOwnProperty('options')) {
			obj.options = obj.options ? Util.create(obj.options) : {};
		}
		for (var i in options) {
			obj.options[i] = options[i];
		}
		return obj.options;
	};

	Util.create = Object.create || (function () {
		function F() {}
		return function (proto) {
			F.prototype = proto;
			return new F();
		};
	})();

	Util.construct = function ( constructor, args ) {
		var NewClass = function () {
			return constructor.apply(this, args);
		}
		NewClass.prototype = constructor.prototype;
		return new NewClass();
	};

};
