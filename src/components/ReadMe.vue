<template>
  <div id="read" class="container">
    <h1>README</h1>

    <div class="info">
      <h2>APIs:</h2>
      
      <p>weather: https://api.openweathermap.org/data/2.5/</p>

      <p>cities: https://api.swiftcomplete.com/v1/places/  (the key is available until October 30)</p>
    </div>

    <router-link class="link" to="/weather_app/">
      {{ $t('toMain') }}
    </router-link>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
  #read {
    .info {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .link {
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }
  
</style>