import { OnDestroy } from "@angular/core";
import { BaseService } from "./services/base.service";
import { ApiHandlerComponent } from "./api-handler.component";

/**
 * main component functionality
 */
export class BaseComponent extends ApiHandlerComponent implements OnDestroy {
  /**
   * manage dependency injection of services
   * @param baseService GlobalService
   * @param checkLogin Boolean
   */
  constructor(public baseService: BaseService, public checkLogin: Boolean) {
    super(baseService);
    if (checkLogin) {
      this.isLoggedIn();
    }
  }

  /**
   * will check if a user logged in or not. if not redirect to login page
   */
  isLoggedIn() {
    if (this.baseService.auth.checkLoggedIn() === true) {
      return true;
    } else {
      this.baseService.router.navigate(["/login"]);
      return false;
    }
  }
}
