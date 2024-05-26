"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupNavigation = void 0;
var regions_1 = require("./regions");
var lang = localStorage.getItem('lang');
var currentRegion = null;
var _a = [0, 0, 0, 0], vBX = _a[0], vBY = _a[1], vBW = _a[2], vBH = _a[3];
var _b = [0, 0, 0, 0], prevX = _b[0], prevY = _b[1], prevW = _b[2], prevH = _b[3];
var ZoomOut = function () {
    var _a;
    var svgid = $('#map')[0];
    var svg = svgid.contentDocument.querySelector('svg');
    var anim = svg.querySelector('animate');
    anim.setAttribute('dur', '100ms');
    anim.setAttribute('from', "".concat(prevX, " ").concat(prevY, " ").concat(prevW, " ").concat(prevH));
    anim.setAttribute('to', "".concat(vBX, " ").concat(vBY, " ").concat(vBW, " ").concat(vBH));
    anim.beginElement();
    _a = [vBX, vBY, vBW, vBH], prevX = _a[0], prevY = _a[1], prevW = _a[2], prevH = _a[3];
};
var CloseDesc = function () {
    $('overlay').removeClass('active');
    $('description').removeClass('active');
    $('description').empty();
};
var ResetMap = function () {
    CloseDesc();
    ZoomOut();
};
var SetupNavigation = function () {
    $('.nav-item').each(function (index, item) {
        $(item).on('click', function () {
            if (!$(item).hasClass('map__active')) {
                $('.map__active').removeClass('map__active');
                $(item).addClass('map__active');
                CloseDesc();
                OpenMap($('.nav-item')[index]);
            }
        });
    });
    $('#map').on('load', function () {
        var _a, _b;
        var svgid = $('#map')[0];
        CloseDesc();
        if ($('#map').prop('data').includes('main.svg')) {
            return;
        }
        ;
        var defs = svgid.contentDocument.getElementsByTagName('defs')[0];
        defs.innerHTML += "<style><![CDATA[.onmenu {transform:scale(2);stroke-width: 0.7!important;fill: #FF0000!important;} .highlight {transform-origin: center center; transform-box: fill-box;} .highlight:hover{transform:scale(2);stroke-width: 0.7!important;fill: #FF0000!important;cursor:pointer!important}]]></style>";
        var svg = svgid.contentDocument.querySelector('svg');
        _a = svg.getAttribute('viewBox').split(' ').map(Number), vBX = _a[0], vBY = _a[1], vBW = _a[2], vBH = _a[3];
        _b = svg.getAttribute('viewBox').split(' ').map(Number), prevX = _b[0], prevY = _b[1], prevW = _b[2], prevH = _b[3];
        var anim = svgid.contentDocument.createElementNS('http://www.w3.org/2000/svg', 'animate');
        anim.setAttribute('attributeName', 'viewBox');
        anim.setAttribute('fill', 'freeze');
        svg.appendChild(anim);
        RenderList();
    });
};
exports.SetupNavigation = SetupNavigation;
var RenderLinks = function (link, label) {
    $('.desc__links').append("<li class=\"desk__link\"><a href=\"".concat(link, "\" target=\"_blank\">").concat(label, "</a></li>"));
};
var ShowDesc = function (data, x, w) {
    var $desc = $('description');
    var $over = $('overlay');
    $($desc).empty();
    $($over).addClass('active');
    window.scrollTo(0, 0);
    var y = document.querySelector('.nav-menu').getBoundingClientRect().top;
    if (x + w / 2 < window.screen.width / 2) {
        $($desc).css('left', String(w / 8 + window.screen.width / 2) + 'px');
        $($desc).css('top', String(y * 2) + 'px');
    }
    else {
        $($desc).css('left', String(w / 2) + 'px');
        $($desc).css('top', String(y * 2) + 'px');
    }
    switch (lang) {
        case 'ru':
            $($desc).append("<h2>".concat(data.name_ru, "</h2>"));
            break;
        default:
            $($desc).append("<h2>".concat(data.name, "</h2>"));
            break;
    }
    $($desc).append("<a title=\"".concat(data.flag_cc, "\"><img src=\"").concat(data.flag, "\"></img></a>"));
    switch (lang) {
        case 'ru':
            $($desc).append("<main>".concat(data.description_ru, "</main>"));
            break;
        default:
            $($desc).append("<main>".concat(data.description, "</main>"));
            break;
    }
    $($desc).append('<close__button><img src="./resources/icons8-close.svg"></img></close__button>');
    $($desc).append('<ul class="desc__links"></ul>');
    switch (lang) {
        case 'ru':
            for (var _i = 0, _a = data.links_ru; _i < _a.length; _i++) {
                var item = _a[_i];
                RenderLinks(item.link, item.label);
            }
            break;
        default:
            for (var _b = 0, _c = data.links; _b < _c.length; _b++) {
                var item = _c[_b];
                RenderLinks(item.link, item.label);
            }
            break;
    }
    $($desc).addClass('active');
    $($over).on('click', function () { ResetMap(); });
    $('close__button').on('click', function () { ResetMap(); });
    $(document).on('keydown', function (e) { e.preventDefault(); if (e.keyCode == 27) {
        ResetMap();
    } });
};
var Render = function (data) {
    $('#map').prop('data', data.viewPath);
    currentRegion = data;
    switch (lang) {
        case 'ru':
            $('ltitle').html("<h2>\u041D\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u043D\u043D\u044B\u0435 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0430 ".concat(data.name_ru, "</h2>"));
            break;
        default:
            $('ltitle').html("<h2>Unrecognized states of ".concat(data.name, "</h2>"));
            break;
    }
};
var ZoomIn = function (x, y, w, h) {
    var _a;
    var svgid = $('#map')[0];
    var svg = svgid.contentDocument.querySelector('svg');
    var offset = 1;
    if (w * h < vBW * vBH / 500)
        offset = 75;
    else if (w * h < vBW * vBH / 300)
        offset = 50;
    else if (w * h < vBW * vBH / 100)
        offset = 15;
    else if (w * h < vBW * vBH / 75)
        offset = 5;
    else if (w * h < vBW * vBH / 50)
        offset = 2;
    var _b = [Math.ceil(w + offset), Math.ceil(h + offset)], vw = _b[0], vh = _b[1];
    var xDest = Math.ceil(x - (vw - w) / 2);
    var yDest = Math.ceil(y - (vh - h) / 2);
    var anim = svg.querySelector('animate');
    anim.beginElement();
    anim.setAttribute('dur', '400ms');
    anim.setAttribute('from', "".concat(prevX, " ").concat(prevY, " ").concat(prevW, " ").concat(prevH));
    anim.setAttribute('to', "".concat(xDest, " ").concat(yDest, " ").concat(vw, " ").concat(vh));
    anim.beginElement();
    _a = [xDest, yDest, vw, vh], prevX = _a[0], prevY = _a[1], prevW = _a[2], prevH = _a[3];
};
var RenderList = function () {
    $('#states').empty();
    var svgid = $('#map')[0];
    var _loop_1 = function (item) {
        var svg = svgid.contentDocument.getElementById(item.id);
        switch (lang) {
            case 'ru':
                $('#states').append("<li id=\"".concat(item.id, "\" class=\"states-item\">").concat(item.name_ru, "</li>"));
                break;
            default:
                $('#states').append("<li id=\"".concat(item.id, "\" class=\"states-item\">").concat(item.name, "</li>"));
                break;
        }
        svg.classList.add('highlight');
        $("#".concat(item.id)).hover(function () { svg.classList.add('onmenu'); }, function () { svg.classList.remove('onmenu'); });
        var bbox = svg.getBBox();
        var pagebbox = svg.getBoundingClientRect();
        $(svg).on('click', function () { ZoomIn(bbox.x, bbox.y, bbox.width, bbox.height); });
        $("#".concat(item.id)).on('click', function () { ZoomIn(bbox.x, bbox.y, bbox.width, bbox.height); });
        $(svg).on('click', function () { ShowDesc(item, pagebbox.left, pagebbox.width); });
        $("#".concat(item.id)).on('click', function () { ShowDesc(item, pagebbox.left, pagebbox.width); });
    };
    for (var _i = 0, _a = currentRegion.unrec; _i < _a.length; _i++) {
        var item = _a[_i];
        _loop_1(item);
    }
};
var OpenMap = function (elem) {
    var elemId = elem.id;
    switch (elemId) {
        case 'africa-toggler':
            Render(regions_1.Regions[0]);
            break;
        case 'middle-east-toggler':
            Render(regions_1.Regions[1]);
            break;
        case 'south-caucasus-toggler':
            Render(regions_1.Regions[2]);
            break;
        case 'asia-toggler':
            Render(regions_1.Regions[3]);
            break;
        case 'europe-toggler':
            Render(regions_1.Regions[4]);
            break;
        case 'oceania-toggler':
            Render(regions_1.Regions[5]);
            break;
        case 'north-america-toggler':
            Render(regions_1.Regions[6]);
            break;
        case 'south-america-toggler':
            Render(regions_1.Regions[7]);
            break;
        default:
            console.log('Undefined region.');
            break;
    }
};
