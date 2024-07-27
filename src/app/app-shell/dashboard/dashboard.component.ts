import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../user-management/services/user.service';
import { ModalConfig } from '../framework-components/modal/modal.config';
import { ModalComponent } from '../framework-components/modal/modal.component';
import { BreadcrumbService } from '../framework-services/breadcrumb.service';
declare var ApexCharts: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  sessions = []
  modalConfig = new ModalConfig()
  // @ViewChild('sessionModal') private sessionModalComponent: ModalComponent

  constructor(private readonly route: ActivatedRoute,
    private readonly uesrService: UserService,
    private readonly breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.breadcrumbService.setTitle('داشبورد')
    this.breadcrumbService.setClassificationLevel('عادی')

    var colors = ["#727cf5", "#e3eaef"];
    var dataColors = $("#revenue-report").data('colors');
    if (dataColors) {
      colors = dataColors.split(",");
    }

    var options: any = {
      chart: {
        height: 265,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      series: [{
        name: 'Actual',
        data: [65, 59, 80, 81, 56, 89, 40, 32, 65, 59, 80, 81]
      }, {
        name: 'Projection',
        data: [89, 40, 32, 65, 59, 80, 81, 56, 89, 40, 65, 59]
      }],
      zoom: {
        enabled: false
      },
      legend: {
        show: false
      },
      colors: colors,
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisBorder: {
          show: false
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val + "k"
          },
          offsetX: -15
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$" + val + "k"
          }
        },
      },
    }

    var chart = new ApexCharts(
      document.querySelector("#revenue-report"),
      options
    );

    chart.render();

    //
    // Products Sales Chart
    //
    var colors = ['#3bafda', '#1abc9c', "#f672a7"];
    var dataColors = $("#products-sales").data('colors');
    if (dataColors) {
      colors = dataColors.split(",");
    }
    options = {
      chart: {
        height: 265,
        type: 'line',
        padding: {
          right: 0,
          left: 0
        },
        stacked: false,
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: [1, 2],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      colors: colors,
      series: [{
        name: 'Desktops',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
      }, {
        name: 'Laptops',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
      }],
      fill: {
        opacity: [0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: ['01/01/2020', '02/01/2020', '03/01/2020', '04/01/2020', '05/01/2020', '06/01/2020', '07/01/2020', '08/01/2020', '09/01/2020', '10/01/2020', '11/01/2020'],
      markers: {
        size: 0
      },
      legend: {
        offsetY: 5,
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val + "k"
          },
          offsetX: -10
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " Dollars";
            }
            return y;

          }
        }
      },
      grid: {
        borderColor: '#f1f3fa',
        padding: {
          bottom: 10
        }
      }
    }

    var chart = new ApexCharts(
      document.querySelector("#products-sales"),
      options
    );

    chart.render();

    var colors = ["#727cf5", "#02a8b5", "#fd7e14"];
    var dataColors = $("#marketing-reports").data('colors');
    if (dataColors) {
      colors = dataColors.split(",");
    }
    options = {
      chart: {
        height: 274,
        type: 'radar',
        toolbar: {
          show: false
        }
      },
      series: [{
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      }, {
        name: 'Series 2',
        data: [20, 30, 40, 80, 20, 80],
      }, {
        name: 'Series 3',
        data: [44, 76, 78, 13, 43, 10],
      }],
      stroke: {
        width: 0
      },
      fill: {
        opacity: 0.4
      },
      markers: {
        size: 0
      },
      legend: {
        show: false
      },
      colors: colors,
      labels: ['2011', '2012', '2013', '2014', '2015', '2016']
    }

    var chart = new ApexCharts(
      document.querySelector("#marketing-reports"),
      options
    );

    chart.render();


    //
    // Projections Vs Actuals Charts
    //
    var colors = ["#39afd1", "#ffbc00", "#313a46", "#fa5c7c"];
    var dataColors = $("#projections-actuals").data('colors');
    if (dataColors) {
      colors = dataColors.split(",");
    }
    options = {
      chart: {
        height: 312,
        type: 'donut',
      },
      series: [44, 55, 41, 17],
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: 7
      },
      labels: ["Direct", "Affilliate", "Sponsored", "E-mail"],
      colors: colors,
      responsive: [{
        breakpoint: 600,
        options: {
          chart: {
            height: 240
          },
          legend: {
            show: false
          },
        }
      }]
    }

    var chart = new ApexCharts(
      document.querySelector("#projections-actuals"),
      options
    );

    chart.render();
  }

  getSessions() {
    // this.uesrService
    //   .getCurrentUserLastSessions()
    //   .subscribe(data => {
    //     this.sessions = data
    //     this.modalConfig.modalTitle = 'تلاش های اخیر برای ورود به سیستم'
    //     this.modalConfig.hideFooter = true

    //     if (this.sessions.length)
    //       this.sessionModalComponent.open()
    //   })
  }
}
