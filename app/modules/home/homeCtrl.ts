namespace splinkr.ui {
    export class homeCtrl {

        static $inject = ['splinkrService', '$scope'];

        public msg: string;
        public stations: Array<splinkr.service.Station> = null;

        constructor(private splinkrService: splinkr.service.splinkrService,
            private $scope: ng.IScope) {
            console.log('[homeCtrl] ctor - ' + splinkrService.getStartTime().toString());
            this.init();
        }

        init() {
            this.splinkrService.getStations()
                .success((data: Array<splinkr.service.Station>, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                    this.msg = '[getStations] success';
                    this.stations = data;
                    console.log(this.stations);
                })
                .error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                    this.msg = '[getStations] failed';
                });

            this.splinkrService.subscribeStationChange((data: Array<splinkr.service.Station>) => {
                this.$scope.$apply(() => {
                    console.log('[subscribeStationChange]...');

                    //angular.copy(data, this.stations);
                    //this.stations = data;

                    //copy changes only
                    data.forEach((a) => {
                        this.stations.forEach((b) => {
                            if (b.gpio == a.gpio) {
                                b.active = a.active; 
                            } 
                        });
                    });
                });
            });

            this.splinkrService.subscribeStationRunChange((data: splinkr.service.OnStationRunChangeMsg) => {
                console.log('[subscribeStationRunChange]...');
                this.$scope.$apply(() => {
                    var showActiveSchldName: boolean = false;

                    this.stations.forEach((a) => {
                        if (data.station.gpio == a.gpio) {
                            a.isRunning = data.station.isRunning;
                            a.schldName = data.schldName;
                        }
                    });
                });
            });
        }

        //updateCmd(station: splinkr.service.Station) {
        updateCmd(station: splinkr.service.Station) {

            //station.active = !station.active;

            if (this.stations) {
                console.log('[updateCmd] updating stations');
                this.splinkrService.updateStations(this.stations)
                    .success((data: Array<splinkr.service.Station>, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                        this.msg = '[updateStations] success';
                    })
                    .error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                        this.msg = '[updateStations] failed';
                    });
            } else {
                console.log('[updateCmd] station infor is empty');
            }
        }
    }
}