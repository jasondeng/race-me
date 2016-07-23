(function () {
    'use strict';

    angular
        .module('app')
        .service('charts', charts);

    charts.$inject = ['$http'];
    function charts($http) {

        var getHealthData = function () {
            return $http.get('/profile')
                .success(function (response) {
                    console.log('get profile');
                    return response;
                });
        };

        var getDaysinMonth = function (month, year) {
            return new Date(year, month, 0).getDate();
        };

        var convertNumberToMonth = function (monthNumber) {
            var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
              var counter = 5;

              var dayNumbers = getDaysinMonth(i, year);

              for (let j = 1; j < dayNumbers + 1; j++) {
                  var day = i + " " + j + ", " + year;
                  var dataDay = (new Date(day).getDay());

                  var monthName = convertNumberToMonth(i - 1);
                  storedData[monthName].push([dataDay, counter, 0, j, year]);
                  if (dataDay === 6)
                      counter -= 1;
              }
          }

          //UPDATE CALENDAR VALUE STEPS
          for (let i = 0; i < data.health.totalStepsForEachDayOfYear.length; i++) {
              var dataSplit = data.health.totalStepsForEachDayOfYear[i].split("-");
              var currentDayHolder = dataSplit[0].split(",");
              //currentHolder[0] = Month Name currentHolder[1] = Month Day Number
              var currentHolder = currentDayHolder[0].split(" ");

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

        return {
            getHealthData: getHealthData,
            calendarData: calendarData,
            areaChartData: areaChartData,
            convertNumberToMonth: convertNumberToMonth
        };
    }
})();
