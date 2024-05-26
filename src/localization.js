"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetLocale = void 0;
var locales_json_1 = __importDefault(require("../data/locales.json"));
var lang = localStorage.getItem('lang');
var SwitchLanguage = function (l) {
    localStorage.setItem('lang', l);
};
var RenderText = function () {
    for (var _i = 0, _a = locales_json_1.default.data; _i < _a.length; _i++) {
        var i = _a[_i];
        var e = $('body').find("[data-lang=\"".concat(i[0], "\"]"));
        switch (lang) {
            case 'ru':
                e.html(i[2]);
                break;
            default:
                e.html(i[1]);
                break;
        }
    }
};
var SetLocale = function () {
    var $s = $('#lang-switcher');
    if (lang != null)
        $($s).val(lang).prop('selected', true);
    else
        $($s).val('en').prop('selected', true);
    $($s).on('change', function () {
        var $v = $('#lang-switcher option:selected');
        SwitchLanguage(String($($v).val()));
        location.reload();
    });
    RenderText();
};
exports.SetLocale = SetLocale;
