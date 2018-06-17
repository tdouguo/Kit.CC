var EntityBase = cc.Class({
    extends: cc.Component,
    properties: {
        /**
         * 实体 Id
         * 初始化 赋值 不允许改变
         */
        entityId: 0,
        /**
         * 序列 Id
         */
        serialId: 0,
    },
    /**
     * 初始化
     * 注:子类使用 需重写，调用  this._super(entityId); 使用扩展重写 
     */
    init: function (entityId) {
        if (KLApp.pool.IS_DEBUG) {
            KLLog.debug("[ENTITY] init ", this.name);
        }
        this.initName = this.name;
        this.entityId = entityId;
        this.showUserData = null;
        this.hideUserData = null;
    },
    /**
     * 回收 (销毁)
     * 注:重写需调用  this._super(); 使用扩展重写
     */
    recycle: function () {
        if (KLApp.pool.IS_DEBUG) {
            KLLog.debug("[ENTITY] recycle ", this.name);
        }
        this.showUserData = null;
        this.hideUserData = null;
        this.node.destroy();
    },
    /**
     * 显示
     * 注:重写需调用  this._super(userData); 使用扩展重写 
     */
    show: function (userData) {
        this.name = this.initName + "[" + this.entityId + "]-" + "[" + this.serialId + "]";
        if (KLApp.pool.IS_DEBUG) {
            KLLog.debug("[ENTITY] show ", this.name, userData);
        }
        this.node.y = 0;
        this.node.x = 0;
        // this.node.active = true;
    },
    /**
     * 隐藏
     * 注:重写需调用  this._super(userData); 使用扩展重写
     */
    hide: function (userData) {
        if (KLApp.pool.IS_DEBUG) {
            KLLog.debug("[ENTITY] hide ", this.name, userData);
        }
        this.name = this.initName;
        this.node.y = 99999;
        this.node.x = 99999;
        // this.node.active = false;
    },
});
