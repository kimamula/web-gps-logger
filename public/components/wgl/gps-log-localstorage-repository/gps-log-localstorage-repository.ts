///<reference path='../gps-log/gps-log.ts'/>
///<reference path='../../../../typings/tsd.d.ts'/>
module Wgl {
	'use strict';
	export class GpsLogLocalstorageRepository implements GpsLogRepository {
		gpsLog: GpsLogEntry[];
		created(): void {
			this.gpsLog = JSON.parse(localStorage.getItem('gps_log_array')) || [];
		}
		gpsLogChanged(): void {
			localStorage.setItem('gps_log_array', JSON.stringify(this.gpsLog));
		}
	}

	Polymer('gps-log-localstorage-repository', GpsLogLocalstorageRepository.prototype);
}
