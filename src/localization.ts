import Locales from '../data/locales.json'

const lang = localStorage.getItem('lang');

const SwitchLanguage = (l: string) => {
  localStorage.setItem('lang', l);
}

const RenderText = () => {
  for (let i of Locales.data) {
    let e = $('body').find(`[data-lang="${i[0]}"]`);
  
    switch (lang) {
    case 'ru': e.html(i[2]); break;
    default: e.html(i[1]);   break;
    }
  }
}

export const SetLocale = () => {
  let $s = $('#lang-switcher');
  if (lang != null) $($s).val(lang).prop('selected', true);
  else $($s).val('en').prop('selected', true);
  $($s).on('change', () => {
    let $v = $('#lang-switcher option:selected');
    SwitchLanguage(String($($v).val()));
    location.reload();
  });

  RenderText();
}