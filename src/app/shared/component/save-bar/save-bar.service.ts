import { Injectable, Input } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable()
export class SaveBarService {

  private TRIGGER_BAR =  new ReplaySubject(null);
  TRIGGER_BAR_ACTION$ = this.TRIGGER_BAR.asObservable();

  private SAVEBAR_RESULT_SUBJECT = new ReplaySubject(null);
  public SAVEBAR_RESULT_ACTION$ = this.SAVEBAR_RESULT_SUBJECT.asObservable();

  currentData:any;

  constructor() { }

  triggerBar(config){
    this.currentData = config.data;
    this.TRIGGER_BAR.next(config);
  }

  onSaveBarAction(config) {
    let payload =  {
      action: config.action,
      data: this.currentData
    };
    this.SAVEBAR_RESULT_SUBJECT.next(payload);
  }





}
