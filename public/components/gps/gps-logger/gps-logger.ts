///<reference path='../gps-log/gps-log.ts'/>
///<reference path='../../../../typings/tsd.d.ts'/>

module GpsLogger {
	'use strict';
	import GpsLogEntry = ModelGpsLog.GpsLogEntry;
	import GpsLogRepository = ModelGpsLog.GpsLogRepository;
	class GpsLogger {
		gpsLog: GpsLogEntry[];
		repository: string;
		private isProcessing = false;
		ready(): void {
			this.gpsLog = (<GpsLogRepository>(<any>document.querySelector(this.repository))).gpsLog;
		}
		logGps(): void {
			if (this.isProcessing) {
				return;
			}
			this.isProcessing = true;
			navigator.geolocation.getCurrentPosition(
				(position: Position) => {
					var gpsLog = {
						'time': new Date().getTime(),
						'latitude': position.coords.latitude,
						'longitude': position.coords.longitude
					};
					this.gpsLog.push(gpsLog);
					this.isProcessing = false;
				},
				(error: PositionError) => {
					alert('Failed to get GPS data');
					this.isProcessing = false;
				}
			);
		}
		removeLastLog(): void {
			if (this.isProcessing) {
				return;
			}
			this.gpsLog.pop();
		}
	}

	Polymer('gps-logger', GpsLogger.prototype);
}
