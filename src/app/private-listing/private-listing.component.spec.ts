import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrivateListingComponent } from './private-listing.component';

describe('PrivateListingComponent', () => {
  let component: PrivateListingComponent;
  let fixture: ComponentFixture<PrivateListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
