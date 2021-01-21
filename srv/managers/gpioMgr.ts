var logger = require('../utils/logger');

//var Gpio = require('onoff').Gpio,
//    led = new Gpio(14, 'out'),
//    button = new Gpio(4, 'in', 'both');

export class onoff_simulate {
    constructor(private gpioId: number, private direction: string) {
    }

    public writeSync(val: number) {
        if (val == 0) {
            logger.warn('[onoff_simulate] <<<<< ' + this.gpioId + ' On >>>>>');
        } else if (val == 1) {
            logger.warn('[onoff_simulate] >>>>> ' + this.gpioId + ' Off <<<<<');
        } else {
            logger.warn('[onoff_simulate] <><><> invalid value <><><>');
        }
    }
}

export class gpioMgr {
    private static _instance: gpioMgr = new gpioMgr();

    constructor() {
        if (gpioMgr._instance) {
            throw new Error('Use gpioMgr.getInstance()');
        }
        logger.info('[gpioMgr] Creating StationMgr');
        this.init();
        gpioMgr._instance = this;
    }

    public static getInstance(): gpioMgr {
        //console.log('[ScheduleMgr.getInstance] in');
        return gpioMgr._instance;
    }

    private Gpio: any;
    private Gpio16Out: any;
    private Gpio20Out: any;
    private Gpio21Out: any;

    private init() {
        logger.info('[gpioMgr.on] init');

        if ((process.platform || '').toLowerCase().indexOf('win') >= 0) {
            logger.warn('[gpioMgr.init] window os. simulate onoff');
            //window os. let's simulate
            this.Gpio = onoff_simulate;
        } else {
            this.Gpio = require('onoff').Gpio;
        }

        this.Gpio16Out = new this.Gpio(16, 'out');
        this.Gpio20Out = new this.Gpio(20, 'out');
        this.Gpio21Out = new this.Gpio(21, 'out');
    }

    public on(gpioId: number) {
        switch (gpioId) {
            case 16:
                logger.warn('[gpioMgr.on] 16');
                this.Gpio16Out.writeSync(1);
                break;
            case 20:
                logger.warn('[gpioMgr.on] 20');
                this.Gpio20Out.writeSync(1);
                break;
            case 21:
                logger.warn('[gpioMgr.on] 21');
                this.Gpio21Out.writeSync(1);
                break;
            default:
                logger.warn('Invalid GPIO ID - ' + gpioId);
                break;
        }
    }

    public off(gpioId: number) {
        switch (gpioId) {
            case 16:
                logger.warn('[gpioMgr.off] 16');
                this.Gpio16Out.writeSync(0);
                break;
            case 20:
                logger.warn('[gpioMgr.off] 20');
                this.Gpio20Out.writeSync(0);
                break;
            case 21:
                logger.warn('[gpioMgr.off] 21');
                this.Gpio21Out.writeSync(0);
                break;
            default:
                logger.warn('Invalid GPIO ID - ' + gpioId);
                break;
        }
    }
}