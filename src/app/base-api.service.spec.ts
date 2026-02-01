import { TestBed, inject } from "@angular/core/testing";

import { BaseApiService } from "./services/base-api.service";

describe("BaseApiService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseApiService]
    });
  });

  it("should be created", inject(
    [BaseApiService],
    (service: BaseApiService) => {
      expect(service).toBeTruthy();
    }
  ));
});
