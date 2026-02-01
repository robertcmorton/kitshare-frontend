import { Component, OnInit } from "@angular/core";

import * as _moment from "moment";

import { updateProfile, uplaodFiles } from "./../../shared/constant";
import { BaseComponent } from "../../base.componant";
import { BaseService } from "./../../services/base.service";
import { AuthService } from "./../../services/auth.service";
import { DashboardService } from "./../../services/dashboard.service";
import { userProfile, rentalType, professionType } from "../../shared/constant";
import {
  UserEditProfileData,
  RentalTypeOption,
  ProfessionTypeOption,
} from "../../shared/models/user-profile";
import { DataService } from "app/shared/data/data.service";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent extends BaseComponent implements OnInit {
  public max: Date = new Date();
  public imageUrl: any;
  public dob = new moment();
  public mentionOtherProfession: boolean = false;
  public rentalType: Array<RentalTypeOption>;
  public professionType: Array<ProfessionTypeOption>;
  public userProfileData: UserEditProfileData = new UserEditProfileData();
  public uploadedFiles: File;
  is_registered_for_gst: boolean = false;
  public is_other_proffession_selected: boolean = true;
  show_business_name: boolean;

  constructor(
    public baseService: BaseService,
    public dash: DashboardService,
    public auth: AuthService,
    private dataService: DataService
  ) {
    super(baseService, true);
    this.baseService.global.showLoader();
    this.baseService.baseApi.getProfile("edit");
    this.baseService.baseApi.getRentalType();
    this.baseService.baseApi.getProfessionType();
    this.is_other_proffession_selected = true;
    this.userProfileData.show_business_name = "N";
    this.show_business_name = false;
  }

  ngOnInit() {}
  handleApiResponse(data: any) {
    if (data.resulttype === uplaodFiles) {
      this.auth.setUserInfoProfile(data.result.result.image_url);
    }
    if (data.resulttype === userProfile) {
      this.userProfileData = data.result.result[0];
      this.userProfileData.app_business_name =
        data.result.result[0].bussiness_name;
      this.userProfileData.website_link = data.result.result[0].user_website;
      if (this.userProfileData.registered_for_gst == "Y") {
        this.is_registered_for_gst = true;
      } else {
        this.is_registered_for_gst = false;
      }

      if (this.userProfileData.profession_name == "Other") {
        this.mentionOtherProfession = true;
      }

      if (this.userProfileData.show_business_name != undefined) {
        if (this.userProfileData.show_business_name == "Y") {
          this.show_business_name = true;
        } else {
          this.show_business_name = false;
        }
      }
      this.imageUrl = this.userProfileData.user_profile_picture_link;
      this.dob = new moment(this.userProfileData.user_birth_date);
      this.baseService.global.hideLoader();
    }

    if (data.resulttype === rentalType) {
      this.rentalType = data.result.result;
    }

    if (data.resulttype === professionType) {
      this.professionType = data.result.result;
      // this.professionType.push({ profession_type_id: "-1", profession_name: "other" });
    }

    if (data.resulttype === updateProfile) {
      if (data.result.status === 200) {
        this.baseService.global.hideLoader();
        this.dataService.openSnackBar("Successfully updated!");
        this.userProfileData = data.result.result;
        if (this.userProfileData.registered_for_gst == "Y") {
          this.is_registered_for_gst = true;
        } else {
          this.is_registered_for_gst = false;
        }
        this.userProfileData.app_business_name =
          data.result.result.bussiness_name;
        this.userProfileData.website_link = data.result.result.user_website;
      } else {
        this.baseService.global.hideLoader();
        this.dataService.openSnackBar(
          data.result.status_message.status_message,
          "snack-error"
        );
      }
    }
  }

  updateProfile() {
    this.dash
      .checkDuplicateUserName(
        this.auth.userData.auth_token,
        this.userProfileData.app_username
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userProfileData.user_birth_date = this.dob.format("YYYY-MM-DD");
          if (
            this.show_business_name &&
            !this.userProfileData.app_business_name
          ) {
            this.dataService.openSnackBar(
              "Please provide business name",
              "snack-error"
            );
            return;
          }
          this.baseService.baseApi.updateProfile(this.userProfileData);

          if (this.uploadedFiles != undefined) {
            let uploadData = new FormData();
            uploadData.append(
              "image",
              this.uploadedFiles,
              this.uploadedFiles.name
            );
            uploadData.append("type", "profile");
            uploadData.append("token", this.auth.userData.auth_token);
            this.baseService.baseApi.uploadFiles(uploadData);
          }

          this.baseService.global.showLoader();
        } else {
          this.dataService.openSnackBar(
            "User name should be unique",
            "snack-error"
          );
        }
      });

    // console.log(this.userProfileData);

    /*this.userProfileData.user_birth_date = this.dob.format("YYYY-MM-DD");
    this.baseService.baseApi.updateProfile(this.userProfileData);

    if (this.uploadedFiles != undefined) {

      let uploadData = new FormData();
      uploadData.append("image", this.uploadedFiles, this.uploadedFiles.name);
      uploadData.append("type", "profile");
      uploadData.append("token", this.auth.userData.auth_token);
      this.baseService.baseApi.uploadFiles(uploadData);
    }

    this.baseService.global.showLoader();*/
  }
  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.userProfileData.user_profile_picture_link = reader.result;
        this.uploadedFiles = <File>event.target.files[0];
        this.imageUrl = reader.result;
      };
    }
  }
  chekProfession() {
    // tslint:disable-next-line:radix
    if (parseInt(this.userProfileData.profession_type_id) === 166) {
      this.mentionOtherProfession = true;
    } else {
      this.mentionOtherProfession = false;
      this.userProfileData.other_profession = "";
    }
  }

  registeredForGst(e) {
    if (e.target.checked == true) {
      this.userProfileData.registered_for_gst = "Y";
    } else {
      this.userProfileData.registered_for_gst = "N";
    }
  }

  showBusinessName(e) {
    if (e.target.checked == true) {
      this.userProfileData.show_business_name = "Y";
      this.show_business_name = true;
    } else {
      this.userProfileData.show_business_name = "N";
      this.show_business_name = false;
    }
  }

  selectOnChanged(e: any) {
    if (e[0].value == "166") {
      this.mentionOtherProfession = true;
    } else {
      this.mentionOtherProfession = false;
    }
  }

  onKeyUpCheckUnique(e: any) {
    this.dash
      .checkDuplicateUserName(this.auth.userData.auth_token, e.target.value)
      .subscribe((res: any) => {
        if (res.status == 406) {
          this.dataService.openSnackBar(res.status_message, "snack-error");
        }
      });
  }
}
