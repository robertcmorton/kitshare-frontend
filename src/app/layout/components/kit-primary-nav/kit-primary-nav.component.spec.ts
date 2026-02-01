import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KitPrimaryNavComponent } from './kit-primary-nav.component';

describe('KitPrimaryNavComponent', () => {
  let component: KitPrimaryNavComponent;
  let fixture: ComponentFixture<KitPrimaryNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KitPrimaryNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitPrimaryNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
