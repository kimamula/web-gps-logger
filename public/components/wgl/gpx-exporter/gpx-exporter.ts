///<reference path='../gps-log/gps-log.ts'/>
///<reference path='../../../../typings/tsd.d.ts'/>
module Wgl {
    'use strict';
    export class GpxExporter {
        gpsLog: GpsLogEntry[];
        repository: string;
        gpxText: string;
        ready(): void {
            this.gpsLog = (<GpsLogRepository>(<any>document.querySelector(this.repository))).gpsLog;
        }
        exportByEmail(): void {
            location.href = 'mailto:?subject=GPX&body=' + encodeURIComponent(this.convertToGpx());
        }

        exportAsText(): void {
            if (this.gpxText) {
                this.gpxText = null;
            } else {
                this.gpxText = this.convertToGpx();
            }
        }

        gpsLogChanged(): void {
            this.gpxText = null;
        }

        private convertToGpx(): string {
            return '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>' +
                '<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="http://wgl.herokuapp.com" ' +
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">' +
                '<metadata><link href="http://wgl.herokuapp.com"><text>Web GPS Logger</text></link><time>' +
                this.formatDate(new Date()) + '</time></metadata>' +
                '<trk><name>GPX logged on the Web</name>' +
                this.gpsLog.map((entry: GpsLogEntry) => {
                    return '<trkseg>' +
                        '<trkpt lat="' + entry.latitude + '" lon="' + entry.longitude + '">' +
                        (entry.altitude ? '<ele>' + entry.altitude + '</ele>' : '') +
                        '<time>' + this.formatDate(new Date(entry.time)) + '</time></trkpt></trkseg>';
                }).join('') +
                '</trk></gpx>';
        }

        /**
         * Formats Date object to xsd:datetime, i.e. 'yyyy-MM-ddThh:mm:ss[+|-]hh:mm'
         * @param date
         * @returns {string}
         */
        private formatDate(date: Date): string {
            return date.getFullYear() + '-' +
                this.createDoubleDigitsString(date.getMonth() + 1) + '-' +
                this.createDoubleDigitsString(date.getDate()) + 'T' +
                this.createDoubleDigitsString(date.getHours()) + ':' +
                this.createDoubleDigitsString(date.getMinutes()) + ':' +
                this.createDoubleDigitsString(date.getSeconds()) +
                this.convertTimezoneOffset(date.getTimezoneOffset());
        }

        private createDoubleDigitsString(n: number): string {
            var result = String(n);
            if (n < 10) {
                result = '0' + n;
            }
            return result;
        }

        private convertTimezoneOffset(toff: number): string {
            var result = toff > 0 ? '-' : '+', absToff = Math.abs(toff);
            result += this.createDoubleDigitsString(Math.floor(absToff / 60));
            result += ':' + this.createDoubleDigitsString(absToff % 60);
            return result;
        }
    }

    Polymer('gpx-exporter', GpxExporter.prototype);
}
