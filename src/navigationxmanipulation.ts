import {IRegion} from './IRegion'
import {IUnrecRegion} from './IUnrecRegion'
import {Regions} from './regions'

const lang : string = localStorage.getItem('lang');

let currentRegion : IRegion = null;

let [vBX, vBY, vBW, vBH] : number[] = [0, 0, 0, 0];
let [prevX, prevY, prevW, prevH] : number[] = [0, 0, 0, 0];

const ZoomOut = () => {
  let svgid = $('#map')[0] as HTMLObjectElement;
  let svg = svgid.contentDocument.querySelector('svg');
  let anim = svg.querySelector('animate');

  anim.setAttribute('dur', '100ms');
  anim.setAttribute('from', `${prevX} ${prevY} ${prevW} ${prevH}`);
  anim.setAttribute('to', `${vBX} ${vBY} ${vBW} ${vBH}`);
  anim.beginElement();
  [prevX, prevY, prevW, prevH] = [vBX, vBY, vBW, vBH];
}
   
const CloseDesc = () => {
  $('overlay').removeClass('active');
  $('description').removeClass('active');
  $('description').empty();
}

const ResetMap = () => {
  CloseDesc();
  ZoomOut();
}

export const SetupNavigation = () => {
  $('.nav-item').each((index, item) => {
    $(item).on('click', () => {
      if (!$(item).hasClass('map__active')) {
        $('.map__active').removeClass('map__active');
        $(item).addClass('map__active');
        CloseDesc();
        OpenMap($('.nav-item')[index]);
      }
    }
  )});             
  $('#map').on('load', () => {
    let svgid = $('#map')[0] as HTMLObjectElement;
    CloseDesc();
    if ($('#map').prop('data').includes('main.svg')) {return;};
    let defs = svgid.contentDocument.getElementsByTagName('defs')[0];
    defs.innerHTML += `<style><![CDATA[.onmenu {transform:scale(2);stroke-width: 0.7!important;fill: #FF0000!important;} .highlight {transform-origin: center center; transform-box: fill-box;} .highlight:hover{transform:scale(2);stroke-width: 0.7!important;fill: #FF0000!important;cursor:pointer!important}]]></style>`;
    let svg = svgid.contentDocument.querySelector('svg');

    [vBX, vBY, vBW, vBH] = svg.getAttribute('viewBox').split(' ').map(Number);
    [prevX, prevY, prevW, prevH] = svg.getAttribute('viewBox').split(' ').map(Number);
    
    let anim = svgid.contentDocument.createElementNS('http://www.w3.org/2000/svg', 'animate');
    anim.setAttribute('attributeName', 'viewBox');
    anim.setAttribute('fill', 'freeze');
    svg.appendChild(anim);
     
    RenderList();
  });
} 

const RenderLinks = (link: string, label: string) => {
  $('.desc__links').append(`<li class="desk__link"><a href="${link}" target="_blank">${label}</a></li>`);
}

const ShowDesc = (data: IUnrecRegion, x: number, w: number) => {
  let $desc = $('description');
  let $over = $('overlay');
  $($desc).empty();
  $($over).addClass('active');

  window.scrollTo(0, 0);

  let y = document.querySelector('.nav-menu').getBoundingClientRect().top;

  if (x + w / 2 < window.screen.width / 2) {
    $($desc).css('left', String(w / 8 + window.screen.width / 2) + 'px');
    $($desc).css('top', String(y * 2) + 'px');
  }
  else {
    $($desc).css('left', String(w / 2) + 'px');
    $($desc).css('top', String(y * 2) + 'px');
  }
  switch (lang) {
  case 'ru': $($desc).append(`<h2>${data.name_ru}</h2>`); break;
  default:   $($desc).append(`<h2>${data.name}</h2>`);    break;
  }
  $($desc).append(`<a title="${data.flag_cc}"><img src="${data.flag}"></img></a>`);
  switch (lang) {
  case 'ru': $($desc).append(`<main>${data.description_ru}</main>`); break;
  default:   $($desc).append(`<main>${data.description}</main>`);    break;
  }

  $($desc).append('<close__button><img src="./resources/icons8-close.svg"></img></close__button>');

  $($desc).append('<ul class="desc__links"></ul>');

  switch (lang) {
  case 'ru': 
    for (let item of data.links_ru) {
      RenderLinks(item.link, item.label);
    } break;
  default:
    for (let item of data.links) {
      RenderLinks(item.link, item.label);
    } break;
  }

  $($desc).addClass('active');
  
  $($over).on('click', () => {ResetMap();});
  $('close__button').on('click', () => {ResetMap();});
  $(document).on('keydown', (e) => {e.preventDefault();if (e.keyCode == 27) {ResetMap();}});
}

