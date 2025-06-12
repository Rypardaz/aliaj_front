import { Component, OnInit } from '@angular/core'
import { ReportService } from '../report.service'
import { FormBuilder, FormGroup } from '@angular/forms'
import { SalonService } from '../../salon/salon.service'
import { MachineService } from '../../machine/machine.service'
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service'
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component'
import { PersonnelService } from '../../personnel/personnel.service'
import { WireTypeService } from '../../wire-type/wire-type.service'
import { ChartService } from '../chart.service'
import { getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants'
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service'
import { ActivatedRoute } from '@angular/router'
declare var ApexCharts: any

@Component({
  selector: 'app-randeman-chart-report',
  templateUrl: './randeman-chart-report.component.html'
})
export class RandemanChartReportComponent extends AgGridBaseComponent implements OnInit {

  type
  title
  salons = []
  machines = []
  personnel = []
  wireTypes = []
  months = months
  years = years
  weeks = weeks;

  chart
  records = []


  form: FormGroup

  constructor(fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly breadCrumbService: BreadcrumbService,
    private readonly chartService: ChartService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute) {
    super(false)

    const year = getCurrentYear()

    this.form = fb.group({
      type: [],
      fromDate: [],
      toDate: [],
      monthId: [],
      weekId: [],
      yearIds: [year],
      salonGuid: [],
    })
  }

  override ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type')
    this.setFormValue(this.form, 'type', this.type)

    switch (this.type) {
      case '2':
        this.title = 'نمودار راندمان مصرف سیم هفتگی'
        break;
      case '3':
        this.title = 'نمودار راندمان مصرف سیم ماهانه'
        break;
    }

    this.breadCrumbService.setTitle(this.title)

    //this.getReport()
    this.getSalons()
  }

  getSalons() {
    this.salonService
      .getForComboBySalonType(2)
      .subscribe(data => this.salons = data)
  }

  getReport() {
    const searchModel = this.form.value

    if (!searchModel.salonGuid) {
      this.notificationService.error('لطفا برای دریافت گزارش سالن را انتخاب نمایید.')
      return
    }

    if (!searchModel.yearIds) {
      this.notificationService.error('لطفا برای دریافت گزارش سال را انتخاب نمایید.')
      return
    }

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
        const categories = []

        this.records.forEach(item => {
          categories.push(item.title)
          data.push(item.randeman)
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
            name: 'مصرف سیم',
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
            title: {
              text: "ماه",
              rotate: -90,
              offsetX: 0,
              offsetY: 0,
              style: {
                color: undefined,
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600
              }
            },
            categories: categories,
            axisBorder: {
              show: false
            },
          },
          yaxis: {
            title: {
              text: 'درصد راندمان',
              rotate: -90,
              offsetX: 0,
              offsetY: 0,
              style: {
                color: undefined,
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600
              }
            },
            labels: {
              formatter: function (val) {
                return val + "%"
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
                return val + "%"
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