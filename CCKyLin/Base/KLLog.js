
var KLLog = cc.Class({
   statics: {
      debug: function (message, ...optionalParams) {
         if (KL_DEBUG == false) {
            return;
         }
         console.log('[DEBUG] ' + message, ...optionalParams)
      },
      info: function (message, ...optionalParams) {
         if (KL_DEBUG == false) {
            return;
         }
         console.log('[INFO] ' + message, ...optionalParams)
      },
      warn: function (message, ...optionalParams) {
         if (KL_DEBUG == false) {
            return;
         }
         console.warn('[WARN] ' + message, ...optionalParams)
      },
      error: function (message, ...optionalParams) {
         if (KL_DEBUG == false) {
            return;
         }
         console.error('[ERROR] ' + message, ...optionalParams)
      },
   }
});
window.KLLog = KLLog;