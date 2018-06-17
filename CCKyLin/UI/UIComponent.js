var KLComponentBase = require("KLComponentBase");
var UIComponent = cc.Class({
    extends: KLComponentBase,
    properties: {

    },
    onLoad() {
    },

    //#region Framework
    init() {
        KLApp.ui = this; 
        this._super();
    },
    /**
     * 关闭
     */
    shatdown() {
        this._super();
        KLApp.ui = null; 
    },
    //#endregion
});
