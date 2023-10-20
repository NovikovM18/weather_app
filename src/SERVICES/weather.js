import axios from 'axios';
import store from '../store'

const BASE_URL = import.meta.env.VITE_ENV_BASE_URL;
const API_KEY = import.meta.env.VITE_ENV_API_KEY;
const API_KEY_C = import.meta.env.VITE_ENV_API_KEY_C;

function getCity(q) {
  return axios.get(`https://api.swiftcomplete.com/v1/places/?key=${API_KEY_C}&text=${q}`);
};

function getWeatherByCity(city) {
  const lang = store.state.lang.selectedLang;
  const units = (lang === 'en') ? 'imperial' : 'metric';
  return axios.get(`${BASE_URL}forecast?q=${city}&units=${units}&lang=${lang}&appid=${API_KEY}`);
};

function getWeatherByCoords(lat, long) {
  const lang = store.state.lang.selectedLang;
  const units = (lang === 'en') ? 'imperial' : 'metric';
  return axios.get(`${BASE_URL}forecast?lat=${lat}&lon=${long}&units=${units}&lang=${lang}&appid=${API_KEY}`);
};


export const weatherService = {
  getWeatherByCity,
  getWeatherByCoords,
  getCity
};
