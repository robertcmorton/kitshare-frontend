import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "app/shared/data/data.service";
import { MessageService } from "../services/message.service";

@Component({
  selector: "app-reply-email",
  templateUrl: "./reply-email.component.html",
  styleUrls: ["./reply-email.component.scss"],
})
export class ReplyEmailComponent implements OnInit {
  ks_owner_id: any;
  sender_id: any;
  receiver_email_id: String;
  mail_text: String;
  reply_mail_text: String;
  is_message_sent: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public message: MessageService,
    public router: Router,
    public dataService: DataService
  ) {
    this.reply_mail_text = "";
    this.route.params.subscribe((param: any) => {
      this.ks_owner_id = param.ks_owner_id;
      this.sender_id = param.sender_id;
      this.receiver_email_id = param.mail_address;
    });
  }

  ngOnInit() {
    this.getTheMessage();
  }

  getTheMessage() {
    this.message
      .getReplyMessage(this.ks_owner_id, this.receiver_email_id)
      .subscribe((res: any) => {
        this.mail_text = res.result.mail_text;
      });
  }

  sendMessage() {
    this.is_message_sent = true;
    if (this.reply_mail_text != "") {
      this.message
        .sendReplyMessage(
          this.ks_owner_id,
          this.receiver_email_id,
          this.reply_mail_text
        )
        .subscribe(
          (res: any) => {
            this.is_message_sent = false;
            if (res.status !== 200) {
              let status_message = res.status_message;
              this.dataService.openSnackBar(status_message, "snack-error");
            } else {
              let status_message = res.status_message;
              this.dataService.openSnackBar(status_message, "snack-success");
              this.router.navigate(["/profile", { id: this.sender_id }]);
            }
          },
          (err) => {}
        );
    } else {
      this.dataService.openSnackBar("Please type your message", "snack-error");
    }
  }
}
