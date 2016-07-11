git
function convertMonthNameToNumber(monthName) {
    var myDate = new Date(monthName + " 1, 2000");
    var monthDigit = myDate.getMonth();
    return isNaN(monthDigit) ? 0 : (monthDigit + 1);
}

function convertNumberToMonth(monthNumber) {
    var month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return month[monthNumber - 1];
}

$(function(){
    $.getJSON('testdata.json', function(data){
        var chart = highcharts.chart('#testingchart',{
            
        })
    });
});

$(function () {
    $.getJSON('testdata.json', function (data) {
        $('#testingchart').highcharts({
            chart: {
                type: 'line',
                zoomType: 'x',
                // height: '200',
                // width: 500,
                resetZoomButton: {
                  position: {
                    verticalAlign: 'top'
                  },
                  relativeTo: 'chart'
                }
            },
            title: {
                text: 'HealthKit'
            },
            xAxis: {
                type: 'datetime',
                labels: {
                  formatter: function() {
                    return Highcharts.dateFormat('%b %e', this.value);
                  }
                }
            },
            yAxis: {
                title: {
                    text: 'Steps',
                    margin: -10,
                    x: -15
                },
                tickInterval: 2000,
                offset: -8
            },
            tooltip:{
              hideDelay: 0.5,
              borderRadius: 8
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: 'Step Walked',
                data: function() {
                         var dataArr =[];
                         //Date.UTC(1970, 9, 21)
                         var dataLength = data.totalStepsForEachDayOfYear.length;
                         for (var i = dataLength - 1; i > dataLength - 15; i--) {
                        //  for (var i = data.totalStepsForEachDayOfYear.length -1; i > data.totalStepsForEachDayOfYear.length - 15; i--) {
                             var test = data.totalStepsForEachDayOfYear[i];
                            //
                             var HoldTest = test.split(":");
                             var res = HoldTest[0].slice(0,4);
                             var dateandYr = HoldTest[0].slice(4,HoldTest[0].length);
                            //  Steps
                             var Hold0 = Number(HoldTest[1]);
                            //  Date
                             var Hold1 = Date.parse(convertMonthNameToNumber(res)+ ' ' + dateandYr);

                             HoldTest[0] = Hold1;//Date
                             HoldTest[1] = Hold0;//steps
                             dataArr.push(HoldTest);
                         }
                          return dataArr;
                }()},
                {name: 'Walk/Run Distance',
                    data: function() {
                         var dataArr =[];
                         //Date.UTC(1970, 9, 21)
                         var dataLength = data.totalWalkRunDistanceForEachDayOfYear.length;
                         for (var i = dataLength - 1; i > dataLength - 15; i--) {
                             var test = data.totalWalkRunDistanceForEachDayOfYear[i];
                            //
                             var HoldTest = test.split(":");
                             var res = HoldTest[0].slice(0,4);
                             var dateandYr = HoldTest[0].slice(4,HoldTest[0].length);
                            //  Steps
                             var Hold0 = Number(HoldTest[1]);
                            //  Date
                             var Hold1 = Date.parse(convertMonthNameToNumber(res)+ ' ' + dateandYr);

                             HoldTest[0] = Hold1;//Date
                             HoldTest[1] = Hold0;//steps
                             dataArr.push(HoldTest);
                         }
                          return dataArr;
                }()},
            ],
            credits: {
              enabled: false
            }
        });
    });
});


