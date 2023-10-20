<template>
  <div id="weather" class="container">
    <h1>{{ $t('weather') }}</h1>
    
    <router-link class="link" to="/weather_app/favorites">s
      {{ $t('toFav') }}
    </router-link>
    
    <div class="blocks" v-for="(block) in blocks.list" :key="block.id">
      <WeatherCity :parent="'main'" :block="block" @delete="openConfirm($event)" />
    </div>

    <button v-if="blocks.list.length < 5" @click="addBlock">add block</button>

    <div v-if="confirm" class="confirm">
      <h2>Are you sure want to delete {{ confirmCityName }} block?</h2>
      <div class="confirm_actions">
        <button class="confirm_actions__del" @click="deleteBlock">delete</button>
        <button class="confirm_actions__cl" @click="confirm = false">cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import WeatherCity from './WeatherCity.vue';

  const blocks = reactive({list: [{id: 'local'}]});
  const confirm = ref(false);
  const confirmCityName = ref('');
  const confirmId = ref('');

  function addBlock() {
    if (!blocks.list.length) {
      blocks.list.push({id: 'local'});
    } else if (blocks.list.length && blocks.list.length < 5) {
      blocks.list.push({id: Date.now()});
    };
  };

  function deleteBlock() {
    blocks.list = blocks.list.filter((el) => {return el.id !== confirmId.value});
    confirm.value = false;
  };

  
  function openConfirm(data) {
    if (!data.city) {
      blocks.list = blocks.list.filter((el) => {return el.id !== data.id});
    } else {
      confirmCityName.value = data.city;
      confirmId.value = data.id;
      confirm.value = true;
    };
  };
  

  onMounted(() => {
    
  });

  



</script>

<style lang="scss">
  #weather {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 24px;

    .blocks {
      width: 100%;
    }

    .confirm {
      position: absolute;
      padding: 36px;
      background-color: #fff;
      border: 2px solid black;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);

      &_actions {
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
    }

    .link {
      position: absolute;
      top: 2px;
      right: 24px;
    }
  }
</style>