///<reference path='../model/gps-log.ts'/>
///<reference path='../../../typings/tsd.d.ts'/>
module ModelGpsLogLocalstorageRepository {
	'use strict';
	import GpsLogEntry = ModelGpsLog.GpsLogEntry;
	import GpsLogRepository = ModelGpsLog.GpsLogRepository;
	class GpsLogLoalstorageRepository implements GpsLogRepository {
		gpsLog: GpsLogEntry[];
		created(): void {
			this.gpsLog = JSON.parse(localStorage.getItem('gps_log_array')) || [];
		}
		gpsLogChanged(): void {
			localStorage.setItem('gps_log_array', JSON.stringify(this.gpsLog));
		}
	}

	Polymer('gps-log-localstorage-repository', GpsLogLoalstorageRepository.prototype);
}
