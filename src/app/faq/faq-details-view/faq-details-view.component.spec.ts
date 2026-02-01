import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FaqDetailsViewComponent } from './faq-details-view.component';

describe('FaqDetailsViewComponent', () => {
  let component: FaqDetailsViewComponent;
  let fixture: ComponentFixture<FaqDetailsViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
