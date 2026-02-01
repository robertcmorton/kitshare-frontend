import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AppService {

  Resize: Subject<any> = new BehaviorSubject(null);
  onResize$ = this.Resize.asObservable();

  calOpen: Subject<any> = new BehaviorSubject({});
  calOpen$ = this.calOpen.asObservable();

  constructor() { }

  setCalStatus(status) {
    this.calOpen.next(status);
  }

  setScreenSize(size) {
    this.Resize.next(size);
  }

}
