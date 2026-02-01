import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ReviewDashboardComponent } from "./review.component";

describe("ReviewDashboardComponent", () => {
  let component: ReviewDashboardComponent;
  let fixture: ComponentFixture<ReviewDashboardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReviewDashboardComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
