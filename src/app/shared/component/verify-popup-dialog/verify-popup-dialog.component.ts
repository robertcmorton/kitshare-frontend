import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'kit-verify-popup-dialog',
  templateUrl: './verify-popup-dialog.component.html',
  styleUrls: ['./verify-popup-dialog.component.scss']
})
export class VerifyPopupDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  @Input() address_found: boolean;
  @Input() mobile_number_verfiy: boolean;
  @Input() digital_id_found: boolean;

  constructor(private activeModal: NgbActiveModal,
    private router:Router) { }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  checkUserVerification(navigate:string) {
    this.router.navigate([navigate]);
    this.activeModal.close(true);
  }

}
