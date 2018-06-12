var KLComponentBase = require("KLComponentBase");
var EntityBase = require("EntityBase");

var EntityInfo = cc.Class({
    name: "EntityInfo",
    properties: {
        entityId: 0,
        initNumber: 0,
        prefab: cc.Prefab,
    }
});
var PoolComponent = cc.Class({
    extends: KLComponentBase,
    properties: {
        entityInfos: {
            default: [],
            type: EntityInfo
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
        KLApp.pool = this;
    },
    //#endregion

    //#region Framework
    init() {
        this._super();
        PoolComponent.serialId = 0;
        if (this.entityInfos.length == 0) {
            KLLog.console.warn("PoolComponent entity info count=0.");
            return;
        }
        for (let index = 0; index < this.entityInfos.length; index++) {
            var entityId = this.entityInfos[index].entityId;
            var entityPrefab = this.entityInfos[index].prefab;
            this[entityId] = new cc.NodePool();
            for (let i = 0; i < this.entityInfos[index].initNumber; i++) {
                let entityBase = this._instantiateEntity(entityId, entityPrefab, this.defaultEntityParent);
                this._putPool(this[entityId], entityBase, null);
            }
        }
        this.ShowEntitys = new Array();
    },
    /**
     * 关闭
     */
    shatdown() {
        this._super();
        for (let index = 0; index < this.entityInfos.length; index++) {
            this[entityId].clear();
            this[entityId] = null;
        }
        PoolComponent.serialId = 0;
    },
    //#endregion

    //#region API

    /**
     * 显示实体
     * @param {Number} entityId 实体 Id 
     * @param {Object} userData 用户数据
     */
    ShowEntity: function (entityId, userData) {
        let entityBase = this._getPool(this[entityId], entityId);
        if (entityBase) {
            PoolComponent.serialId += 1;
            entityBase.serialId = PoolComponent.serialId;
            this.ShowEntitys[entityBase.serialId] = entityBase;  // 添加到显示列表
            entityBase.show(userData);
            return entityBase.serialId;
        }
        return 0;
    },

    /**
     * 隐藏实体 (根据实体序列Id)
     * @param {Number} serialId
     * @param {object} userData
     */
    HideEntity: function (serialId, userData) {
        if (this.ShowEntitys[serialId]) {
            this.HideEntityByEntityBase(this.ShowEntitys[serialId], userData);
        } else {
            KLLog.error(" HideEntityByEntitySerialId error not find serialId ", serialId, userData);
        }
    },

    /**
     * 根据 实体序列Id 隐藏实体 
     * @param {cc.Node} nodeInfo 实体 Node 
     * @param {object} userData 用户数据
     */
    HideEntityByEntityNode: function (nodeInfo, userData) {
        let entityBase = nodeInfo.getComponent(EntityBase);
        if (entityBase) {
            this.HideEntityByEntityBase(entityBase, userData);
        }
    },

    /**
     * 根据 实体基类 隐藏实体
     * @param {EntityBase} entityBase 
     * @param {object} userData
     */
    HideEntityByEntityBase: function (entityBase, userData) {
        delete this.ShowEntitys[entityBase.serialId]; // 从显示列表删除  
        entityBase.serialId = 0;
        entityBase.hide(userData);
        this._putPool(this[entityBase.entityId], entityBase, userData);
    },

    /**
     * 附加子实体
     */
    AttachEntity: function (childEntityBase, parentEntityBase) {

    },

    /**
     * 解除子实体
     */
    DetachEntirty: function (childEntityBase) {

    },
    /**
     * 回收所有实体
     */
    RecycleAllEntity: function () {
        for (var key in this.ShowEntitys) {
            this.HideEntityByEntityBase(this.ShowEntitys[key], null);
        }
    },
    /**
     * 以显示实体数量
     * @param {Number} entityId 实体Id
     * @return {Number} 当前实体以显示的数量
     */
    Count: function (entityId) {
        var count = 0;
        for (var key in this.ShowEntitys) {
            count += this.ShowEntitys[key].entityId == entityId ? 1 : 0;
        }
        return;
    },

    //#endregion

    //#region 逻辑处理

    /**
     * 获取 Id 对应的预制件
     * @param {Number} id 
     * @return {Prefab} 返回预制件
     */
    _getEntityPrefab(entityId) {
        for (let index = 0; index < this.entityInfos.length; index++) {
            if (this.entityInfos[index].entityId == entityId) {
                return this.entityInfos[index].prefab;
            }
        }
        KLLog.error("[pool] getPool _getEntityPrefab null.", entityId);
        return null;
    },

    /**
     * 实例化 实体
     * @param {cc.Prefab} prefab 
     * @param {cc.Node} parent 
     * @return {EntityBase} 返回实例化的实体
     */
    _instantiateEntity(entityId, prefab, parent) {
        try {
            if (prefab == null) {
                KLLog.error("[pool] _instantiate prefab null.");
                return null;
            }
            var entityNode = cc.instantiate(prefab);
            var entityBase = entityNode.getComponent(EntityBase);
            if (entityBase == null) {
                entityBase = entityNode.addComponent(EntityBase);
            }
            if (parent && typeof this.defaultEntityParent == cc.Node) {
                parent.addChild(entity);
            }
            entityBase.init(entityId);
            return entityBase;
        } catch (error) {
            KLLog.error("[pool] _instantiate try catch (error):", error);
            return null;
        }
    },

    /**
     * 返回到池中
     * @param {cc.NodePool} pool 
     * @param {EntityBase} entity 
     */
    _putPool(pool, entityBase, userData) {
        try {
            if (pool == null) {
                KLLog.error("[pool] putPool pool null.");
                return;
            }
            if (entityBase == null) {
                KLLog.error("[pool] putPool entity null.", pool);
                return;
            }
            if (this.defaultEntityParent && this.defaultEntityParent == cc.Node) {
                this.defaultEntityParent.addChild(entityBase.node);
            }
            pool.put(entityBase.node);
        } catch (error) {
            KLLog.error("[pool] _putPool try catch (error):", error);
            return null;
        }
    },

    /**
     * 从池中获取对象
     * @param {NodePool} pool 
     * @param {Number} id
     * @return {EntityBase} 
     */
    _getPool(pool, id) {
        try {
            if (pool == null) {
                KLLog.error("[pool] getPool pool null.");
                return null;
            }
            var entityBase = null;
            if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                var entityNode = pool.get();
                this.defaultEntityParent.addChild(entityNode);
                entityBase = entityNode.getComponent(EntityBase);
            } else {
                let prefab = this._getEntityPrefab(id);
                if (prefab) {
                    entityBase = this._instantiateEntity(id, prefab, this.defaultEntityParent);
                }
            }
            return entityBase;
        } catch (error) {
            KLLog.error("[pool] _getPool try catch (error):", error);
            return null;
        }

    },

    //#endregion
});
