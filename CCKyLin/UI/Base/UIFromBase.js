
var UIFromBase = cc.Class({
    extends: cc.Component,

    properties: {
        uiFromId: 0,
        serialId: 0,
        _alpha: 1,
        _interactable: true,
        _displaylevel: 0,
    },

    //#region 属性
    /**
      * 获取 是否可交互
      */
    get Interactable() {
        return this._interactable;
    },
    /**
     * 设置 是否可交互的
     * @param {cc.Boolean} value
     */
    set Interactable(value) {
        this._interactable = value;
    },
    /**
     * 获取 Alpha值
     * @return {cc.Integer} 
     */
    get Alpha() { return this._alpha; },
    /**
     * 设置 Alpha值
     * @param {cc.Float} value
     */
    set Alpha(value) { this._alpha = value; },
    /**
     * 获取 显示的层级.
     * @return {cc.Integer}
     */
    get Displaylevel() { return this._displaylevel },
    /**
     * 设置 显示的层级.
     * @param {cc.Integer} 层级
     */
    set Displaylevel(value) { this._displaylevel = value; },
    //#endregion

    /**
     * 显示层对象被创建事件.
     * @param {Object} userData 
     */
    OnInit(uiFromId, userData) {
        this.uiFromId = uiFromId;
        this.initName = this.node.name;
    },


    /**
     * 显示层对象被打开事件.
     * @param {Object} userData 
     */
    OnOpen(serialId, userData) {
        this.serialId = serialId;
        this.node.name = "[" + this.initName + "]-" + thi.serialId;
        this.node.active = true;

    },


    /**
     * 显示层对象被关闭事件.
     * @param {Object} userData 
     */
    OnClose(userData) {
        this.node.name = this.initName;
        this.node.active = false; 
    },

    /**
     * 显示层对象被暂停事件.
     */
    OnPause() { },


    /**
     * 显示层对象由暂停到继续事件.
     */
    OnResume() { },


    /**
     * 显示层对象被更新事件.
     */
    OnUpdate() { },


    /**
     * 显示层对象被销毁事件.
     */
    OnDestroyed() { },


    /**
     * 被重新使用事件.
     */
    OnReuse() { },


    /**
     * 播放声音事件.
     * @param {cc.Integer} soundAssetsId 声音资产Id.
     */
    OnPlaySound(soundAssetsId) { },


    /**
     * 播放特效事件.
     * @param {c.Integer} effectAssetsId 特效资产Id.
     */
    OnPlayEffects(effectAssetsId) { },


    /**
     * 播放动画事件.
     * @param {cc.Integer} animationAssetsId 动画资产Id.
     */
    OnPlayAnimation(animationAssetsId) { },
});
