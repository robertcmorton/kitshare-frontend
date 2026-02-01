import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiRouterService } from "./api-router.service";

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient, public apiRoute: ApiRouterService) {}

  getClientToken() {
    let url = this.apiRoute.getClientToken;
    return this.http.get(url);
  }

  completePayment(token, payment_method_nonce, amount) {
    let url = this.apiRoute.completePayment;
    let data = {
      token: token,
      payment_method_nonce: payment_method_nonce,
      amount: amount,
    };
    return this.http.post(url, data);
  }

  depositePayment(token, payment_method_nonce, amount, order_id) {
    let url = this.apiRoute.depositePayment;
    let data = {
      token: token,
      payment_method_nonce: payment_method_nonce,
      amount: amount,
      order_id: order_id,
    };
    return this.http.post(url, data);
  }

  saveRecordToOrder(
    token,
    transaction_id,
    transaction_amount,
    user_gear_desc_id
  ) {
    let url = this.apiRoute.saveRecordToOrder;
    let data = {
      token: token,
      transaction_id: transaction_id,
      transaction_amount: transaction_amount,
      user_gear_desc_id: user_gear_desc_id,
    };
    return this.http.post(url, data);
  }

  saveInsuranceRecordToOrder(
    token,
    transaction_id,
    transaction_amount,
    user_gear_desc_id,
    order_id
  ) {
    let url = this.apiRoute.saveInsuranceRecordToOrder;
    let data = {
      token: token,
      transaction_id: transaction_id,
      transaction_amount: transaction_amount,
      user_gear_desc_id: user_gear_desc_id,
      order_id: order_id,
    };
    return this.http.post(url, data);
  }
}
