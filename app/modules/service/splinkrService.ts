declare var io;
namespace splinkr.service {

    export class Station {
        public id: string;
        public gpio: number;
        public active: boolean;
        public isRunning: boolean;
        public schldName: string;   //UI-Client prop only
    }

    export class Schedule {
        public name: string;
        public scheduleType: string;
        public cronStartTime: string;
        public jobs: Array<Job>;
        public st_Second: string;
        public st_Minute: string;
        public st_Hour: string;
        public st_DayOfMonth: string;
        public st_Month: string;
        public st_DayOfWeek: string;
    }

    export class Job {
        public id: string;
        public active: string;
        public runTimeInSeconds: string;
    }

    export class OnStationRunChangeMsg {
        public schldName: string;
        public station: Station;
    }

    export class splinkrService {
        static $inject = ['$http'];

        private startTime: Date = null;

        constructor(private $http: ng.IHttpService) {
            console.log('[splinkrService] ctor');
            this.startTime = new Date();
            this.watchChanges();
        }

        public getStartTime(): Date {
            return this.startTime;
        }

        public getStations(): ng.IHttpPromise<Array<Station>> {
            return this.$http.get('/api/stations');
        }

        public updateStations(data: Array<Station>): ng.IHttpPromise<Array<Station>> {
            return this.$http.put('/api/stations', data);
        }

        private _subscribeStationChangeCB: (data: Array<Station>) => void;
        public subscribeStationChange(cb: (data: Array<Station>) => void) {
            console.log('[subscribeStationChange] in');
            this._subscribeStationChangeCB = cb;
        }

        private _subscribeStationRunChangeCB: (data: OnStationRunChangeMsg) => void;
        public subscribeStationRunChange(cb: (data: OnStationRunChangeMsg) => void) {
            console.log('[subscribeStationRunChange] in');
            this._subscribeStationRunChangeCB = cb;
        }

        public getSchedule(): ng.IHttpPromise<Array<Schedule>> {
            return this.$http.get('/api/schedule').success((data: Array<splinkr.service.Schedule>, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                console.log('[splinkrService.getSchedule]');
                var cronStartTime: string;
                data.forEach((s) => {
                    let splitStrs = s.cronStartTime.split(' ');
                    s.st_Second = splitStrs[0];
                    s.st_Minute = splitStrs[1];
                    s.st_Hour = splitStrs[2];
                    s.st_DayOfMonth = splitStrs[3];
                    s.st_Month = splitStrs[4];
                    s.st_DayOfWeek = splitStrs[5];
                });
                
            });
        }

        private socket: any = null;
        private watchChanges() {
            this.socket = io();
            //onStationChange
            this.socket.on('onStationChange', (msg: Array<Station>) => {
                console.log('[watchStationChange] onStationChange');
                console.log(msg);
                if (this._subscribeStationChangeCB) {
                    this._subscribeStationChangeCB(msg);
                } else {
                    console.log("[this._subscribeStationChangeCB] is empty");
                }
            });
            //onStationRunChange
            this.socket.on('onStationRunChange', (msg: OnStationRunChangeMsg) => {
                console.log('[watchStationChange] onStationRunChange');
                console.log(msg);
                if (this._subscribeStationRunChangeCB) {
                    this._subscribeStationRunChangeCB(msg);
                } else {
                    console.log("[this._subscribeStationRunChangeCB] is empty");
                }
            });
        }
    }
}