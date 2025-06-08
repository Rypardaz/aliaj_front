import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service'
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component'
import { ChartService } from '../chart.service'
declare var ApexCharts: any

@Component({
  selector: 'app-project-chart-report',
  templateUrl: './project-chart-report.component.html'
})
export class ProjectChartReportComponent extends AgGridBaseComponent implements OnInit {

  chart
  records = []

  form: FormGroup

  constructor(fb: FormBuilder,
    private readonly breadCrumbService: BreadcrumbService,
    private readonly chartService: ChartService) {
    super(false)

    this.form = fb.group({
      type: [],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.breadCrumbService.setTitle('نمودار عملکرد پروژه')

    this.getReport()
  }

  getReport() {
    const searchModel = this.form.value

    this.chartService
      .getProjectChart(searchModel)
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
        const categories = []

        this.records.forEach(item => {
          categories.push(item.x)
          data.push(item.y)
        })

        var options: any = {
          chart: {
            title: 'عملکرد پروژه های فعال',
            height: 265,
            type: 'bar',
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
              data: data
            }
          ],
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
            intersect: false
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