import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RentalsDashboardComponent } from './rentals-dashboard.component';

describe('RentalsDashboardComponent', () => {
  let component: RentalsDashboardComponent;
  let fixture: ComponentFixture<RentalsDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
