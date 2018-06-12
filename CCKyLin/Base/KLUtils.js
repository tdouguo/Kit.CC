var KLUtils = cc.Class({
   statics: {
      /**
       * 递归 正序 增加一个指定数值     
       * @param {Number} minNumber 最小数 (包含0)
       * @param {Number} maxNumber 最大数 (不包含自身)
       * @param {Number} nowNumber 现在的数值
       * @param {Number} ascNumber 减少几个数 （正整数）
       * @return 最后减完的结果数值
       */
      ascNumber: function (minNumber, maxNumber, nowNumber, ascNumber) {
         nowNumber = nowNumber + 1;
         if (nowNumber >= maxNumber) {
            nowNumber = 0;
         }
         ascNumber -= 1;
         if (ascNumber == 0) {
            return nowNumber;
         } else {
            return KLUtils.ascNumber(minNumber, maxNumber, nowNumber, ascNumber);
         }
      },
      
      /**
       * 递归 倒叙 减少一个指定数值    
       *      例如：最小数0 最大数5  现在数0 减少1个数  4
       *            最小数0 最大数5  现在数0 减少2个数  3
       *            最小数0 最大数5  现在数0 减少5个数  0
       *            最小数0 最大数5  现在数0 减少6个数  4
       * @param {Number} minNumber 最小数 (包含0)
       * @param {Number} maxNumber 最大数 (不包含自身)
       * @param {Number} nowNumber 现在的数值
       * @param {Number} descNumber 减少几个数 （正整数）
       * @return 最后减完的结果数值
       */
      descNumber: function (minNumber, maxNumber, nowNumber, descNumber) {
         nowNumber = nowNumber - 1;
         if (nowNumber < minNumber) {
            nowNumber = maxNumber - 1;
         }
         descNumber -= 1;
         if (descNumber == 0) {
            return nowNumber;
         } else {
            return KLUtils.descNumber(minNumber, maxNumber, nowNumber, descNumber);
         }
      },
      getMondayTime: function () {
         var now = new Date();
         var nowTime = now.getTime();
         var day = now.getDay();
         var hour = now.getHours();
         var minutes = now.getMinutes();
         var seconds = now.getSeconds();
         if (day == 0) {
            day = 7;
         }
         var oneDayLong = 24 * 60 * 60 * 1000;
         var oneHourLong = 60 * 60 * 1000;
         var oneMinusLong = 60 * 1000;
         var oneSecondLong = 1000;

         var MondayTime = nowTime
            - (day - 1) * oneDayLong
            - hour * oneHourLong
            - minutes * oneMinusLong
            - seconds * oneSecondLong;

         return new Date(MondayTime).getTime();
      },
      /**
       * 获取当前时间
       */
      getCurrentTime: function () {
         return new Date().getTime();
      },

      /**
       * 时间戳转换 HH:DD
       * @param {Integer} timestamp 时间戳
       * @return HH:DD 字符 时:分
       */
      timestampToTimeHHDD: function (timestamp) {
         var time = new Date(timestamp);
         return Utils.getTimeHHMM(time);
      },

      /**
       * @param {Data} time 时间 
       * @return HH:DD 字符 时:分
       */
      getTimeHHMM: function (time) {
         var h = time.getHours();//时
         var m = time.getMinutes();//分 
         h = h < 10 ? ('0' + h) : h;
         m = m < 10 ? ('0' + m) : m;
         return h + ":" + m;
      },

      //#region Random

      /** 
           * 随机浮点型小数  
           * @param  {cc.floor} lowerValue 最小值 
           * @param  {cc.floor} upperValue 最大值  
           * @return {cc.floor} 随机小数
           */
      randomFloor: function (lowerValue, upperValue) {
         if (lowerValue == 0 && upperValue == 0) {
            return 0;
         }
         var random = Math.random();
         if (random <= 0) {
            random = 0.01;
         }
         if (lowerValue == 0 && upperValue == 1) {
            return random;
         }
         return Math.random() * (upperValue - lowerValue) + lowerValue;
      },

      /**
       * 随机整数
       * @param {cc.Integer} lowerValue
       * @param {cc.Integer} upperValue
       * @return {cc.Integer} 随机整数
       */
      randomInt: function (lowerValue, upperValue) {
         if (lowerValue == upperValue) {
            return lowerValue;
         }
         if (upperValue + lowerValue == 1) {
            let value = Math.random();
            if (value < 0.5) {
               return 0;
            } else {
               return 1;
            }
         }
         // return parseInt(Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue));
         return parseInt(Math.random() * (upperValue - lowerValue) + lowerValue);
      }

      //#endregion

   }
});
window.KLUtils = KLUtils;
