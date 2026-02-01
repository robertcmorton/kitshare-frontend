import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../base.componant";
import { BaseService } from "./../../services/base.service";
import {
  getNotificationSettings,
  postNotificationSettings,
} from "../../shared/constant";
import { NotificationSettingsData } from "../../shared/models/notification.model";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
})
export class NotificationComponent extends BaseComponent implements OnInit {
  notificationData: NotificationSettingsData = new NotificationSettingsData();

  constructor(
    public baseService: BaseService,
    private dataService: DataService
  ) {
    super(baseService, true);
    this.baseService.global.showLoader();
  }

  ngOnInit() {
    this.baseService.baseApi.getNotificationSettings();
  }
  handleApiResponse(data: any) {
    if (data.resulttype === getNotificationSettings) {
      this.notificationData =
        this.baseService.global.getNotificationSettingsData(data.result.result);
    }
    if (data.resulttype === postNotificationSettings) {
      if (data.result.status_code === 200) {
        this.dataService.openSnackBar(data.result.status_message);
      }
    }
    this.baseService.global.hideLoader();
  }
  updateNotificationSettings() {
    const notiData = this.baseService.global.setNotificationSettingsData(
      this.notificationData
    );
    this.baseService.baseApi.postNotificationSettings(notiData);
    this.baseService.global.showLoader();
  }
}
