import { ChartService } from '../chart.service'
import { ActivatedRoute } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivityService } from '../../activity/activity.service'
import { activitySubTypes, getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants'
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service'
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component'
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service'
declare var ApexCharts: any

@Component({
  selector: 'app-activity-chart-report',
  templateUrl: './activity-chart-report.component.html'
})
export class ActivityChartReportComponent extends AgGridBaseComponent implements OnInit {

  type
  title
  chart
  activities = []
  activitySubTypes = activitySubTypes
  records = []
  years = years
  months = months
  weeks = weeks;
  form: FormGroup

  constructor(fb: FormBuilder,
    private readonly breadCrumbService: BreadcrumbService,
    private readonly chartService: ChartService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly activityService: ActivityService,
    private readonly notificationService: NotificationService) {
    super(false)

    const month = getCurrentMonth()
    const year = getCurrentYear()

    this.form = fb.group({
      type: [],
      fromDate: [],
      toDate: [],
      weekId: [],
      yearIds: [year],
      monthId: [month],
      activityGuid: [],
      activitySubType: []
    })
  }

  override ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type')
    this.setFormValue(this.form, 'type', this.type)

    switch (this.type) {
      case '2':
        this.title = 'نمودار زمان فعالیت توقف'
        break;
      case '3':
        this.title = 'نمودار زمان فعالیت توقف'
        break;
      case '4':
        this.title = 'نمودار زمان فعالیت توقف'
        break;
    }

    this.breadCrumbService.setTitle(this.title)

    this.getReport()
    this.getActivities()
  }

  getActivities() {
    this.activityService
      .getForCombo()
      .subscribe((data: any) => this.activities = data)
  }

  getReport() {
    const searchModel = this.form.value

    if (!searchModel.yearIds) {
      this.notificationService.error('لطفا برای دریافت گزارش سال را انتخاب نمایید.')
      return
    }

    if (this.type == 1 && !searchModel.monthId) {
      this.notificationService.error('لطفا برای دریافت گزارش ماه را انتخاب نمایید.')
      return
    }

    this.chartService
      .getActivityChart(searchModel)
      .subscribe((result: any) => {
        this.records = result

        if (this.chart)
          this.chart.destroy();

        var colors = ["#000", "#000"];
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
            height: 500,
            type: 'bar',
            stacked: true,
            toolbar: {
              show: true
            }
          },
          title: {
            text: this.title,
            align: 'center',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: 'IRANSansX',
              color: '#000000'
            },
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
            name: 'زمان فعالیت/توقف',
            data: data
          }],
          zoom: {
            enabled: false
          },
          legend: {
            show: false
          },
          colors: colors,
          xaxis: {
            categories: categories,
            axisBorder: {
              show: false
            },
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return val + "(h)"
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
                return val + "(h)"
              }
            },
          },
        }

        this.chart = new ApexCharts(
          document.querySelector("#report"),
          options
        );

        this.chart.render();
      })
  }
}