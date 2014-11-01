var WglSpec;
(function (WglSpec) {
    'use strict';
    var GpsLogLoalstorageRepository = Wgl.GpsLogLocalstorageRepository;
    describe('GpsLogLoalstorageRepository', function () {
        describe('created', function () {
            it('should initialize gpsLog as empty array if it is not stored in localstorage', function () {
                var repository = new GpsLogLoalstorageRepository();
                repository.created();
                assert(assert._expr(assert._capt(assert._capt(assert._capt(assert._capt(repository, 'arguments/0/left/object/object').gpsLog, 'arguments/0/left/object').length, 'arguments/0/left') === 0, 'arguments/0'), {
                    content: 'assert(repository.gpsLog.length === 0)',
                    filepath: '/home/kenji/src/web-gps-logger/test/components/wgl/gps-log-localstorage-repository/gps-log-localstorage-repository_spec.ts',
                    line: 12
                }));
            });
        });
    });
}(WglSpec || (WglSpec = {})));