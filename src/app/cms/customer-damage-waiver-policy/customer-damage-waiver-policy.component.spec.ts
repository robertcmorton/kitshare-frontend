import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerDamageWaiverPolicyComponent } from './customer-damage-waiver-policy.component';

describe('CustomerDamageWaiverPolicyComponent', () => {
  let component: CustomerDamageWaiverPolicyComponent;
  let fixture: ComponentFixture<CustomerDamageWaiverPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDamageWaiverPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDamageWaiverPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
