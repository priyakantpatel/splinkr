namespace splinkr.ui {
    export class scheduleCtrl {

        static $inject = ['splinkrService'];

        public schedules: Array<splinkr.service.Schedule>;

        constructor(private splinkrService: splinkr.service.splinkrService) {
            console.log('[scheduleCtrl] ctor - ' + new Date().toString());
            this.init();
        }

        private init() {
            console.log('[scheduleCtrl.init] in');

            this.splinkrService.getSchedule()
                .success((data: Array<splinkr.service.Schedule>, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                    console.log(data);
                    this.schedules = data;
                })
                .error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                    console.log('[scheduleCtrl.init] getSchedule Error');
                });
        }
    }
}