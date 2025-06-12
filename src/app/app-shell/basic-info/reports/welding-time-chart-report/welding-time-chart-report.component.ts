import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { SalonService } from '../../salon/salon.service'
import { MachineService } from '../../machine/machine.service'
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service'
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component'
import { PersonnelService } from '../../personnel/personnel.service'
import { WireTypeService } from '../../wire-type/wire-type.service'
import { ChartService } from '../chart.service'
import { years, months, weeks, getCurrentYear } from 'src/app/app-shell/framework-components/constants'
import { ActivatedRoute } from '@angular/router'
import { ListItemService } from '../../list-item/list-item.service'
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service'
declare var ApexCharts: any
import * as _ from 'lodash'

@Component({
  selector: 'app-welding-time-chart-report',
  templateUrl: './welding-time-chart-report.component.html'
})
export class WeldingTimeChartReportComponent extends AgGridBaseComponent implements OnInit {

  title
  salons = []
  machines = []
  personnel = []
  wireTypes = []
  shifts = []
  years = years;
  weeks = weeks;
  months = months
  type

  chart
  records = []

  form: FormGroup

  constructor(private fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly salonService: SalonService,
    private readonly machineService: MachineService,
    private readonly personnelService: PersonnelService,
    private readonly wireTypeService: WireTypeService,
    private readonly breadCrumbService: BreadcrumbService,
    private readonly chartService: ChartService,
    private readonly notificationService: NotificationService,
    private readonly listItemService: ListItemService) {
    super(false)

    const year = getCurrentYear()

    this.form = fb.group({
      type: [],
      fromDate: [],
      toDate: [],
      weekIds: [[]],
      yearIds: [year],
      monthIds: [[]],
      wireTypeGuid: [],
      machineGuid: [],
      salonGuid: [],
      personnelGuid: [],
      shiftGuid: [],
      showShift: [false]
    })
  }

  override ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type')
    this.setFormValue(this.form, 'type', this.type)

    switch (this.type) {
      case '1':
        this.title = 'نمودار مصرف سیم / روزانه'
        break;
      case '2':
        this.title = 'نمودار مصرف سیم / هفتگی'
        break;
      case '3':
        this.title = 'نمودار مصرف سیم / ماهانه'
        break;
      case '10':
        this.title = 'نمودار مصرف سیم / گروه قطعه'
        break;
      case '7':
        this.title = 'نمودار مصرف سیم / پرسنل'
        break;
      case '5':
        this.title = 'نمودار زمان جوشکاری / ماشین آلات'
        break;
    }

    this.breadCrumbService.setTitle(this.title)

    this.getSalons()
    this.getMachines()
    this.getPersonnel()
    this.getWireTypes()
  }

  getSalons() {
    this.salonService
      .getForComboBySalonType(2)
      .subscribe(data => this.salons = data)
  }

  getMachines() {
    this.machineService
      .getList<[]>()
      .subscribe(data => this.machines = data)
  }

  getPersonnel() {
    this.personnelService
      .getList<[]>()
      .subscribe(data => this.personnel = data)
  }

  getWireTypes() {
    this.wireTypeService
      .getForCombo<[]>()
      .subscribe(data => this.wireTypes = data)
  }

  getShifts() {
    this.listItemService
      .getForCombo<[]>('10')
      .subscribe(data => this.shifts = data)
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

        var colors = ["#727cf5", "#D6863A"];
        var dataColors = $("#report").data('colors');
        if (dataColors) {
          colors = dataColors.split(",");
        }

        const series = []

        const categories = _(this.records).groupBy('title')
          .map((value, key) => ({ title: key, value: value }))
          .value()
          .map(x => x.title)

        if (searchModel.showShift) {
          const shift1 = []
          const shift2 = []

          this.records
            .filter(x => x.shiftTitle == 1)
            .forEach(item => {
              shift1.push(item.weldingTime)
            })

          this.records
            .filter(x => x.shiftTitle == 2)
            .forEach(item => {
              shift2.push(item.weldingTime)
            })

          series.push({
            name: 'شیفت روز',
            data: shift1
          })

          series.push({
            name: 'شیفت شب',
            data: shift2
          })
        } else {
          const data = []

          this.records.forEach(item => {
            data.push(item.weldingTime)
          })

          series.push({
            name: 'زمان جوشکاری (ساعت)',
            data: data
          })
        }

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
          // plotOptions: {
          //   bar: {
          //     horizontal: false,
          //     columnWidth: '25%'
          //   },
          // },
          dataLabels: {
            enabled: true
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          series: series,
          labels: ["شیفت روز", "شیفت شب"],
          zoom: {
            enabled: false
          },
          legend: {
            show: true
          },
          colors: colors,
          xaxis: {
            categories: categories,
            axisBorder: {
              show: false
            },
            labels: {
              show: true
            }
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