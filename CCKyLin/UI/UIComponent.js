var KLComponentBase = require("KLComponentBase");
var UIComponent = cc.Class({
    extends: KLComponentBase,
    properties: {

    },
    onLoad() {
        KLApp.ui = this;
    },
});
