import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyFavaouriteComponent } from './my-favaourite.component';

describe('MyFavaouriteComponent', () => {
  let component: MyFavaouriteComponent;
  let fixture: ComponentFixture<MyFavaouriteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFavaouriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFavaouriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
