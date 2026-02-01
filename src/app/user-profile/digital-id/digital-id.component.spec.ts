import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DigitalIdComponent } from './digital-id.component';

describe('DigitalIdComponent', () => {
  let component: DigitalIdComponent;
  let fixture: ComponentFixture<DigitalIdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
