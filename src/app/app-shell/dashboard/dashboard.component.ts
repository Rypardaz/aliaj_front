import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../basic-info/reports/report.service';
import { BreadcrumbService } from '../framework-services/breadcrumb.service';
declare var ApexCharts: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  salonTypeGuid
  salons = []
  salon

  stopChartResult = []
  stopChart: any

  wireConsumptionChart: any
  machineActivityChart: any
  activeProjects = []
  productCategory = []

  constructor(
    private readonly reportService: ReportService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.breadcrumbService.setTitle('داشبورد')
    this.breadcrumbService.setClassificationLevel('عادی')

    this.salonTypeGuid = this.activatedRoute.snapshot.paramMap.get('type')

    if (!this.salonTypeGuid) return

    const searchModel = {
      type: 1,
      salonTypeGuid: this.salonTypeGuid
    }

    this.reportService
      .dashboard(searchModel)
      .subscribe((data: any) => {
        this.salons = data
      })
  }

  onSalonClicked(salon) {
    this.salon = salon

    this.getStopChart()
    this.getWireConsumptionChart()
    this.getMachineActivityChart()
    this.getActiveProjects()
    this.getProductCategory()
  }

  getStopChart(period = 3) {
    let searchModel = {
      type: 2,
      period,
      salonId: this.salon.id
    }

    this.reportService
      .dashboard(searchModel)
      .subscribe((data: any) => {
        this.stopChartResult = data

        if (this.stopChart)
          this.stopChart.destroy()

        const labels = []
        const series = []

        data.forEach(item => {
          labels.push(item.name)
          series.push(parseInt(item.value))
        })

        var colors = ["#39afd1", "#ffbc00", "#313a46", "#fa5c7c"]
        var dataColors = $("#stop-chart").data('colors')
        if (dataColors) {
          colors = dataColors.split(",")
        }
        const options = {
          chart: {
            height: 312,
            type: 'donut',
          },
          series: series,
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
          labels: labels,
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

        this.stopChart = new ApexCharts(
          document.querySelector("#stop-chart"),
          options
        )

        this.stopChart.render()
      })
  }

  getWireConsumptionChart(period = 1) {
    if (this.wireConsumptionChart)
      this.wireConsumptionChart.destroy()

    const searchModel = {
      type: 3,
      period,
      salonId: this.salon.id
    }

    this.reportService
      .dashboard(searchModel)
      .subscribe((data: any) => {
        const labels = []
        const serie1 = []
        const serie2 = []

        data.forEach(item => {
          labels.push(item.x)
          serie1.push(parseFloat(item.y1))
          serie2.push(parseFloat(item.y2))
        })

        var colors = ['#3bafda', '#1abc9c', "#f672a7"];
        var dataColors = $("#wire-consumption").data('colors');
        if (dataColors) {
          colors = dataColors.split(",");
        }
        const options = {
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
          series: [
            {
              name: 'Desktops',
              type: 'area',
              data: serie1
            },
            {
              name: 'Laptops',
              type: 'area',
              data: serie2
            }
          ],
          fill: {
            opacity: [0.25, 0.25],
            gradient: {
              inverseColors: false,
              shade: 'light',
              type: "vertical",
              opacityFrom: 0.85,
              opacityTo: 0.55,
              stops: [0, 100, 100, 100]
            }
          },
          labels: labels,
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
            title: {
              text: 'مصرف سیم'
            },
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

        this.wireConsumptionChart = new ApexCharts(
          document.querySelector("#wire-consumption"),
          options
        )

        this.wireConsumptionChart.render()
      })
  }

  getMachineActivityChart(period = 3) {
    if (this.machineActivityChart)
      this.machineActivityChart.destroy()

    const searchModel = {
      type: 4,
      period,
      salonId: this.salon.id
    }

    this.reportService
      .dashboard(searchModel)
      .subscribe((data: any) => {
        const labels = []
        const serie1 = []
        const serie2 = []
        const serie3 = []

        data.forEach(item => {
          labels.push(item.x)
          serie1.push(parseFloat(item.y1))
          serie2.push(parseFloat(item.y2))
          serie3.push(parseFloat(item.y3))
        })

        var colors = ["#727cf5", "#e3eaef", "#e3eabf"]
        var dataColors = $("#machine-activity").data('colors');
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
            name: 'جوشکاری',
            data: serie1
          },
          {
            name: 'توقف تولیدی',
            data: serie2
          },
          {
            name: 'توقف غیرتولیدی',
            data: serie3
          }
          ],
          zoom: {
            enabled: false
          },
          legend: {
            show: false
          },
          colors: colors,
          xaxis: {
            title: {
              text: 'نام دستگاه',
            },
            categories: labels,
            axisBorder: {
              show: false
            },
          },
          yaxis: {
            title: {
              text: 'زمان (h)'
            },
            labels: {
              formatter: function (val) {
                return val
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
                return val + " (h)"
              }
            },
          },
        }

        this.machineActivityChart = new ApexCharts(
          document.querySelector("#machine-activity"),
          options
        )

        this.machineActivityChart.render()
      })
  }

  getActiveProjects() {
    const searchModel = {
      type: 5,
      salonId: this.salon.id
    }

    this.reportService
      .dashboard(searchModel)
      .subscribe((data: any) => {
        this.activeProjects = data
      })
  }

  getProductCategory(period = 3) {
    const searchModel = {
      type: 6,
      period,
      salonId: this.salon.id
    }

    this.reportService
      .dashboard(searchModel)
      .subscribe((data: any) => {
        this.productCategory = data
      })
  }
}
