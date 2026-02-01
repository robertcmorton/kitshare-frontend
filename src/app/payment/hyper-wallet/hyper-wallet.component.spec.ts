import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HyperWalletComponent } from './hyper-wallet.component';

describe('HyperWalletComponent', () => {
  let component: HyperWalletComponent;
  let fixture: ComponentFixture<HyperWalletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HyperWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
