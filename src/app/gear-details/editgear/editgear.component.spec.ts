import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditgearComponent } from './editgear.component';

describe('EditgearComponent', () => {
  let component: EditgearComponent;
  let fixture: ComponentFixture<EditgearComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditgearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditgearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
