import { ChartService } from '../chart.service'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { SalonService } from '../../salon/salon.service'
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service'
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component'
import { ActivatedRoute } from '@angular/router'
declare var ApexCharts: any

@Component({
  selector: 'app-wire-consumption-to-standaard-chart-report',
  templateUrl: './wire-consumption-to-standaard-chart-report.component.html'
})
export class WireConsumptionToStandardChartReportComponent extends AgGridBaseComponent implements OnInit {

  type
  title
  salons = []
  chart
  records = []
  form: FormGroup

  constructor(fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly breadCrumbService: BreadcrumbService,
    private readonly chartService: ChartService,
    private readonly activatedRoute: ActivatedRoute) {
    super(false)

    this.form = fb.group({
      type: [],
      fromDate: [],
      toDate: [],
      salonGuid: [],
    })
  }

  override ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type')
    this.setFormValue(this.form, 'type', this.type)

    switch (this.type) {
      case '2':
        this.title = 'نمودار مصرف واقعی / هفتگی'
        break;
      case '3':
        this.title = 'نمودار مصرف واقعی / ماهانه'
        break;
    }

    this.breadCrumbService.setTitle(this.title)

    this.getReport()
    this.getSalons()
  }

  getSalons() {
    this.salonService
      .getForComboBySalonType(2)
      .subscribe(data => this.salons = data)
  }

  getReport() {
    const searchModel = this.form.value

    this.chartService
      .getWireConsumptionChart(searchModel)
      .subscribe((result: any) => {
        this.records = result

        if (this.chart)
          this.chart.destroy();

        var colors = ["#727cf5", "#e3eaef"];
        var dataColors = $("#report").data('colors');
        if (dataColors) {
          colors = dataColors.split(",");
        }

        const data = []
        const standard = []
        const categories = []

        this.records.forEach(item => {
          categories.push(item.title)
          data.push(item.wireConsumption)
          standard.push(item.standardWireConsumption)
        })

        var options: any = {
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
          series: [
            {
              name: 'مصرف سیم',
              type: 'line',
              data: data
            },
            {
              name: 'استاندارد',
              type: 'area',
              data: standard
            },
          ],
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
          labels: categories,
          markers: {
            size: 0
          },
          legend: {
            offsetY: 5,
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return val + " (kg)"
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
                  return y.toFixed(0) + " (kg)";
                }
                return y
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

        this.chart = new ApexCharts(
          document.querySelector("#report"),
          options
        );

        this.chart.render();
      })
  }
}