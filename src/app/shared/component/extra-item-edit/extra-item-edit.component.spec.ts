import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExtraItemEditComponent } from './extra-item-edit.component';

describe('ExtraItemEditComponent', () => {
  let component: ExtraItemEditComponent;
  let fixture: ComponentFixture<ExtraItemEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraItemEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
