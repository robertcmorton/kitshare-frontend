import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrustSafetyComponent } from './trust-safety.component';

describe('TrustSafetyComponent', () => {
  let component: TrustSafetyComponent;
  let fixture: ComponentFixture<TrustSafetyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustSafetyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
