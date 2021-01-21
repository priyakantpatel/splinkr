/// <reference path="clientNotificationMgr.ts" />
/// <reference path="gpioMgr.ts" />
/// <reference path="stationMgr.ts" />
import stationM = require('./stationMgr');
var CronJob = require('cron').CronJob;
var async = require('async');
import cnMgr = require('./clientNotificationMgr');
import gpioMgr = require('./gpioMgr');
var logger = require('../utils/logger');

export class Job<T> {
    active: boolean = false;
    id: string;
    runTimeInSeconds: number = 0;
}

export class Schedule<T> {
    public active: boolean = false;
    public name: string = '';
    public scheduleType: ScheduleTypeEnums = ScheduleTypeEnums.Unknown;
    public startTime: Date = null;
    public jobTasks: Array<Job<T>> = new Array<Job<T>>();
    public cronJobObject: any = null;
    public cronStartTime: string = '';
}

export enum ScheduleTypeEnums {
    Unknown = 0,
    LEDTest = 1,
    Splinker = 2
}

export class ScheduleMgr {
    private static _instance: ScheduleMgr = new ScheduleMgr();
    private _schedules: Array<Schedule<any>> = new Array<Schedule<any>>();

    constructor() {
        if (ScheduleMgr._instance) {
            throw new Error('Use scheduleMgr.getInstance()');
        }
        logger.info('[StationMgr] Creating StationMgr');
        this.init();
        ScheduleMgr._instance = this;
    }

    public static getInstance(): ScheduleMgr {
        logger.debug('[ScheduleMgr.getInstance] in');

        return ScheduleMgr._instance;
    }

    private init() {
        logger.info('[ScheduleMgr.init] in');

        this.createOneEmptySchl();
    }

    private createOneEmptySchl() {
        logger.info('[ScheduleMgr.createOneEmptySchl] in');

        var schld = null;
        //schld1
        schld = this.getEmptySplinkrSchld();
        schld.active = true;
        schld.name = 'EveryMin05Sec';
        schld.cronStartTime = '5 * * * * *';
        this._schedules.push(schld);

        //schld2
        schld = this.getEmptySplinkrSchld();
        schld.active = true;
        schld.name = 'EveryMin25Sec';
        schld.cronStartTime = '25 * * * * *';
        this._schedules.push(schld);

        //schld3
        schld = this.getEmptySplinkrSchld();
        schld.active = true;
        schld.name = 'EveryMin35Sec';
        schld.cronStartTime = '35 * * * * *';
        this._schedules.push(schld);

        //schld4
        schld = this.getEmptySplinkrSchld();
        schld.active = true;
        schld.name = 'EveryMin45Sec';
        schld.cronStartTime = '45 * * * * *';
        this._schedules.push(schld);
    }

    private getEmptySplinkrSchld(): Schedule<stationM.Station> {
        logger.info('[ScheduleMgr.getEmptySplinkrSchld] in');

        var stationMgr = stationM.StationMgr.getInstance();

        var schld: Schedule<stationM.Station> = new Schedule<stationM.Station>();
        schld.name = 'GenericSchld';
        schld.scheduleType = ScheduleTypeEnums.Splinker;
        schld.startTime = null;
        //cronTime: '0 * * * * *',    //Every min 1st second
        schld.cronStartTime = '0 * * * * *';

        stationMgr.getStations().forEach((s) => {
            var jt: Job<stationM.Station> = new Job<stationM.Station>();
            jt.active = s.active;
            jt.id = s.id;
            jt.runTimeInSeconds = 1;

            schld.jobTasks.push(jt);
        });

        return schld
    }

