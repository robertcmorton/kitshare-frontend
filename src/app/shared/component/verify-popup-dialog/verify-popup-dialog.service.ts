import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { VerifyPopupDialogComponent } from './verify-popup-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class VerifyPopupDialogService {

  constructor(private modalService: NgbModal) { }

  public popupbox(
    userinfo:any,
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(VerifyPopupDialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    if(userinfo.result[0].address_found === 'Y') {
      modalRef.componentInstance.address_found = true;
    }
    if(userinfo.result[0].mobile_number_verfiy === '1') {
      modalRef.componentInstance.mobile_number_verfiy = true;
    }
    if(userinfo.result[0].aus_post_verified === 'Y') {
      modalRef.componentInstance.digital_id_found = true;
    }
    return modalRef.result;
  }
}
