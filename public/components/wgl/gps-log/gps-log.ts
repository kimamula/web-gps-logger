module Wgl {
	'use strict';
	export interface GpsLogEntry {
		time: number;
		latitude: number;
		longitude: number;
		altitude: number;
	}

	export interface GpsLogRepository {
		gpsLog: GpsLogEntry[];
	}
}
