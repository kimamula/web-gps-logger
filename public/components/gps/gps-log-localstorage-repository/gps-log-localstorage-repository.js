var Gps;!function(o){"use strict";var t=function(){function o(){}return o.prototype.created=function(){this.gpsLog=JSON.parse(localStorage.getItem("gps_log_array"))||[]},o.prototype.gpsLogChanged=function(){localStorage.setItem("gps_log_array",JSON.stringify(this.gpsLog))},o}();o.GpsLogLocalstorageRepository=t,Polymer("gps-log-localstorage-repository",t.prototype)}(Gps||(Gps={}));
//# sourceMappingURL=../../gps/gps-log-localstorage-repository/gps-log-localstorage-repository.js.map