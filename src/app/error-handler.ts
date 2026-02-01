import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class CustomErrorHandlerService extends ErrorHandler {
  constructor() {
    super();
  }

  handleError(error) {
    // Here you can provide whatever logging you want
    console.log(error);
    super.handleError(error);
  }
}
