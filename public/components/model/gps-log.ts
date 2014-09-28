module ModelGpsLog {
	'use strict';
	export interface GpsLogEntry {
		time: number;
		latitude: number;
		longitude: number;
	}

	export interface GpsLogRepository {
		gpsLog: GpsLogEntry[];
	}
}
