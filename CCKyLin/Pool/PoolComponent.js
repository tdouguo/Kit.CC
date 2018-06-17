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
    },

    //#endregion

    //#region Framework

    init() {
        KLApp.pool = this;
        this._super();
        PoolComponent.serialId = 0;
        if (this.entityInfos.length == 0) {
            KLLog.warn("PoolComponent entity info count=0.");
            return;
        }
        this.Pools = new Array();                       // 节点池
        this.ShowEntitys = new Array();                 // 显示的实体

        for (let index = 0; index < this.entityInfos.length; index++) {
            let entityId = this.entityInfos[index].entityId;
            let entityPrefab = this.entityInfos[index].prefab;
            let entityInitNumber = this.entityInfos[index].initNumber;
            this.AddPool(entityId, entityPrefab, entityInitNumber)
        }
    },
    /**
     * 关闭
     */
    shatdown() {
        this._super();
        this.DestroyAllPool();
        PoolComponent.serialId = 0;
        KLApp.pool = null;
    },

    //#endregion

    //#region PoolBase 

    /**
     * 添加 节点池
     * @param {cc.Integer} entityId 
     * @param {cc.Prefab} prefab 
     * @param {cc.Integer} initNumber 
     * @return {cc.Boolean} 是否添加成功
     */
    AddPool(entityId, prefab, initNumber) {
        if (this.Pools[entityId] != undefined || this.Pools[entityId] != null) {
            KLLog.error("[pool] addNodePool not null.", entityId);
            return false;
        }
        this.Pools[entityId] = new cc.NodePool();
        for (let i = 0; i < initNumber; i++) {
            let entityBase = this._instantiateEntity(entityId, prefab, this.defaultEntityParent);
            this._putPool(this.Pools[entityId], entityBase, null);
        }
        return true;
    },


    /**
     * 销毁池 并且回收现有界面以显示的 对象
     * @param {cc.Integer} entityId 
     */
    DestroyPool(entityId) {
        if (this.Pools[entityId] == undefined || this.Pools[entityId] == null) {
            KLLog.error("[PoolConponent] destroyNodePool failed , entityId:", entityId);
        }
        this.RecycleEntity(entityId);
        this.Pools[entityId].clear();
        this.Pools[entityId] = null;
        delete this.Pools[entityId];
    },


    /**
     * 销毁所有池
     */
    DestroyAllPool() {
        this.RecycleAllEntity();
        for (var key in this.Pools) {
            console.log("[pool] DestroyAllPool, poolName:", key, ", size:", this.Pools[key].size());
            this.Pools[key].clear();
            this.Pools[key] = null;
            delete this.Pools[key];
        }
    },

    //#endregion

    //#region Entity API

    /**
     * 显示实体
     * @param {cc.Integer} entityId 实体 Id 
     * @param {Object} userData 用户数据
     * @return {cc.Integer} 实体的序列Id
     */
    ShowEntity: function (entityId, userData = null) {
        if (entityId == undefined) {
            KLLog.error(" ShowEntity error , not find entityId .");
            return -1;
        }
        let entityBase = this._getPool(this.Pools[entityId], entityId);
        if (entityBase) {
            PoolComponent.serialId += 1;
            entityBase.serialId = PoolComponent.serialId;
            this.ShowEntitys[entityBase.serialId] = entityBase;  // 添加到显示列表
            entityBase.show(userData);
            return entityBase.serialId;
        }
        return -1;
    },


    /**
     * 隐藏实体 (根据实体序列Id)
     * @param {Number} serialId
     * @param {object} userData
     */
    HideEntity: function (serialId, userData = null) {
        if (serialId == undefined) {
            KLLog.error(" HideEntity error , not find serialId .");
            return null;
        }
        if (this.ShowEntitys[serialId]) {
            this.HideEntityByEntityBase(this.ShowEntitys[serialId], userData);
            return true;
        } else {
            KLLog.error(" HideEntityByEntitySerialId error not find serialId ", serialId, userData);
            return false;
        }
    },


    /**
     * 获取 当前以显示的实体
     * @param {EntityBase} 获取以显示的实体
     */
    GetEntity: function (serialId) {
        if (serialId == undefined) {
            return null;
        }
        if (this.ShowEntitys[serialId]) {
            return this.ShowEntitys[serialId];
        } else {
            KLLog.error("[pool] GetEntity failed ,entity serialId:", serialId);
            return null;
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
        this._putPool(this.Pools[entityBase.entityId], entityBase, userData);
    },

    
    /**
     * 回收指定 实体Id的所有以显示的实体
     * @param {cc.Integer} 实体Id
     * @return {cc.Integer} 成功回收的总数量
     */
    RecycleEntity: function (entityId) {
        if (entityId == undefined) {
            return 0;
        }
        var count = 0;
        for (var key in this.ShowEntitys) {
            if (this.ShowEntitys[key].entityId == entityId) {
                count += 1;
                this.HideEntityByEntityBase(this.ShowEntitys[key], null);
            }
        }
        return count;
    },


    /**
     * 回收所有以显示的实体
     * @return {cc.Integer} 成功回收的总数量 
     */
    RecycleAllEntity: function () {
        for (var key in this.ShowEntitys) {
            this.HideEntityByEntityBase(this.ShowEntitys[key], null);
        }
    },


    /**
     * 查看当前显示的实体数量
     * @param {Number} entityId 实体Id
     * @return {Number} 当前实体以显示的数量
     */
    Count: function (entityId) {
        if (entityId == undefined) {
            return 0;
        }
        var count = 0;
        for (var key in this.ShowEntitys) {
            count += this.ShowEntitys[key].entityId == entityId ? 1 : 0;
        }
        return count;
    },


    /**
     * 显示实体总数量
     * @param {Number} entityId 实体Id
     * @return {Number} 当前实体以显示的数量
     */
    Cound: function () {
        let count = 0;
        for (var key in this.ShowEntitys) {
            count += 1;
        }
        return count;
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
     * @return {cc.Integer} 0存放Ok -1存放异常
     */
    _putPool(pool, entityBase, userData) {
        try {
            if (pool == null) {
                KLLog.error("[pool] putPool pool null.");
                return -1;
            }
            if (entityBase == null) {
                KLLog.error("[pool] putPool entity null.", pool);
                return -1;
            }
            if (this.defaultEntityParent && this.defaultEntityParent == cc.Node) {
                this.defaultEntityParent.addChild(entityBase.node);
            }
            pool.put(entityBase.node);
            return 0;
        } catch (error) {
            KLLog.error("[pool] _putPool try catch (error):", error);
            return -1;
        }
    },


    /**
     * 从池中获取对象
     * @param {NodePool} pool 
     * @param {Number} id
     * @return {EntityBase} 空则 取出失败
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
