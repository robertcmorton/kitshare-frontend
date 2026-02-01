import { TestBed } from '@angular/core/testing';

import { VerifyPopupDialogService } from './verify-popup-dialog.service';

describe('VerifyPopupDialogService', () => {
  let service: VerifyPopupDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyPopupDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
