import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReplyEmailComponent } from './reply-email.component';

describe('ReplyEmailComponent', () => {
  let component: ReplyEmailComponent;
  let fixture: ComponentFixture<ReplyEmailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
