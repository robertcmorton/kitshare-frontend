import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KitHeaderComponent } from './kit-header.component';

describe('KitHeaderComponent', () => {
  let component: KitHeaderComponent;
  let fixture: ComponentFixture<KitHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KitHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
