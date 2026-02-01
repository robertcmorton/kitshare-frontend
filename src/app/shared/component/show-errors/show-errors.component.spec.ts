import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowErrorsComponent } from './show-errors.component';

describe('ShowErrorsComponent', () => {
  let component: ShowErrorsComponent;
  let fixture: ComponentFixture<ShowErrorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
