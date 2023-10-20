import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import store from './store'
import router from './router'
import VueI18n from "./i18n";

createApp(App).use(store).use(router).use(VueI18n).mount('#app')
