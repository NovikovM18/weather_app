<template>
  <div class="header">
    <router-link to="/weather_app/">
      <img class="logo" src="../assets/logo.png" alt="logo">
    </router-link>
    
    <div class="actions">
      <select v-model="selected">
        <option v-for="option in options" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>

      <router-link to="/weather_app/readme">
        READ ME
      </router-link>
    </div>
  </div>
</template>

<script setup>
 import { useI18n } from "vue3-i18n";
 import { onMounted, reactive, ref, watch } from 'vue';
 import { useStore } from 'vuex';

  const store = useStore();
  const i18n = useI18n();
  const setLocale = (lang) => { i18n.setLocale(lang) };

  const selected = ref('');

  const options = reactive(
    [
      { text: 'UA', value: 'ua' },
      { text: 'EN', value: 'en' },
    ]
  );

  onMounted(() => {
    selected.value = store.state.lang.selectedLang;
  });

  watch(selected, () => {
    setLocale(selected.value);
    store.dispatch('setLang', selected.value);

  });


</script>

<style lang="scss">
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      width: 66px;
    }
  }
</style>