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

        var twoWeeks = function (data) {
          let currentMonthNum = new Date().getMonth();
          let currentMonth = convertNumberToMonth(currentMonthNum);
          let start = new Date().getDate() - 1;
          let year = new Date().getFullYear();

          let storeTotal = [];
          let total = 0;
          let counter = 1;

          for (let i = 1; i < 15; i++) {

            if(start-counter !== -1){
              total += data[currentMonth][start-counter][2];
              counter++;
            }
            else if (currentMonthNum !== 0) { //NOT EQUAL TO JAN since only store current year data
              //get last month's name + days if current month day is 0
              currentMonth = convertNumberToMonth(currentMonthNum-1);
              start = getDaysinMonth(currentMonthNum,year);
              counter = 1;
              total += data[currentMonth][start-counter][2];
              counter++;
            }

            if (i % 7 === 0) {
              storeTotal.push(total);
              total = 0;
            }

          }

          if(storeTotal[0] < storeTotal[1]){
            return  +(-(storeTotal[1]-storeTotal[0])*100/storeTotal[1]).toFixed(2);
          }
          return +((storeTotal[1]-storeTotal[0])*100/storeTotal[0]).toFixed(2);
        };

        var getWUnderGround = function () {
            return $http.get('/weather')
                .success(function (response) {
                    return response.data;
                });
        };
        var convertToDate = function (dt) {
         return new Date(dt * 1000);
        };

        return {
            getHealthData: getHealthData,
            calendarData: calendarData,
            areaChartData: areaChartData,
            convertNumberToMonth: convertNumberToMonth,
            twoWeeks: twoWeeks,
            getWUnderGround: getWUnderGround,
            convertToDate:convertToDate
        };
    }
})();
