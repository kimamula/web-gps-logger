var Wgl;!function(){"use strict";var t=function(){function t(){this.isProcessing=!1}return t.prototype.ready=function(){this.gpsLog=document.querySelector(this.repository).gpsLog},t.prototype.logGps=function(){var t=this;this.isProcessing||(this.isProcessing=!0,navigator.geolocation.getCurrentPosition(function(o){var e={time:(new Date).getTime(),latitude:o.coords.latitude,longitude:o.coords.longitude};t.gpsLog.push(e),t.isProcessing=!1},function(){alert("Failed to get GPS data"),t.isProcessing=!1}))},t.prototype.removeLastLog=function(){this.isProcessing||this.gpsLog.pop()},t.prototype.clearAllLog=function(){this.gpsLog.length=0},t.prototype.convertToDate=function(t){return new Date(t)},t}();Polymer("gps-logger",t.prototype)}(Wgl||(Wgl={}));
//# sourceMappingURL=../gps-logger/gps-logger.js.map