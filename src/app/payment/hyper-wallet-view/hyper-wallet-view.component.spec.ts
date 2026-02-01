import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HyperWalletViewComponent } from './hyper-wallet-view.component';

describe('HyperWalletViewComponent', () => {
  let component: HyperWalletViewComponent;
  let fixture: ComponentFixture<HyperWalletViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HyperWalletViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperWalletViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
