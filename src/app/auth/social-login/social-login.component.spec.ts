import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SocialLoginComponent } from './social-login.component';

describe('SocialLoginComponent', () => {
  let component: SocialLoginComponent;
  let fixture: ComponentFixture<SocialLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
