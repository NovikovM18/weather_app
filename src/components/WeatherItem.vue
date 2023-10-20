<template>
  <div class="weather">
    <div class="weather_title">
      <p v-if="weatherData.date === 'today'" class="weather_title__date">{{ $t('today') }}</p>
      <p v-else class="weather_title__date">{{ weatherData.date }}</p>
    </div>
    
    <div class="weather_body">
      <div class="weather_body__info">
        <p>{{ weatherData.average.main.temp }} °{{ $t('deg') }}</p>
        <img :src="getImageUrl(weatherData.average.weather.icon)" alt="wi">
        <p>{{ weatherData.average.weather.description }}</p>
      </div>
      
      <div v-if="weatherData.type === 'detailing' && !weatherData.dayNight" class="weather_body__list">
        <div class="item" v-for="(item, index) in weatherData.list" :key="index">
          <p>{{ item.dt_txt.split(' ')[1] }}</p>
          <p>{{ Math.round(item.main.temp) }} °{{ $t('deg') }}</p>
          <img :src="getImageUrl(item.weather[0].icon)" alt="wi">
          <p>{{ item.weather[0].description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({ weatherData: { type: Object, required: true } });

  function getImageUrl(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };
</script>

<style lang="scss">
  .weather {
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: #fcfcfc;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;

    &_title {
      &__date {
        font-size: 22px;
        font-weight: 600;
      }
      p {
        margin: 0;
      }
    }
    
    &_body {
      display: flex;
      
      &__info {
        min-width: 144px;
        padding: 4px;
        font-size: 20px;
        font-weight: 500;

        p {
          margin: 0;
        }
        
      }
      
      &__list {
        padding: 4px;
        // padding-top: 48px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        
        .item {
          width: 122px;
          padding: 4px;
          display: flex;
          flex-direction: column;
          box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
          
          p {
            margin: 0;
          }
        }
      }
    }
    
    
  }
</style>