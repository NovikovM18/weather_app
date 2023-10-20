<template>
  <div id="favorites" class="container">
    <h1>{{ $t('fav') }}</h1>
    <router-link class="link" to="/weather_app/">
      {{ $t('toMain') }}
    </router-link>

    <div v-if="blocks.list.length" class="blocks" v-for="(block) in blocks.list" :key="block.id">
      <WeatherCity :parent="'fav'" :block="block" />
    </div>
    <div v-else>no favorit cities</div>
  </div>
</template>

<script setup>
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import WeatherCity from './WeatherCity.vue';
  import { useStore } from 'vuex';

  const store = useStore();

  const blocks = reactive({list: []});

  const selectedCitiesStore = computed(() => {
    return store.state.data.selectedCities
  });
  
  onMounted(() =>{
    blocks.list = store.state.data.selectedCities.map((el) => {return {id: el}})
  });

  watch(selectedCitiesStore, () => {
    blocks.list = store.state.data.selectedCities.map((el) => {return {id: el}})
  });

</script>

<style lang="scss">
  #favorites {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 24px;

   .blocks {
      width: 100%;
    }

    .link {
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }
</style>