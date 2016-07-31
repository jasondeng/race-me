(function () {
    'use strict';

    angular
        .module('app')
        .service('charts', charts);

    charts.$inject = ['$http', '$resource'];
    function charts($http, $resource) {

        var getHealthData = function () {
            return $http.get('/profile')
                .success(function (response) {
                    return response;
                });
        };

        var getDaysinMonth = function (month, year) {
            return new Date(year, month, 0).getDate();
        };

        var convertNumberToMonth = function (monthNumber) {
            let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return month[monthNumber];
        };

        var calendarData = function (data) {
          let storedData = {
              Jan: [],
              Feb: [],
              Mar: [],
              Apr: [],
              May: [],
              Jun: [],
              Jul: [],
              Aug: [],
              Sep: [],
              Oct: [],
              Nov: [],
              Dec: []
          };

          //GET CURRENT YEAR
          let year = new Date().getFullYear();

          //CREATE CALENDAR
          for (let i = 1; i < 13; i++) {
              let counter = 5;

              let dayNumbers = getDaysinMonth(i, year);

              for (let j = 1; j < dayNumbers + 1; j++) {
                  let day = i + " " + j + ", " + year;
                  let dataDay = (new Date(day).getDay());

                  let monthName = convertNumberToMonth(i - 1);
                  storedData[monthName].push([dataDay, counter, 0, j, year]);
                  if (dataDay === 6)
                      counter -= 1;
              }
          }

          //UPDATE CALENDAR VALUE STEPS
          for (let i = 0; i < data.health.totalStepsForEachDayOfYear.length; i++) {
              let dataSplit = data.health.totalStepsForEachDayOfYear[i].split("-");
              let currentDayHolder = dataSplit[0].split(",");
              //currentHolder[0] = Month Name currentHolder[1] = Month Day Number
              let currentHolder = currentDayHolder[0].split(" ");

              if (storedData[currentHolder[0]][Number(currentHolder[1]) - 1] !== undefined && year === Number(currentDayHolder[1]))
                  storedData[currentHolder[0]][Number(currentHolder[1]) - 1].splice(2, 1, Number(dataSplit[1]));
          }
          return storedData;
        };

        var areaChartData = function (selectedMonthName, calendarData) {
          let storeMonth = [];
          calendarData[selectedMonthName].forEach(function(value) {
            let dateData = Date.parse(selectedMonthName + " " + value[3] + ", " + value[4]);
            if (value[2] === 0){
              storeMonth.push([value[3],null,dateData]);
            }
            else {
              storeMonth.push([value[3],value[2],dateData]);
            }
          });
          return storeMonth;
        };

        var getWeatherAPI = function () {
            return $http.get('config.json')
                .success(function (response) {
                    return response.API_KEY;
                });
        };

        var returnWeather = function (city, days, API_KEY) {
          let weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {callback:"JSON_CALLBACK"}, {get:{method:"JSONP"}});
          return weatherAPI.get({q: city, cnt: days, APPID: API_KEY});
        };

        var convertToFahrenheit = function (degK) {
          return Math.round((1.8 *(degK - 273)) + 32);
        };

        var convertToDate = function (dt) {
          return new Date(dt * 1000);
        };

        return {
            getHealthData: getHealthData,
            calendarData: calendarData,
            areaChartData: areaChartData,
            convertNumberToMonth: convertNumberToMonth,
            getWeatherAPI: getWeatherAPI,
            returnWeather: returnWeather,
            convertToFahrenheit: convertToFahrenheit,
            convertToDate: convertToDate
        };
    }
})();