const Render = (data: IRegion) => {
  $('#map').prop('data', data.viewPath);
  currentRegion = data;
  switch (lang) {
  case 'ru': $('ltitle').html(`<h2>Непризнанные государства ${data.name_ru}</h2>`); break;
  default: $('ltitle').html(`<h2>Unrecognized states of ${data.name}</h2>`);        break;
  }
}
const ZoomIn = (x: number, y: number, w: number, h: number) => {
  let svgid = $('#map')[0] as HTMLObjectElement;
  let svg = svgid.contentDocument.querySelector('svg');

  let offset : number = 1;
  if (w * h < vBW * vBH / 500) offset = 75;
  else if (w * h < vBW * vBH / 300) offset = 50;
  else if (w * h < vBW * vBH / 100) offset = 15;
  else if (w * h < vBW * vBH / 75) offset = 5;
  else if (w * h < vBW * vBH / 50) offset = 2;

  let [vw, vh] = [Math.ceil(w + offset), Math.ceil(h + offset)];
  const xDest = Math.ceil(x - (vw - w) / 2);
  const yDest = Math.ceil(y - (vh - h) / 2);

  let anim = svg.querySelector('animate');

  anim.beginElement();
  anim.setAttribute('dur', '400ms');
  anim.setAttribute('from', `${prevX} ${prevY} ${prevW} ${prevH}`);
  anim.setAttribute('to', `${xDest} ${yDest} ${vw} ${vh}`);
  anim.beginElement();
  [prevX, prevY, prevW, prevH] = [xDest, yDest, vw, vh];
}

const RenderList = () => {
  $('#states').empty();
  let svgid = $('#map')[0] as HTMLObjectElement;
  for (let item of currentRegion.unrec) {
    let svg = svgid.contentDocument.getElementById(item.id) as unknown as SVGGraphicsElement;
    switch (lang) {
    case 'ru': $('#states').append(`<li id="${item.id}" class="states-item">${item.name_ru}</li>`); break;
    default: $('#states').append(`<li id="${item.id}" class="states-item">${item.name}</li>`);      break;
    }
    svg.classList.add('highlight');
    $(`#${item.id}`).hover(() => {svg.classList.add('onmenu');}, () => {svg.classList.remove('onmenu');});


    let bbox = svg.getBBox();
    let pagebbox = svg.getBoundingClientRect();
    $(svg).on('click', () => {ZoomIn(bbox.x, bbox.y, bbox.width, bbox.height);});
    $(`#${item.id}`).on('click', () => {ZoomIn(bbox.x, bbox.y, bbox.width, bbox.height);});
    $(svg).on('click', () => {ShowDesc(item, pagebbox.left, pagebbox.width);});
    $(`#${item.id}`).on('click', () => {ShowDesc(item, pagebbox.left, pagebbox.width)});
  }
}

const OpenMap = (elem: Element) => {
  let elemId : string = elem.id;
  switch (elemId) {
  case 'africa-toggler':         Render(Regions[0]); break;
  case 'middle-east-toggler':    Render(Regions[1]); break;
  case 'south-caucasus-toggler': Render(Regions[2]); break;
  case 'asia-toggler':           Render(Regions[3]); break;
  case 'europe-toggler':         Render(Regions[4]); break;
  case 'oceania-toggler':        Render(Regions[5]); break;
  case 'north-america-toggler':  Render(Regions[6]); break;
  case 'south-america-toggler':  Render(Regions[7]); break;
  default:                       console.log('Undefined region.'); break;
  }
}
