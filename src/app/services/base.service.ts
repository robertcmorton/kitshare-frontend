import { BaseApiService } from "./base-api.service";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { GlobalService } from "./global.service";
import { Injectable } from "@angular/core";

@Injectable()
export class BaseService {
  /**
   * manage dependency injection
   * @param global
   * @param flash
   * @param auth
   * @param router
   * @param baseApi
   */
  constructor(
    public global: GlobalService,
    public auth: AuthService,
    public router: Router,
    public baseApi: BaseApiService
  ) {}

  /**
   * show error message
   * @param message
   */
  // showError(message = "Error 008: Something went wrong!") {
  //   this.flash.show(message, {
  //     cssClass: "snack-error",
  //     timeout: 3000
  //   });
  // }

  /**
   * show alert message, by default success message
   * @param message
   * @param alertClass
   */
  // showMessage(message = "Error 009: Something went wrong!", alertClass = "snack-success") {
  //   this.flash.show(message, {
  //     cssClass: alertClass,
  //     timeout: 3000
  //   });
  // }
}
