import { Injectable } from '@angular/core';
import * as Chartist from 'chartist';
import * as Papa from 'papaparse/papaparse.min.js';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
declare var $: any;
@Injectable()
export class CsvParserService {
  colors = ['info', 'success', 'warning', 'danger'];
  updtMessages = ['Table updated successfully',
   'You have successfully undone your changes: <b>Server data restored</b>',
   'Please upload a file with <b>.csv extension</b>'];
  config;
  parseDataObj;
  dataVert;
  dataHor;
  sortingarray;
  constructor() { }
  parse(file: any, barChartVert, barChartHor) {
    Papa.parse(file, {
      delimiter: '',	// auto-detect
      newline: '',	// auto-detect
      quoteChar: '"',
      header: true,
      complete: (results) => {
        const dataset = results.data;
        console.log('dataset');
        console.log(dataset);
        // this.mapValues(dataset, barChartVert, barChartHor);
        // this.findTopTen(dataset, barChartVert, barChartHor);
        this.checkDuplicateInObject('Label', dataset, barChartVert, barChartHor);
        // this.removeDuplicates('Label',dataset);
        //this.getLargestCustomer(dataset, barChartVert, barChartHor);
      },
      skipEmptyLines: true
    });
  }
  mapValues(dataset, barChartVert, barChartHor) {
    this.dataVert = {
      // set our labels (x-axis) to the Label values from the JSON data
      labels: dataset.map(function (id) {
        return id.Label;
      }),
      // set our values to Value value from the JSON data
      series: dataset.map(function (id) {
        return id.Value;
      })
    };
    console.log('dataVert');
    console.log(this.dataVert);
    barChartVert.update(this.dataVert);
    // this.dataHor = {
    //   labels: dataset.map(function (id) {
    //       return id.Label2;
    //   }),
    //   series: [dataset.map(function (id, val) {
    //       return id.Value2;
    //   })]
    // };
    // console.log(this.dataHor);
    // barChartHor.update(this.dataHor);
  }
  getLargestCustomer(dataset, barChartVert, barChartHor) {
    const testarray1 = dataset.filter((id) => {
      const now = new Date(id.InvDate);
      const refDate: Date = new Date('31-Jan-2018');
      return now < refDate;
    }).splice(0, 4);
    const testarray2 = dataset.filter((id) => {
      const now = new Date(id.InvDate);
      const refDate: Date = new Date('28-Feb-2018');
      return now < refDate;
    }).splice(0, 4);

    console.log(testarray1);
    this.dataVert = {
      // set our labels (x-axis) to the Label values from the JSON data
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      // set our values to Value value from the JSON data
      series: [testarray1.map(function (id) {
        return id.SaleAmount;
      })]
      // series2: [testarray2.map(function (id) {
      //   return id.SaleAmount;
      // })]
    };
    console.log(this.dataVert);
    //barChartVert.update(this.dataVert);
    new Chartist.Bar('#chartActivity', {
      labels: this.dataVert.labels,
      series: this.dataVert.series
    }, {
        // Default mobile configuration
        stackBars: true,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value.split(/\s+/).map(function (word) {
              return word[0];
            }).join('');
          }
        },
        axisY: {
          offset: 20
        }
      }, [
        // Options override for media > 400px
        ['screen and (min-width: 400px)', {
          reverseData: true,
          horizontalBars: true,
          axisX: {
            labelInterpolationFnc: Chartist.noop
          },
          axisY: {
            offset: 60
          }
        }],
        // Options override for media > 800px
        ['screen and (min-width: 800px)', {
          stackBars: false,
          seriesBarDistance: 10
        }],
        // Options override for media > 1000px
        ['screen and (min-width: 1000px)', {
          reverseData: false,
          horizontalBars: false,
          seriesBarDistance: 15
        }]
      ]);

  }

  findTopTen(dataset, barChartVert, barChartHor) {
    this.sortingarray = dataset.sort((name1, name2): number => {
      if (parseInt(name1.Value) < parseInt(name2.Value)) return 1;
      if (parseInt(name1.Value) > parseInt(name2.Value)) return -1;
      return 0;

    }).slice(0, 10);
    console.log('Sorted Array');
    console.log(this.sortingarray);
    this.mapValues(this.sortingarray, barChartVert, barChartHor);
  }
  checkDuplicateInObject(propertyName, dataset, barChartVert, barChartHor) {
    var seenDuplicate = false,
      temp1, temp2, temp3, index,
      testObject = {};

    dataset.map(function (item) {
      var itemPropertyName = item[propertyName];
      if (itemPropertyName in testObject) {
        temp1 = testObject[itemPropertyName].Value;
        index = dataset.indexOf(testObject[itemPropertyName]);
        dataset.splice(index, 1);
        temp2 = item.Value;
        temp3 = parseInt(temp1) + parseInt(temp2);
        item.Value = temp3.toString();
      }
      else {
        testObject[itemPropertyName] = item;
        delete item.duplicate;
      }
    });

    return this.findTopTen(dataset, barChartVert, barChartHor);
  }
  removeDuplicates(prop, dataset) {
    return dataset.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }
  showNotification(from, align, updtMessages, color, icon) {
    $.notify({
      icon: icon,
      message: updtMessages

    }, {
        type: color,
        timer: 400,
        placement: {
          from: from,
          align: align
        }
      });
  }
  undoUpdate(barChart, serverData): void {
    barChart.update(serverData);
}

}