// $(function () {
//     $.getJSON('testdata.json', function (data) {
//         $('#testingchart').highcharts({
//         chart: {
//             zoomType: 'xy'
//         },
//         title: {
//             text: 'Healthkit'
//         },
//         yAxis: {
//             type: 'datetime',
//             labels: {
//               formatter: function() {
//                 return Highcharts.dateFormat('%b %e', this.value);
//               },
//               ordinal: false
//             },
//             title: {
//                 enabled: true,
//                 text: 'Days'
//             },
//             // startOnTick: true,
//             // endOnTick: true,
//             showLastLabel: true
//         },
//         xAxis: {
//
//         },
//         legend: {
//             enabled: false
//         },
//         plotOptions: {
//             bubble:{
//                // minSize:100,
//                 //maxSize:200,
//                 minSIze:'1%',
//                 maxSize:'5%',
//                 magin:100
//             }
//         },
//         series: [{
//             // lineWidth: 0,
//             type: 'bubble',
//             name: 'Steps Per Day',
//             color: 'rgba(223, 83, 83, .5)',
//             data: function() {
//                      var dataArr =[];
//                      //Date.UTC(1970, 9, 21)
//                      for (var i = 0; i < data.totalStepsForEachDayOfYear.length; i++) {
//                          var test = data.totalStepsForEachDayOfYear[i];
//                         //
//                          var HoldTest = test.split(":");
//                          var res = HoldTest[0].slice(0,4);
//                          var dateandYr = HoldTest[0].slice(4,HoldTest[0].length);
//                         //  console.log(res);
//                          var Hold0 = Number(HoldTest[1]);
//                          var Hold1 = Date.parse(convertMonthNameToNumber(res)+ ' ' + dateandYr);
//
//
//                          HoldTest[0] = Hold0;//steps
//                          HoldTest[1] = Hold1;//Date
//                          HoldTest[2] = Hold0;//HOW BIG
//                          dataArr.push(HoldTest);
//                      }
//                       console.log(dataArr[1]);
//                       return dataArr;
//             }()
//         }],
//         credits: {
//           enabled: false
//         }
//     });
//
//     });
// });

$(function () {
    $.getJSON('testdata.json', function (data) {
        $('#dailyWalkRun').highcharts({
        chart: {
            zoomType: 'xy',
            resetZoomButton: {
              position: {
                verticalAlign: 'top'
              },
              relativeTo: 'chart'
            }
            // height: 300,
            // width: 700
        },
        title: {
            text: 'Healthkit'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Days'
            },
            tickInterval: 2,
            gridLineWidth: 0.5,
            lineWidth: 0,
            minorGridLineWidth: 0,
            tickLength: 0,
            minorTickLength: 0,
            // startOnTick: true,
            // endOnTick: false
            // showLastLabel: true
        },
        yAxis: {
            labels: {
              formatter: function() {
                return convertNumberToMonth(this.value);
              },
              ordinal: false
            },
            title: {
                enabled: false
                // text: 'Month'
            },
            // startOnTick: true,
            // showLastLabel: true
            startOnTick: false,
            endOnTick: false,
            tickPixelInterval: 15,
            gridLineWidth: 0
        },
        legend: {
            enabled: false
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<thead><tr>',
            pointFormatter: function () {
                return '<th> <center><strong>' + convertNumberToMonth(this.y) + ' ' + this.x +
                '</strong></center> </th> <th>' + this.z + ' Steps </th>';
            },
            footFormat: '</tr></thead>',
            positioner: function () {
                return { x: 40, y:0 };
            },
            shadow: false,
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0)'
        },
        plotOptions: {
            bubble:{
                minSize: '2',
                maxSize: '12',
            }
        },
        series: [{
            type: 'bubble',
            name: 'Steps Per Day',
            // color: 'rgba(223, 83, 83, .5)',
            data: function() {
                     var dataArr =[];
                     //Date.UTC(1970, 9, 21)
                     for (var i = 0; i < data.totalStepsForEachDayOfYear.length; i++) {
                         var test = data.totalStepsForEachDayOfYear[i];
                        //
                         var HoldTest = test.split(":");
                         var res = HoldTest[0].slice(0,4);

                        //  console.log(res);
                        var month = HoldTest[0].split(" ");
                        var monthNum = month[1].slice(0,month[1].length - 1);
                        // console.log(monthNum);
                        //  console.log(HoldTest);
                        //  var dateandYr = HoldTest[0].slice(4,HoldTest[0].length);
                        //  console.log(res);
                        var Hold0 = Number(HoldTest[1]);
                        var Hold1 = convertMonthNameToNumber(res);
                        // var Hold1 = Date.parse(convertMonthNameToNumber(res)+ ' ' + dateandYr);
                        // console.log(Hold0);

                         HoldTest[0] = Number(monthNum);//DAYS
                         HoldTest[1] = Hold1;//MONTH
                         HoldTest[2] = Hold0;//STEPS
                         dataArr.push(HoldTest);
                     }
                    //   console.log(dataArr[1]);
                      return dataArr;
            }()
        }],
        credits: {
          enabled: false
        }
    });

    });
});




