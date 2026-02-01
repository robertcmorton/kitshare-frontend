import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RentalOrderOwnerComponent } from './rental-order-owner.component';

describe('RentalOrderOwnerComponent', () => {
  let component: RentalOrderOwnerComponent;
  let fixture: ComponentFixture<RentalOrderOwnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalOrderOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalOrderOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
