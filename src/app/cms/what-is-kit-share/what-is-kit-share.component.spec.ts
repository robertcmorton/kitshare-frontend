import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WhatIsKitShareComponent } from './what-is-kit-share.component';

describe('WhatIsKitShareComponent', () => {
  let component: WhatIsKitShareComponent;
  let fixture: ComponentFixture<WhatIsKitShareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatIsKitShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatIsKitShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
