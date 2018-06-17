var KLComponentBase = require("KLComponentBase");

var KyLinApp = cc.Class({
    extends: cc.Component,
    properties: {
        components: {
            default: [],
            type: KLComponentBase,
            tooltip: "KyLin 组件"
        }
    },

    //#region CocosCreator API
    onLoad() {
        KLApp.app = this;
    },
    start() {
        KLApp.app.initKL();
    },
    onDestroy() {
        KLApp.app.shatdown();
    },
    //#endregion

    //#region Framework
    /**
     * 初始化框架
     */
    initKL() {
        KLLog.info("[KyLin] init.");
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] == undefined || this.components[i] == null) {
                KLLog.warn("[KyLin] Conponent init failed,index:", i);
            }
            try {
                this.components[i].init();
            } catch (error) {
                KLLog.error("[KyLin] Conponent init failed,error message :", this.components[i], error);
            }
        }
        KLLog.info("[KyLin] init Complete.");
        try {
            KLApp.app.emit(EVENT_KL_INIT, 'KyLin.Init.Complete');
        } catch (error) {
            KLLog.error("[KyLin] init Complete. emit event error,", error);
        }
    },
    /**
     * 关闭
     */
    shatdown() {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] == undefined || this.components[i] == null) {
                KLLog.warn("[KyLin] Conponent shatdown failed,index:", i);
            }
            try {
                this.components[i].shatdown();
            } catch (error) {
                KLLog.error("[KyLin] Conponent shatdown failed,error message :", this.components[i], error);
            }
        }
    },
    //#endregion

    emit: function (eventName, _msg) {
        try {
            KLApp.app.node.emit(eventName, {
                msg: _msg,
            });
        } catch (error) {
            KLLog.error("[pool] emitMsg try catch (error):", eventName, msg, " ERROR : ", error);
        }
    },
});
window.KLApp = {
    app: null,
    ui: null,
    sound: null,
    pool: null,
};