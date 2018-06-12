
var KLComponentBase = cc.Class({
   extends: cc.Component,

   properties: {

   },

   init() {
      KLLog.info("[KyLin] [", this.name, "] init.");
   },
   /**
    * 关闭
    */
   shatdown() {
      KLLog.info("[KyLin] [", this.name, "] shatdown.");
   },
}); 