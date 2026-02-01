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

        if (this.wireConsumptionChart)
          this.wireConsumptionChart.destroy()

        data.forEach(item => {
          labels.push(item.x)
          serie1.push(parseFloat(item.y1))
          serie2.push(parseFloat(item.y2))
        })

        var colors = ['#3bafda', '#1abc9c', "#f672a7"];
        var dataColors = $("#wire-consumption123").data('colors');
        if (dataColors) {
          colors = dataColors.split(",");
        }

        var xtitle = ""
        switch (period) {
          case 1:
            xtitle = "هقته"
            break;
          case 2:
            xtitle = "ماه"
            break;
          case 3:
            xtitle = "سال"
            break;

          default:
            xtitle = "سال"
        }


        const options: any = {
          chart: {
            height: 265,
            type: 'area',
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
            name: 'مصرف واقعی',
            type: 'bar',
            data: serie1
          },
          {
            name: 'مصرف استاندارد',
            type: 'area',
            data: serie2
          },
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
              text: xtitle,
            },
            categories: labels,
            axisBorder: {
              show: false
            },
          },
          yaxis: {
            title: {
              text: 'مقدار (Kg)'
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
                return val + " (Kg)"
              }
            },
          },
        }

        this.wireConsumptionChart = new ApexCharts(
          document.querySelector("#wire-consumption123"),
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

        const options: any = {
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
