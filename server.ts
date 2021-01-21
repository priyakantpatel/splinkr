/// <reference path="srv/managers/stationMgr.ts" />
/// <reference path="srv/managers/clientNotificationMgr.ts" />
/// <reference path="Scripts/typings/node/node.d.ts" />
/// <reference path="srv/managers/scheduleMgr.ts" />
var path = require('path');
global.splinkr = {};
global.splinkr.appPath = path.resolve(__dirname);

var logger = require('./srv/utils/logger');
var express = require('express');
var bodyParser = require('body-parser');
var io = null;
import stationM = require('./srv/managers/stationMgr');
import schldMgr = require('./srv/managers/scheduleMgr');
import cnMgr = require('./srv/managers/clientNotificationMgr');

logger.info('[Server] in');
schldMgr.ScheduleMgr.getInstance().startAllJobs();

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.locals.appStartTime = (new Date()).toString();

logger.info('Configure express');

app.use(express.static('app'));

app.get('/api/ping', function (req, res) {
    res.send('pong startTime [' + app.locals.appStartTime + '] - [' + (new Date()).toString() + ']');
});

app.get('/api/stations', function (req, res) {
    logger.debug('GET \'/api/stations\'');
    res.send(stationM.StationMgr.getInstance().getStations());
});

app.post('/api/job/stopall', function (req, res) {
    logger.debug('POST stop all');
    schldMgr.ScheduleMgr.getInstance().stopAllJobs();
    logger.debug('All jobs are stopped');
    res.send('All jobs are stopped');
});

app.post('/api/job/startall', function (req, res) {
    logger.debug('POST start all');
    schldMgr.ScheduleMgr.getInstance().startAllJobs();
    logger.debug('All jobs are started');
    res.send('All jobs are started');
});

app.get('/api/schedule', function (req, res) {
    logger.debug('GET \'/api/schedule\'');
    var schlds = schldMgr.ScheduleMgr.getInstance().getAllSchedules();
    var retVal: Array<any> = [];
    schlds.forEach((s) => {

        var schld = {
            name: s.name,
            scheduleType: s.scheduleType,
            cronStartTime: s.cronStartTime,
            jobs: []
        };

        s.jobTasks.forEach((j) => {
            schld.jobs.push({
                id: j.id,
                active: j.active,
                runTimeInSeconds: j.runTimeInSeconds
            });
        });

        retVal.push(schld);
    });

    res.send(retVal);
});

app.put('/api/stations', function (req, res) {
    logger.debug('PUT \'/api/stations\'');
    logger.debug(req.body);
    stationM.StationMgr.getInstance().updateStations(req.body);
    stationM.StationMgr.getInstance().saveStationsToConfigFile();
    var stations = stationM.StationMgr.getInstance().getStations();
    res.send(stations);
    cnMgr.ClientNotificationMgr.getInstance().fireOnStationChange(stations);
});

logger.info('Start server');

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    logger.info('Example app listening at http://%s:%s', host, port);
});

logger.info('Start client notification manager');
cnMgr.ClientNotificationMgr.getInstance().init(server);

//schldMgr.ScheduleMgr.getInstance().stopAllJobs(); //Just to test
