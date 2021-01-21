var logger = require('../utils/logger');

//var Server = require('socket.io');
//var io = require('socket.io')(server);
//var io = new Server();

export class ClientNotificationMgr {
    private static _instance: ClientNotificationMgr = new ClientNotificationMgr();
    private static _server = require('socket.io');
    private static _io: any = null;

    constructor() {
        if (ClientNotificationMgr._instance) {
            throw new Error('Use ClientNotificationMgr.getInstance()');
        }

        logger.info('[ClientNotificationMgr] Creating StationMgr');
        ClientNotificationMgr._instance = this;
    }

    public static getInstance(): ClientNotificationMgr {
        return ClientNotificationMgr._instance;
    }

    public init(server: any) {
        if (server && !ClientNotificationMgr._io) {
            ClientNotificationMgr._io = new ClientNotificationMgr._server(server);

            ClientNotificationMgr._io.on('connection', (socket) => {
                logger.debug('[io] a user connected');
            });
        }
    }

    fireOnStationChange(stations: any) {
        logger.debug('[fireOnStationChange] in');
        if (ClientNotificationMgr._io) {
            ClientNotificationMgr._io.emit('onStationChange', stations);
        }
    }

    fireOnStationRunChange(schldName: string, station: any) {
        logger.debug('[fireOnStationRunChange]');

        if (ClientNotificationMgr._io) {
            ClientNotificationMgr._io.emit('onStationRunChange',
                {
                    schldName: schldName,
                    station: station
                });
        }
    }
}