    ////  Cron Pattern
    ////  http://help.sap.com/saphelp_xmii120/helpdata/en/44/89a17188cc6fb5e10000000a155369/content.htm
    ////
    ////  The cron pattern consists of six fields separated by spaces.The format is: [second][minute][hour][day of month] [month][day of week]
    ////
    ////  The allowed values for the cron pattern fields are described in the following table:
    ////  Field        --> Allowed Values
    ////  Second       --> 0 - 59
    ////  Minute       --> 0 - 59
    ////  Hour         --> 0 - 23
    ////  Day of month --> 1 - 31
    ////  Month        --> 0 - 11 (0 = January)
    ////  Day of week  --> 1 - 7  (1 = Sunday)
    ////
    ////  Pattern = Description
    ////  '* * * * * *'      --> Runs the job every second.None of the fields are restricted.
    ////  '*/5 * * * * *'    --> Runs every five seconds, starting at second zero (that is, seconds 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
    ////  '0 * * * * *'      --> Runs every minute, on the first second of the minute
    ////  '0 0 * * * *'      --> Runs every hour, on the first second of the minute and the first minute of the hour
    ////  '0 0 */4 * * *'    --> Runs every four hours, starting with hour zero (that is, hours 0, 4, 8, 12, 16, 20) on the first second of the minute and the first minute of the hour
    ////  '00 30 11 * * *'   --> Runs every day at 11:30:00 AM
    ////  '00 30 11 * * 2-6' --> Runs every weekday (Monday through Friday) at 11:30:00 AM.It does not run on Saturday or Sunday.
    ////  '00 30 11 1 0,6 *' --> Runs at 11:30:00 AM on the first of January and first of July
    ////  '00 30 11 1 0 2'   --> Runs at 11:30:00 AM on the first of January if it is Monday.It is uncommon to specify both a [Day of Month] and a [Day of Week], but it is allowed.This job runs every few years since the first of January is not always a Monday.

    public startAllJobs() {
        logger.info('[ScheduleMgr.startAllJobs] in');
        logger.info('[ScheduleMgr.startAllJobs] First stop all jobs - cleanup');
        this.stopAllJobs();

        this._schedules.forEach((schld) => {
            schld.cronJobObject = new CronJob({
                cronTime: schld.cronStartTime,
                onTick: () => {
                    var s = schld;
                    logger.info('[ScheduleMgr.runAllJobs] Time to run job ' + (new Date()).toString());

                    if (s.scheduleType == ScheduleTypeEnums.Splinker) {
                        this.runSchldSplinkr(s);
                    } else {
                        logger.warn('[ScheduleMgr.startAllJobs] invalid scheduleType');
                    }
                }
                , start: false
                //, timeZone: "America/Los_Angeles"
            });
            schld.cronJobObject.start();
        });
    }

    public stopAllJobs() {
        logger.info('[ScheduleMgr.stopAllJobs] in');
        this._schedules.forEach((schld) => {
            if (schld.cronJobObject) {
                schld.cronJobObject.stop();
                schld.cronJobObject = null;
            }
        });
    }

    public getAllSchedules(): Array<Schedule<any>> {
        return this._schedules;
    }

    private runSchldSplinkr(schld: Schedule<stationM.Station>) {

        var rt = new Array();
        var st = null;

        schld.jobTasks.forEach((js) => {
            rt.push((callback) => { this.runSchldSplinkrTask(callback, js, schld); });
        });

        async.series(rt,
            function (err, results) {
                logger.info('[runSchldSplinkr] All done - results and errors');
                logger.silly(results);
            });
    }

    private runSchldSplinkrTask(callback: any, js: Job<stationM.Station>, schld: Schedule<stationM.Station>) {

        var st = stationM.StationMgr.getInstance().getStationById(js.id);
        if (!st || !st.active) {
            callback(null, st.id);
            return;
        }

        logger.info('[runSchldSplinkrTask] in - ' + st.id + ', Time [' + (new Date()).toTimeString() + ']');

        st.isRunning = true;
        gpioMgr.gpioMgr.getInstance().on(st.gpio);
        cnMgr.ClientNotificationMgr.getInstance().fireOnStationRunChange(schld.name, st);

        setTimeout(() => {
            gpioMgr.gpioMgr.getInstance().off(st.gpio);
            st.isRunning = false;
            logger.info('[runSchldSplinkrTask] done - ' + st.id);
            callback(null, st.id);
            cnMgr.ClientNotificationMgr.getInstance().fireOnStationRunChange(schld.name, st);
        }, js.runTimeInSeconds * 1000);
    }
}
