namespace splinkr.ui {
    export class settingsCtrl {

        public msg2: string;

        constructor() {
            console.log('[settingsCtrl] ctor - ' + new Date().toString());
            this.msg2 = '[settingsCtrl] Hello - ' + new Date().toString();
        }
    }
}