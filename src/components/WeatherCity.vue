<template>
  <div v-if="loading" class="l"><h1>LOADING</h1></div>
  <div v-if="!loading && cityWeather.data" class="city" @click="() => {filteredCities.data = []}">
    <div class="city_title">
      <button v-if="props.parent === 'main'" class="dltBtn" @click="delBlock">del</button>

      <div v-if="props.parent === 'main'" class="city_title__search">
        <input class="input" type="text" v-model="cityName" @input="getCity" :placeholder="$t('ph')" />
        <div class="list" >
          <p v-for="(city) in filteredCities.data" :key="city.id" @click="setCurrCityName(city.primary.text)">{{ city.primary.text }} - {{ city.secondary.text }}</p>
        </div>
      </div>

      <div class="city_title__name">
        <p>{{ cityWeather.data.city.name }}</p>

        <img v-if="!selectedCitiesStore" src="../assets/starNo.svg" alt="icon" title="add to favorites" @click="addToStore(cityWeather.data.city.name)">
        <img v-if="selectedCitiesStore" src="../assets/starOk.svg" alt="icon" title="del from favorites" @click="delFromStore(cityWeather.data.city.name)">
      </div>

      <div class="actions">
        <div class="actions_box">
          <p class="actions_box__name">{{ $t('view') }}</p>

          <div class="actions_box__config">
            <label :for="'detailing'+props.block.id">{{ $t('detailing') }}</label>
            <input type="radio" :id="'detailing'+props.block.id" value="detailing" v-model="viewType" />
          </div>
          
          <div class="actions_box__config">
            <label :for="'average'+props.block.id">{{ $t('average') }}</label>
            <input type="radio" :id="'average'+props.block.id" value="average" v-model="viewType" />
          </div>
        </div>

        <div class="actions_box">
          <p class="actions_box__name">{{ $t('period') }}</p>
          <div class="actions_box__config">
            <label :for="'day'+props.block.id">{{ $t('day') }}</label>
            <input type="radio" :id="'day'+props.block.id" value="day" v-model="selectedPeriodType" />
          </div>
          
          <div class="actions_box__config">
            <label :for="'week'+props.block.id">{{ $t('week') }}</label>
            <input type="radio" :id="'week'+props.block.id" value="week" v-model="selectedPeriodType" />
          </div>
        </div>
        
        <div class="actions_box">
          <div :class="selectedPeriodType === 'day' ? 'actions_box__config-dis' : 'actions_box__config'" >
            <label class="actions_box__name" :for="'checkbox'+props.block.id">{{ $t('dn') }}</label>
            <input :disabled="selectedPeriodType === 'day'" type="checkbox" :id="'checkbox'+props.block.id" v-model="dayNight" />
          </div>
          
          <div v-if="dayNight" class="actions_box2">
            <div class="actions_box__config">
              <label :for="'daily'+props.block.id">{{ $t('daily') }}</label>
              <input type="radio" :id="'daily'+props.block.id" value="day" v-model="selectedTimeType" />
            </div>
            
            <div class="actions_box__config">
              <label :for="'nightly'+props.block.id">{{ $t('nightly') }}</label>
              <input type="radio" :id="'nightly'+props.block.id" value="night" v-model="selectedTimeType" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="city_weather">
      <WeatherItem v-for="(weatherItem, index) in filteredWeather.data" :key="index" :weatherData="weatherItem"/>    
    </div>

    <canvas class="chart" :id="'chart'+props.block.id"></canvas>
  </div>

  <div v-if="!loading && !cityWeather.data" class="city" @click="() => {filteredCities.data = []}">
    <div class="city_title">
      <button v-if="props.parent === 'main'" class="dltBtn" @click="delBlock">del</button>

      <div v-if="props.parent === 'main'" class="city_title__search">
        <input class="input" type="text" v-model="cityName" @input="getCity" placeholder="type city" />
        <div class="list" >
          <p v-for="(city) in filteredCities.data" :key="city.id" @click="setCurrCityName(city.primary.text)">{{ city.primary.text }} - {{ city.secondary.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Chart from 'chart.js/auto';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { weatherService } from '../SERVICES/weather';
  import WeatherItem from './WeatherItem.vue';
  import { useStore } from 'vuex';

  const store = useStore();

  const props = defineProps({
    block: { type: Object, required: true },
    parent: { type: String, required: true } 
  });
  const emit = defineEmits(['delete']);

  const geolocationAPI = navigator.geolocation;
  const loading = ref(false);
  const cityWeather = reactive({data: null});
  const filteredWeather = reactive({data: null});
  const localWeather = reactive({data: null});
  const viewType = ref('detailing');
  const selectedPeriodType = ref('day');
  const dayNight = ref(false);
  const selectedTimeType = ref('day');
  const timeType = {
    day: '12:00:00',
    night: '00:00:00'
  };
  const cityName = ref('');
  const filteredCities = reactive({data: []});
  const chartData = reactive({
    time: [],
    temp: []
  });


  const selectedCitiesStore = computed(() => {
    return store.state.data.selectedCities.includes(cityWeather.data.city.name);
  });
  
  const lang = computed(() => {
    return store.state.lang.selectedLang;
  });
  
  onMounted(() => {
    getData();
  });
  
  function addChart() {
    setTimeout(() => {
      const ctx = document.getElementById('chart'+props.block.id);
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: chartData.time,
            datasets: [
              {
                label: "today day temp",
                data: chartData.temp,
                borderwidth: 1,
              },
              ],
            },
            options: {
              scales: {
                y: {
                  beginatzero: true,
                },
              },
            },
        });
      };
    }, 500);
  };

  function getData() {
    switch (props.parent) {
      case 'main':
        if (props.block.id === 'local') {
          getUserCoordinates();
        } else {
          if (cityWeather.data) {
            getCityWeather(cityWeather.data.city.name);
          };
        };
        break;
      case 'fav':
        getCityWeather(props.block.id);
        break;
      default:
        break;
    };
  }

  function addToStore(city) {
    store.dispatch('addToSelectedCities', city);
  };

  function delFromStore(city) {
    store.dispatch('delFromSelectedCities', city);
  };

  function delBlock() {
    emit('delete', {id: props.block.id, city: cityWeather.data? cityWeather.data.city.name : null});
  };

  function getUserCoordinates() {
    if (!geolocationAPI) {
      alert('Geolocation API is not available in your browser!')
    } else {
      getCurrentCityWeather();
    };
  };

  function getCurrentCityWeather() {
    loading.value = true;
    geolocationAPI.getCurrentPosition((res) => {
      const { coords } = res;
      if (coords.latitude && coords.longitude) {
        weatherService.getWeatherByCoords(coords.latitude.toFixed(2), coords.longitude.toFixed(2)).then((res) => {
          localWeather.data = res.data;
          cityWeather.data = res.data;
          filterData(res.data);
          loading.value = false;
        }).catch((err) => {
          loading.value = false;
          alert(err.message);
        });
      };
    }, (err) => {
      loading.value = false;
      alert(err.message)
    });
  };
  
  function filterData(data) {
    let arr = data.list;
    if (selectedPeriodType.value === 'day') {
      let currentDay =  arr[0].dt_txt.split(' ')[0];
      arr = arr.filter((el) => {return el.dt_txt.split(' ')[0] === currentDay});
    };
    if (dayNight.value) {
      arr = arr.filter((el2) => {return el2.dt_txt.split(' ')[1] === timeType[selectedTimeType.value]});
    };
    difByDays(arr, viewType.value);
  };
  
  function difByDays(arr, type) {
    let days = [];
    if (arr.length) {
      days.push({
        date: 'today',
        type: type,
        dayNight: dayNight.value,
        list: []
      });
    };
    
    let currentDay = arr[0].dt_txt.split(' ')[0];
    let prevDate = currentDay;
    let arrayNum = 0;
    
    arr.forEach((el) => {
      if (el.dt_txt.split(' ')[0] === prevDate) {
        days[arrayNum].list.push(el);
      } else {
        days.push({
          date: el.dt_txt.split(' ')[0],
          type: type,
          dayNight: dayNight.value,
          list: []
        });
        arrayNum++;
        days[arrayNum].list.push(el);
      };
      prevDate = el.dt_txt.split(' ')[0];
    });

    chartData.time = [];
    chartData.temp = [];

    days.forEach((el) => {
      let total = {
        main: {
          feels_like: 0,
          temp: 0,
          temp_max: 0,
          temp_min: 0,
        },
        visibility: 0,
        weather: {
          description: el.list[0].weather[0].description,
          icon: el.list[0].weather[0].icon,
        },
        wind: {
          deg: 0,
          gust: 0,
          speed: 0,
        },
      };
      el.list.forEach((el2) => {
        if (el.date === 'today') {
          chartData.time.push(el2.dt_txt.split(' ')[1]);
          chartData.temp.push(el2.main.temp);
        };
        total.main.feels_like += el2.main.feels_like;
        total.main.temp += el2.main.temp;
        total.main.temp_max += el2.main.temp_max;
        total.main.temp_min += el2.main.temp_min;
        total.visibility += el2.visibility;
        total.wind.deg += el2.wind.deg;
        total.wind.gust += el2.wind.gust;
        total.wind.speed += el2.wind.speed;

        if (el2.dt_txt.split(' ')[1] === '12:00:00') {
          total.weather.description = el2.weather[0].description;
          total.weather.icon = el2.weather[0].icon;
        };
      });

      el['average'] = {
        main: {
          feels_like: Math.round(total.main.feels_like / el.list.length), 
          temp: Math.round(total.main.temp / el.list.length),
          temp_max: Math.round(total.main.temp_max / el.list.length),
          temp_min: Math.round(total.main.temp_min / el.list.length),
        },
        visibility: Math.round(total.visibility / el.list.length),
        wind: {
          deg: Math.round(total.wind.deg / el.list.length),
          gust: Math.round(total.wind.gust / el.list.length),
          speed: Math.round(total.wind.speed / el.list.length),
        },
        weather: total.weather,
      };
    });
    filteredWeather.data = days;
    if (chartData.time.length && chartData.temp.length) {
      addChart();
    }
  };

  function getCity() {
    if (!cityName.value) {  
      filteredCities.data = [];  
    } else {
      const timeoutId = window.setTimeout(() => {}, 0);
      for (let id = timeoutId; id >= 0; id -= 1) {
        window.clearTimeout(id);
      };
      setTimeout(() => {
        weatherService.getCity(cityName.value).then((res) => {
          filteredCities.data = res.data;
        }).catch((err) => {
          alert(err);
        });
      }, 500);
    };
  };

  function setCurrCityName(name) {
    cityName.value = name;
    filteredCities.data = [];
    let q = name.split(' ')[1] ? name.split(' ')[0] + ' ' + name.split(' ')[1] : name.split(' ')[0];
    getCityWeather(q);
  };

  function getCityWeather(city) {
    weatherService.getWeatherByCity(city).then((res) => {
      cityWeather.data = res.data;
      filterData(res.data);
    }).catch((err) => {
      alert(err);
    });
  };

  watch(
    [viewType,selectedPeriodType, dayNight, selectedTimeType], () => {
      if (selectedPeriodType.value === 'day') {
        dayNight.value = false;
      };
      filterData(cityWeather.data);
    }
  );

  watch(lang, () => {
    getData();
  });

