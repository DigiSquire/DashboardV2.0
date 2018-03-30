import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
declare var $: any;
export interface TopCustomer {
  name: string;
  salesAmt: string;
}
@Injectable()
export class CsvParserService {
  colors = ['info', 'success', 'warning', 'danger'];
  updtMessages = ['Table updated successfully',
   'You have successfully undone your changes: <b>Server data restored</b>',
   'Please upload a valid file with <b>.csv extension</b>'];
  dataVert;
  dataHor;
  sortingarray;
  versionCreatedFor = {};
  versiondata = [];
  dataNoDupe = [];
  bardata= [];
  piedata= [];
  // set data here from server. 1- On load in component call firebase to get data and
  // save to this variable and then assign on onit
  topCustomer: TopCustomer= {name: 'Jack', salesAmt: '7500'};
  serverTopCustomer: TopCustomer;
  constructor() {
    // keep server copy
    this.serverTopCustomer = Object.assign({}, this.topCustomer);
   }
  updateCharts(dataset, momChartVertical, barChartVert, pieChart) {
    const bardata = dataset.map(x => Object.assign({}, x));
    const piedata = dataset.map(x => Object.assign({}, x));
    const momdata = dataset.map(x => Object.assign({}, x));
    this.updateTopCustomerInMonth('Party', 'SaleAmount', bardata, barChartVert, 'bar');
    this.updatePieChart('MOP', 'SaleAmount', piedata, pieChart, 'pie');
    this.groupDataByMonth(momdata, momChartVertical);
  }
  groupDataByMonth(dataset, momChartVertical) {
    const groups = dataset.reduce(function (r, o) {
      const month = o.InvDate.split(('-'))[1];
      (r[month]) ? r[month].data.push(o) : r[month] = { group: String(month), data: [o] };
      return r;
    }, {});

    const result = Object.keys(groups).map(function (k) { return groups[k]; });

    console.log(result);
    this.monthOnMonth(result, 'Party', 'SaleAmount', momChartVertical, 'mom');
    // map results[0] to some input from template to update chart for different months
    // this.updateTopCustomerInMonth('Party', 'SaleAmount', result[0].data, barChartVert, 'bar');
  }
  updateTopCustomerInMonth(label, value, dataset, chartToUpdate, toUpdate) {
    this.checkDuplicateInObject(label, value, dataset, chartToUpdate, toUpdate);
  }
  updatePieChart(label, value, dataset, chartToUpdate, pie) {
    this.checkDuplicateInObject(label, value, dataset, chartToUpdate, pie);
  }
  mapValues(dataset, chartToUpdate, toUpdate) {
    if (toUpdate === 'pie') {
      const dataPie = {
        data: dataset.map(function (id) {
          return id.MOP;
        }),
        series: dataset.map(function (id) {
          return id.SaleAmount;
        })
      };
      const pieOptions = {
        labelInterpolationFnc: (value, id) => {
          return `${Math.round(value / dataPie.series.reduce(this.getSum) * 100)}% ${dataPie.data[id]}`;
        }
      };
      console.log('dataPie');
      console.log(dataPie);
      chartToUpdate.update(dataPie, pieOptions);
    } else {
      const dataVert = {
        // set our labels (x-axis) to the Label values from the JSON data
        labels: dataset.map(function (id) {
          return id.Party;
        }),
        // set our values to Value value from the JSON data
        series: dataset.map(function (id) {
          return id.SaleAmount;
      })
      };
      console.log('Vertical Bar chart Data');
      console.log(dataVert);
      this.topCustomer.name = dataVert.labels[0];
      console.log(this.topCustomer.name);
      this.topCustomer.salesAmt = dataVert.series[0];
      chartToUpdate.update(dataVert);
    }
  }
  getLargestCustomer(dataset, barChartVert, barChartHor) {
    const momArray = dataset.filter((id) => {
      const now = new Date(id.InvDate);
      const refDate: Date = new Date('31-Jan-2018');
      return now < refDate;
    }).splice(0, 4);
    const testarray2 = dataset.filter((id) => {
      const now = new Date(id.InvDate);
      const refDate: Date = new Date('28-Feb-2018');
      return now < refDate;
    }).splice(0, 4);

    console.log(momArray);
    // this.dataVert = {
    //   labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    //   series: [testarray1.map(function (id) {
    //     return id.SaleAmount;
    //   })]
    //   series2: [testarray2.map(function (id) {
    //     return id.SaleAmount;
    //   })]
    // };
  }

  findTopTen(dataset, chartToUpdate, toUpdate) {
    this.sortingarray = dataset.sort((name1, name2) => (parseInt(name1.SaleAmount) < parseInt(name2.SaleAmount) ? 1 :
     parseInt(name1.SaleAmount) > parseInt(name2.SaleAmount) ? -1 : 0)
    );
    console.log('Sorted Array');
    console.log(this.sortingarray);
    if (toUpdate === 'mom') {
      return this.sortingarray;
    } else if (toUpdate === 'bar') {
      this.mapValues(this.sortingarray.slice(0, 6), chartToUpdate, toUpdate);
    }else {
      this.mapValues(this.sortingarray, chartToUpdate, toUpdate);
    }
  }
  monthOnMonth(result, label, value, chartToUpdate, toUpdate) {
    const monthGroup = result.map(x => Object.assign({}, x));
    let A1 = []; let A2 = []; let parent = [];
    for (let i = 0; i < monthGroup.length; i++) {
      monthGroup[i].data = this.checkDuplicateInObject(label, value, monthGroup[i].data, chartToUpdate, toUpdate);
      A1.push(monthGroup[i].data[0].SaleAmount); A2.push(monthGroup[i].data[1].SaleAmount);
     }
    parent.push(A1); parent.push(A2);
    console.log('parent array');
    console.log(parent);
    console.log('structure');
    console.log(monthGroup);
    this.dataHor = {
      labels: monthGroup.map(function (id) {
        return id.group;
      }),
      series: parent
    };
    chartToUpdate.update(this.dataHor);
  }
  checkDuplicateInObject(label, value, dataset, chartToUpdate, toUpdate) {
    this.dataNoDupe = []; this.versionCreatedFor = {};
    for (let i = 0; i < dataset.length; i++) {
      const searchFor = dataset[i][label];
      for (let j = 0; j < dataset.length; j++) {
        const compareWith = dataset[j][label];
        if (searchFor === compareWith) {
          if (this.versionCreatedFor[searchFor] === undefined) {
            this.versiondata.push(parseInt(dataset[j][value]));
          }
        }
      }
      this.versionCreatedFor[searchFor] = 1;
      // have duplicates, so add them together, the last value in array is the sum result
      if (this.versiondata.length > 1) {
        this.versiondata.push(this.versiondata.reduce(this.getSum));
        dataset[i].SaleAmount = this.versiondata[(this.versiondata.length - 1)];
        this.dataNoDupe.push(dataset[i]);
      }
      // no duplicates and duplicate check was done
      if (this.versiondata.length === 1 && this.versionCreatedFor[searchFor] === 1) {
        this.dataNoDupe.push(dataset[i]);
      }
      this.versiondata = [];

    }
    console.log('No duplicate');
    console.log(this.dataNoDupe);
    return this.findTopTen(this.dataNoDupe, chartToUpdate, toUpdate);
  }
  getSum(total, num) {
  return total + num;
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

}
