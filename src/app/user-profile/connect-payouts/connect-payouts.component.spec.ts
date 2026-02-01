import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConnectPayoutsComponent } from './connect-payouts.component';

describe('ConnectPayoutsComponent', () => {
  let component: ConnectPayoutsComponent;
  let fixture: ComponentFixture<ConnectPayoutsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectPayoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectPayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
