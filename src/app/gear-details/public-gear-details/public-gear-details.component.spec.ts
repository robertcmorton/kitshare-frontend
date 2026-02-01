import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublicGearDetailsComponent } from './public-gear-details.component';

describe('PublicGearDetailsComponent', () => {
  let component: PublicGearDetailsComponent;
  let fixture: ComponentFixture<PublicGearDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicGearDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicGearDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