// $.get("getdata",function (data) {
//     $('#dailyWalkRun').highcharts({
//         chart: {
//             // zoomType: 'xy',
//             resetZoomButton: {
//               position: {
//                 verticalAlign: 'top'
//               },
//               relativeTo: 'chart'
//             }
//             // height: 300,
//             // width: 700
//         },
//         title: {
//             text: 'Healthkit'
//         },
//         xAxis: {
//             title: {
//                 enabled: true,
//                 text: 'Days'
//             },
//             tickInterval: 5
//             // startOnTick: true,
//             // endOnTick: false
//             // showLastLabel: true
//         },
//         yAxis: {
//             labels: {
//               formatter: function() {
//                 return convertNumberToMonth(this.value);
//               },
//               ordinal: false
//             },
//             title: {
//                 enabled: false
//                 // text: 'Month'
//             },
//             // startOnTick: true,
//             // showLastLabel: true
//             startOnTick: false,
//             endOnTick: false,
//             tickPixelInterval: 30
//         },
//         legend: {
//             enabled: false
//         },
//         tooltip: {
//             useHTML: true,
//             headerFormat: '<thead><tr>',
//             pointFormatter: function () {
//                 return '<th> <center><strong>' + convertNumberToMonth(this.y) + ' ' + this.x +
//                 '</strong></center> </th> <th> <span style="color:' + this.series.color + '"> ● </span>' +
//                 this.z + ' Steps </th>';
//             },
//             footFormat: '</tr></thead>'
//         },
//         plotOptions: {
//             bubble:{
//                 minSize: '1',
//                 maxSize: '11'
//             }
//         },
//         series: [{
//             type: 'bubble',
//             name: 'Steps Per Day',
//             // color: 'rgba(223, 83, 83, .5)',
//             data: function() {
//                      var dataArr =[];
//                      //Date.UTC(1970, 9, 21)
//                      for (var i = 0; i < data.Health[data.Health.length - 1].totalStepsForEachDayOfYear.length; i++) {
//                          var test = data.Health[data.Health.length - 1].totalStepsForEachDayOfYear[i];
//                         //
//                          var HoldTest = test.split(":");
//                          var res = HoldTest[0].slice(0,4);
//
//                         //  console.log(res);
//                         var month = HoldTest[0].split(" ");
//                         var monthNum = month[1].slice(0,month[1].length - 1);
//                         // console.log(monthNum);
//                         //  console.log(HoldTest);
//                         //  var dateandYr = HoldTest[0].slice(4,HoldTest[0].length);
//                         //  console.log(res);
//                         var Hold0 = Number(HoldTest[1]);
//                         var Hold1 = convertMonthNameToNumber(res);
//                         // var Hold1 = Date.parse(convertMonthNameToNumber(res)+ ' ' + dateandYr);
//                         // console.log(Hold0);
//
//                          HoldTest[0] = Number(monthNum);//DAYS
//                          HoldTest[1] = Hold1;//MONTH
//                          HoldTest[2] = Hold0;//STEPS
//                          dataArr.push(HoldTest);
//                      }
//                     //   console.log(dataArr[1]);
//                       return dataArr;
//             }()
//         }],
//         credits: {
//           enabled: false
//         }
//     });
//     console.log(data.Health);
// });





$('#line').on('click', function () {
    if ($('#testingchart').css('display') == 'none'){
        $('#dailyWalkRun').slideUp( 300 ).delay( 800 ).fadeOut( 400 );
        $('#testingchart').delay( 300 ).fadeIn( 400 );
    }
});

$('#bubble').on('click', function () {
    if ($('#dailyWalkRun').css('display') == 'none'){

        $('#testingchart').slideUp( 300 ).delay( 800 ).fadeOut( 400 );
        $('#dailyWalkRun').delay( 300 ).fadeIn( 400 );
    }
});
