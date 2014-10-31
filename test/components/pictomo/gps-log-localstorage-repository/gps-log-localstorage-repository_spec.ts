///<reference path='../spec_helper.ts'/>
module GpsLogLocalstorageRepositorySpec {
	'use strict';

	import GpsLogLoalstorageRepository = Gps.GpsLogLocalstorageRepository;

	describe('GpsLogLoalstorageRepository', () => {
		describe('created', () => {
			it('should initialize gpsLog as empty array if it is not stored in localstorage', () => {
				var repository = new GpsLogLoalstorageRepository();
				repository.created();
				assert(repository.gpsLog.length === 0);
			});
		});
	});
}

