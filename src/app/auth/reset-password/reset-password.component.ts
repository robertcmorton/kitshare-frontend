import { ActivatedRoute } from "@angular/router";
import { HttpResonseTextWihStatus } from "../../shared/models/auth.model";
import { BaseService } from "../../services/base.service";
import { Component, OnInit } from "@angular/core";
import { ResetPasswordData } from "../../shared/models/auth.model";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  public password: ResetPasswordData = new ResetPasswordData();

  constructor(
    public base: BaseService,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    // super(base);
    this.base.global.showFooter = false;
    this.base.global.showHeader = false;
    this.route.params.subscribe((params) => {
      this.password.token = params.token ? params.token : "";
    });
  }

  ngOnInit() {}
  /**
   * This will call when users submit the form, and call api to register user
   *
   * @return voidis a
   */
  submitForm(): void {
    if (this.password.newpassword && this.password.confirmpassword) {
      this.base.global.showLoader();
      this.base.auth.resetPassword(this.password).subscribe(
        (response: any) => {
          this.base.global.hideLoader();
          var alertClass =
            response.status === 200 ? "snack-success" : "snack-error";
          this.dataService.openSnackBar(response.status_message, alertClass);
          if (response.status === 200) {
            this.base.router.navigate(["/login"]);
          }
        },
        (error) => {
          console.log("Error ==>", error);
          this.base.global.hideLoader();
          this.dataService.openSnackBar(
            "Error 002: Unable to reset your Password",
            "snack-error"
          );
        }
      );
    } else {
      this.dataService.openSnackBar(
        "Marked fields are mandatory",
        "snack-error"
      );
    }
  }
}
