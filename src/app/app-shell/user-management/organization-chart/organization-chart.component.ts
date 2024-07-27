import { Component, OnInit, ViewChild } from '@angular/core';
import { D3OrgChartComponent } from '../../framework-components/d3-org-chart/d3-org-chart.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { OrganizationChartService } from '../services/organization-chart.service';
declare var $: any;

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
})
export class OrganizationChartComponent implements OnInit {

  type: string;
  rootGuid: string;

  constructor(
    private readonly companyService: CompanyService,
    private readonly organizationChartService: OrganizationChartService,
    readonly route: ActivatedRoute) { }

  @ViewChild('d3OrgChart') d3OrgChart: D3OrgChartComponent;

  data = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.type = params.get('type');
      this.rootGuid = params.get('rootGuid');

      const searchModel = {
        rootGuid: this.rootGuid
      };

      if (this.type == 'holding') {
        this.companyService
          .getForChart(searchModel)
          .subscribe(nodes => {
            this.prepareDataToShowChart(nodes);
          });
      } else if (this.type == 'organization') {
        this.organizationChartService
          .getForChart(searchModel)
          .subscribe(nodes => {
            this.prepareDataToShowChart(nodes);
          });
      }
    });
  }

  private prepareDataToShowChart(nodes: any) {
    const data = [];
    nodes.forEach(item => {
      data.push({
        id: item.id,
        name: item.title,
        imageUrl: item.picture ? `data:image/jpg;base64,${item.picture}` : 'assets/images/blank1.png',
        parentId: item.parentId ? item.parentId : ''
      });
    });

    this.data = data;
  }
}
