///<reference path='../gps-log/gps-log.ts'/>
///<reference path='../../../../typings/tsd.d.ts'/>
module Gps {
	'use strict';
	import GpsLogEntry = ModelGpsLog.GpsLogEntry;
	import GpsLogRepository = ModelGpsLog.GpsLogRepository;
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
