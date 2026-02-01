import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrivateGearDetailsComponent } from './private-gear-details.component';

describe('PrivateGearDetailsComponent', () => {
  let component: PrivateGearDetailsComponent;
  let fixture: ComponentFixture<PrivateGearDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateGearDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateGearDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
