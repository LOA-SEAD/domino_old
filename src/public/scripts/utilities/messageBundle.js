/**
* A simple message bundle module that provides a way to compound internationalized messages. 
*/
define(["i18n!../nls/messages"], function (messages) {

var VARIABLES_PATTERN = /\{\d\}/g, 

getMessage = function(key) {
var input = messages[key], parameters = Array.prototype.slice.call(arguments, 1);
return format(input, parameters);
},

format = function(input, parameters) {
if(! parameters.length || ! VARIABLES_PATTERN.test(input))
return input;

return input.replace(VARIABLES_PATTERN, function(match) {
return parameters[match[1]];
});
};

return {
getMessage: getMessage
};

});
