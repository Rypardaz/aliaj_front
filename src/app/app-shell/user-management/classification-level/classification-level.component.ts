import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../framework-services/notification.service';
import * as _ from 'lodash';
import { FeatureService } from '../services/feature.service';
import { ClassificationLevelService } from '../services/classification-level.service';
import { ComboBase } from '../../framework-components/combo-base';
import { operationSuccessful } from '../../framework-components/app-messages';
declare var $: any

@Component({
  selector: 'app-classification-level',
  templateUrl: './classification-level.component.html',
})

export class ClassificationLevelComponent implements OnInit {

  records = [];
  classificationLevels: ComboBase[];

  constructor(
    private readonly featureService: FeatureService,
    private readonly notificationService: NotificationService,
    private readonly classificationLevelService: ClassificationLevelService) { }

  ngOnInit(): void {
    this.getClassifiedPages()
  }

  getClassificationLevels() {
    this.classificationLevelService
      .getForCombo<ComboBase[]>()
      .subscribe({
        next: data => this.classificationLevels = data,
      })
  }

  getClassifiedPages() {
    this.featureService
      .getForClassificationLevel()
      .subscribe({
        next: data => {
          this.records = data
          $('select').trigger('change')
        }, complete: () => this.getClassificationLevels()
      })
  }

  setClassificationLevel(guid) {
    const feature = this.records.find(x => x.guid == guid)
    const command = {
      guid: guid,
      classificationLevelGuid: feature.classificationLevelGuid
    }

    this.featureService
      .updateClassificationLevel(command)
      .subscribe(_ => this.notificationService.succeded(operationSuccessful))
  }
}