</script>

<style lang="scss">
  .city {
    min-width: 266px;
    padding: 4px;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    background-color: #ededed;
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
    
    &_title {
      position: relative;
      padding: 4px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      @media (max-width: 750px) {
        padding: 4px;
      };

      @media (max-width: 386px) {
        padding-top: 32px;
      };

      &__search {
        position: relative;

        .input {
          padding: 0 2px;
          margin-left: 36px;
          font-size: 18px;
          border: none;
          border-radius: 4px;
          box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;        }

        .list {
          z-index: 99;
          position: absolute;
          width: 100%;
          max-height: 400px;
          top: 24px;
          left: 0;
          // padding: 0 4px;
          background-color: rgb(212, 212, 212);

          p {
            margin: 0;
            cursor: pointer;
          }
        }
      }

      &__name {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 4px;

        p {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }

        img {
          width: 12px;
          cursor: pointer;
        }
      }

      .actions {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 4px;

        &_box {
          padding: 4px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          // border: 1px solid black;
          box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;

          &__name {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
          }

          &__config {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 2px;
            
            label, input {
              cursor: pointer;
            }
            
            &-dis {
              color: gray;
              cursor: pointer;
            }
          }

          @media (max-width: 386px) {
            font-size: 12px;
          };
        }
        &_box2 {
          padding: 0;
          border: none;
        }
      }

      .dltBtn {
        position: absolute;
        top: 4px;
        left: 4px;
        background-color: rgba(255, 0, 0, 0.575);
      }

      @media (max-width: 750px) {
        flex-direction: column;
      };
    }

    &_weather {
      padding: 4px;
      display: flex;
      gap: 4px;
      overflow-x: scroll;
      scrollbar-width: thin;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      
      &::-webkit-scrollbar {
        width: 8px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 12px;
        background: rgba(0,0,0,0.4);
      }
    }

    .chart {
      max-height: 200px;
      width: 100%;
    }
  }
</style>