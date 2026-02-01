import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExtraItemSuggestionBoxComponent } from './extra-item-suggestion-box.component';

describe('ExtraItemSuggestionBoxComponent', () => {
  let component: ExtraItemSuggestionBoxComponent;
  let fixture: ComponentFixture<ExtraItemSuggestionBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraItemSuggestionBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraItemSuggestionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
