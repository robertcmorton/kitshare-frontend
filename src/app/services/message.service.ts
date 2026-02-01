import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiRouterService } from "./api-router.service";
import { map } from "rxjs/operators";

@Injectable()
export class MessageService {
  constructor(public http: HttpClient, public apiRoute: ApiRouterService) {}

  getReplyMessage(ks_owner_id, receiver_email_id) {
    let url = this.apiRoute.getReplyMessage;
    let data = {
      ks_owner_id: ks_owner_id,
      receiver_email_id: receiver_email_id,
    };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  sendReplyMessage(ks_owner_mail_id, receiver_email_id, mail_text) {
    let url = this.apiRoute.replyMessage;
    let data = {
      ks_owner_id: ks_owner_mail_id,
      receiver_email_id: receiver_email_id,
      mail_text: mail_text,
    };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getUnreadMessages(token) {
    let url = this.apiRoute.unreadMessage;
    let data = { token: token };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
