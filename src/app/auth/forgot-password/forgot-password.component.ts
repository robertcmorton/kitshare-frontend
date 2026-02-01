import { BaseService } from "../../services/base.service";
import { Component, OnInit } from "@angular/core";
import { GlobalService } from "app/services/global.service";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  public primary_email_address: string;
  constructor(
    public base: BaseService,
    public global: GlobalService,
    private dataService: DataService
  ) {
    // super(base);
    this.base.global.showFooter = false;
    this.base.global.showHeader = false;
  }

  ngOnInit() {}

  submitForm(): void {
    if (this.validateForm()) {
      this.global.showLoader();
      this.base.auth.forgotPassword(this.primary_email_address).subscribe(
        (response: any) => {
          this.global.hideLoader();
          var alertClass =
            response.status === 200 ? "snack-success" : "snack-error";
          this.dataService.openSnackBar(response.status_message, alertClass);
          if (response.status === 200) {
            this.base.router.navigate(["/login"]);
          }
        },
        (error) => {
          console.log("Error ==> ", error);
          this.dataService.openSnackBar(
            "Error 001: Unable to submit your Forgotten Password Request",
            "snack-error"
          );
        }
      );
    }
  }

  validateForm() {
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.primary_email_address
      )
    ) {
      this.dataService.openSnackBar("Invalid Email Address", "snack-error");
      return false;
    }
    return true;
  }
}
