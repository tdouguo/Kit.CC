var KLComponentBase = require("KLComponentBase");
var UIFromBase = require("UIFromBase");
var UIFormInfo = cc.Class({
    name: "UIFormInfo",
    properties: {
        Id: 0,
        prefab: cc.Prefab,
        cache: {
            default: null,
            type: UIFromBase,
        },
        uiNode: {
            default: null,
            type: cc.Node
        }
    }
});
var UIComponent = cc.Class({
    extends: KLComponentBase,
    properties: {
        UIFormInfos: {
            default: [],
            type: UIFormInfo
        },
        defaultEntityParent: {
            default: null,
            type: cc.Node
        },
        IS_DEBUG: KL_DEBUG,
    },
    statics: {
        serialId: 0,
    },
    //#region CocosCreator API
    onLoad() {
        this.IS_DEBUG = KL_DEBUG == true ? this.IS_DEBUG : false;
    },

    //#endregion

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

    //#region API
    /**
     * 打开
     * @param {cc.Integer} id 
     */
    open(id) {
        var uiFormInfo = this._getUIFromInfo(id);
        if (uiFormInfo) {
            UIComponent.serialId++;
            uiFormInfo.cache.OnOpen(UIComponent.serialId, userData);
        }
    },
    /**
     * 关闭
     * @param {cc.Integer} id 
     */
    close(id, userData) {
        var uiFormInfo = this._getUIFromInfo(id);
        if (uiFormInfo) {
            uiFormInfo.cache.OnClose(userData);
        }
    },

    //#endregion

    /**
     * 检测 缓存并创建 UIFrom
     * @param {cc.Integer} id 
     * @return {UIFromBase}
     */
    _tryGetUIFrom(id) {
        var uiFormInfo = this._getUIFromInfo(id);
        if (uiFormInfo) {
            if (uiFormInfo.cache == undefined || uiFormInfo.cache == null) {
                uiFormInfo.uiNode = cc.instantiate(uiFormInfo.prefab);
                uiFormInfo.cache = uiFormInfo.uiNode.getComponent(UIFromBase);
                uiFormInfo.cache.OnInit(uiFormInfo.Id);
            }
        }
        return uiFormInfo;
    },

    _getUIFromInfo: function (id) {
        for (let i = 0; i < this.UIFormInfos.length; i++) {
            if (this.UIFormInfos[i].Id == id) {
                return this.UIFormInfos[i];
            }
        }
        KLLog.warn("[UI] not find UIFromInfo:", id);
        return null;
    },

}); 