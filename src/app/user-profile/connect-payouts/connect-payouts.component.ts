import { Component, OnInit } from "@angular/core";
import { DataService } from "app/shared/data/data.service";
import { DashboardService } from "../../services/dashboard.service";
import { AuthService } from "./../../services/auth.service";

@Component({
  selector: "app-connect-payouts",
  templateUrl: "./connect-payouts.component.html",
  styleUrls: ["./connect-payouts.component.scss"],
})
export class ConnectPayoutsComponent implements OnInit {
  account_name: String;
  bsb_name: String;
  account_number: String;
  bank_name: any;
  bank_list: Array<object>;
  selected_bank_id: any;

  constructor(
    public dataService: DataService,
    public auth: AuthService,
    public dashboard: DashboardService
  ) {
    this.account_name = "";
    this.bsb_name = "";
    this.account_number = "";
    this.bank_name = "";
    this.bank_list = [];
    this.selected_bank_id = "";
  }

  ngOnInit() {
    this.getBankList();
    this.getBankDetails();
  }

  /**
   * Submit the form
   * @returns void
   */
  connectYourAccount() {
    if (this.account_name === "") {
      this.dataService.openSnackBar("Please type account name", "snack-error");
    } else if (this.bsb_name === "") {
      this.dataService.openSnackBar("Please type BSB number", "snack-error");
    } else if (this.bank_name == "" || this.bank_name == "0") {
      this.dataService.openSnackBar("Please select bank", "snack-error");
    } else if (this.account_number == "") {
      this.dataService.openSnackBar(
        "Please type account number",
        "snack-error"
      );
    } else {
      this.dashboard
        .connectPayout(
          this.auth.userData.auth_token,
          this.account_name,
          this.bsb_name,
          this.bank_name,
          this.account_number
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.account_name = "";
            this.bsb_name = "";
            this.bank_name = "";
            this.account_number = "";

            this.dataService.openSnackBar(res.status_message, "snack-success");

            this.getBankDetails();
          } else {
            this.dataService.openSnackBar(res.status_message, "snack-error");
          }
        });
    }
  }

  getBankList() {
    this.dashboard.getBankList().subscribe((res: any) => {
      this.bank_list = res.bank_list;
    });
  }

  getBankDetails() {
    this.dashboard
      .getBankDetails(this.auth.userData.auth_token)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.selected_bank_id = res.result.bank_id;
          this.account_name = res.result.user_account_name;
          this.bsb_name = res.result.bsb_number;
          this.account_number = res.result.user_account_number;
          this.bank_name = this.selected_bank_id;
        }
      });
  }
}
