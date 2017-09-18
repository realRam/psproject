// Generated by purs version 0.11.6
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var DOM = require("../DOM");
var DOM_HTML_Types = require("../DOM.HTML.Types");
var DOM_Node_Types = require("../DOM.Node.Types");
var Data_Functor = require("../Data.Functor");
var Data_Maybe = require("../Data.Maybe");
var Data_Nullable = require("../Data.Nullable");
var Prelude = require("../Prelude");
var form = function ($0) {
    return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Nullable.toMaybe)($foreign._form($0));
};
var contentDocument = function ($1) {
    return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Nullable.toMaybe)($foreign._contentDocument($1));
};
module.exports = {
    contentDocument: contentDocument, 
    form: form, 
    checkValidity: $foreign.checkValidity, 
    data_: $foreign.data_, 
    height: $foreign.height, 
    name: $foreign.name, 
    setCustomValidity: $foreign.setCustomValidity, 
    setData: $foreign.setData, 
    setHeight: $foreign.setHeight, 
    setName: $foreign.setName, 
    setType: $foreign.setType, 
    setUseMap: $foreign.setUseMap, 
    setWidth: $foreign.setWidth, 
    typeMustMatch: $foreign.typeMustMatch, 
    type_: $foreign.type_, 
    useMap: $foreign.useMap, 
    validationMessage: $foreign.validationMessage, 
    validity: $foreign.validity, 
    width: $foreign.width, 
    willValidate: $foreign.willValidate
};
