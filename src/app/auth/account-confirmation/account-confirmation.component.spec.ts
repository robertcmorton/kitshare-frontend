import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountConfirmationComponent } from './account-confirmation.component';

describe('AccountConfirmationComponent', () => {
  let component: AccountConfirmationComponent;
  let fixture: ComponentFixture<AccountConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
