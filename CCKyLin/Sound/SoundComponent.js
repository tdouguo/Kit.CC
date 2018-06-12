var KLComponentBase = require("KLComponentBase");
var SoundComponent = cc.Class({
    extends: KLComponentBase,
    properties: {

    },
    onLoad() {
        KLApp.sound = this; 
    },
});
