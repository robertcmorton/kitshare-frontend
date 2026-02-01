import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RentalOrderRenterComponent } from './rental-order-renter.component';

describe('RentalOrderRenterComponent', () => {
  let component: RentalOrderRenterComponent;
  let fixture: ComponentFixture<RentalOrderRenterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalOrderRenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalOrderRenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
