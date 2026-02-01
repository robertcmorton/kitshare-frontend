import { RESULT_ERROR } from "./shared/constant";
import { Component, OnDestroy } from "@angular/core";
import { BaseService } from "./services/base.service";
import { Subscription } from "rxjs";

/**
 * main component functionality
 */
@Component({
  template: "",
})
export class ApiHandlerComponent implements OnDestroy {
  private apiSubscription: Subscription;
  /**
   * manage dependency injcection of services
   * @param baseService GlobalService
   */
  constructor(public baseService: BaseService) {
    this.apiSubscription = this.baseService.baseApi.apiResults.subscribe(
      (data) => {
        if (data.resulttype === RESULT_ERROR) {
          if (data.result.status === 401 || data.result.status === 400) {
            console.log("Session expired ==>", data);
            this.baseService.auth.logout();
          } else {
            let errorMessage = data.result.status_message
              ? data.result.status_message
              : data.result.statusText;
            console.log(errorMessage);
          }
        }
        this.handleApiResponse(data);
      }
    );
  }

  /**
   * this will handel all api response, must be override on child component
   * @param data any
   */
  handleApiResponse(data: any) {}
  /**
   * unsubscribe api response subscriber on component destroy
   */
  ngOnDestroy() {
    this.apiSubscription.unsubscribe();
  }
}
