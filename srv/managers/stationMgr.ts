var fs = require('fs');
var path = require('path');
var logger = require('../utils/logger');

//export module skr {
export class Station {
    public id: string;
    public gpio: number;
    public active: boolean;
    public isRunning: boolean;
}
//}

export class StationMgr {

    private static _instance: StationMgr = new StationMgr();
    private stations: Array<Station> = null;
    private configFileName: string;
    constructor() {
        if (StationMgr._instance) {
            throw new Error('Use SingletonDemo.getInstance()');
        }

        console.log('[module.station] Creating StationMgr');
        this.init();
        StationMgr._instance = this;
    }

    private init() {
        logger.info('[StationMgr] init');
        this.configFileName = path.resolve(global.splinkr.appPath, './config/stations.json');
        var stationConfig: any = require(this.configFileName);
        console.log(this.configFileName);
        console.log(stationConfig);

        this.stations = new Array<Station>();
        stationConfig.stations.forEach((s) => {
            this.stations.push({
                id: s.id,
                gpio: s.gpio,
                active: s.active,
                isRunning: false,
            });
        });
    }

    public static getInstance(): StationMgr {
        return StationMgr._instance;
    }

    public getStations(): Array<Station> {
        return this.stations;
    }

    public updateStations(sts: Array<Station>) {
        sts.forEach((st) => this.updateStation(st));
    }

    public updateStation(st: Station) {
        logger.info('[StationMgr] updateStation');

        var station = this.getStationById(st.id);;

        if (st && station) {
            //Update Properties
            station.active = st.active;
        }

        return this.stations;
    }

    public saveStationsToConfigFile() {
        logger.info('[StationMgr] saveStationsToConfigFile');

        var sts = new Array<any>();
        this.stations.forEach((st) => {
            sts.push({
                id: st.id,
                gpio: st.gpio,
                active: st.active,
            });
        });

        fs.writeFileSync(
            this.configFileName,
            JSON.stringify({
                version: "1",
                stations: sts
            }, null, 4));
    }

    public getStationById(id: string): Station {
        if (this.stations) {
            for (var i = 0; i < this.stations.length; i++) {
                if (this.stations[i].id == id) {
                    return this.stations[i];
                }
            }
        }

        logger.info('[StationMgr] no station found for id -' + id);
        return null;
    }
}
