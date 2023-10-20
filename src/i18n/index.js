import { createI18n } from "vue3-i18n";

const messages = {
  en: {
    weather: 'Weather',
    fav: 'Favorites',
    deg: 'F',
    toFav: 'go to favotites',
    toMain: 'go to main',
    today: 'today',
    ph: 'type city...',
    nightly: 'nightly',
    daily: 'daily',
    dn: 'day / night',
    week: 'week',
    day: 'day',
    average: 'average',
    detailing: 'detailing',
    view: 'view',
    period: 'period',
  },
  ua: {
    weather: 'Погода',
    fav: 'Улюблені',
    deg: 'С',
    toFav: 'перейти до улюблених',
    toMain: 'на головну',
    today: 'сьогодні',
    ph: 'введіть місто...',
    nightly: 'нічний',
    daily: 'денний',
    dn: 'день / ніч',
    week: 'тиждень',
    day: 'день',
    average: 'середній',
    detailing: 'детальний',
    view: 'вигляд',
    period: 'період',
    
  },
};

const i18n = createI18n({
  locale: "ua",
  messages: messages,
});

export default i18n;