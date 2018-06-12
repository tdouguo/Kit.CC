
var KyLinApp = cc.Class({
    extends: cc.Component,
    properties: {
        ui: {
            default: null,
            type: require("UIComponent"),
        },
        sound: {
            default: null,
            type: require("SoundComponent")
        },
        pool: {
            default: null,
            type: require("PoolComponent")
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
        KLApp.ui.init();
        KLApp.sound.init();
        KLApp.pool.init();
        KLApp.app.emit(EVENT_KL_INIT, 'KyLin.Init.Complete');
    },
    /**
     * 关闭
     */
    shatdown() {
        KLApp.ui.shatdown();
        KLApp.sound.shatdown();
        KLApp.pool.shatdown();
        KLApp.ui = null;
        KLApp.sound = null;
        KLApp.pool = null;
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