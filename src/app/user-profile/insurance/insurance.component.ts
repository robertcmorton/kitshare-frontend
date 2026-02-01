import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import { BaseComponent } from "../../base.componant";
import { BaseService } from "./../../services/base.service";
import { AuthService } from "./../../services/auth.service";
import {
  getInsuranceDetails,
  postInsuranceDetails,
} from "../../shared/constant";

import * as _moment from "moment";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserProfileService } from "../user-profile.service";
import { Insurance } from "../models/insurance.model";
import { AppService } from "../../app.service";
import { DataService } from "app/shared/data/data.service";
const moment = (_moment as any).default ? (_moment as any).default : _moment;
declare var $: any;

@Component({
  selector: "app-insurance",
  templateUrl: "./insurance.component.html",
  styleUrls: ["./insurance.component.scss"],
})
export class InsuranceComponent extends BaseComponent implements OnInit {
  public policy: File;
  public expiration_date = new moment();
  public insuranceDetails: any;

  public has_insurance_expired: boolean = false;
  public is_insurance_approved: boolean = false;
  public is_insurance_inactive: boolean = false;

  current_control: string;

  instruction_text = [
    "renting from an owner and save on the cost of a rental",
    "renting to a renter and earn an additional fee to recoup the policy cost",
  ];

  insurance_form: FormGroup;
  show_insurance_cerificate: boolean = false;

  imageToBeUploaded: any;
  available_insurance: Array<Insurance> = [];

  insurance_payload = {};
  current_ins_id: any;
  add_policy_disable: boolean;

  constructor(
    public baseService: BaseService,
    public auth: AuthService,
    private fb: FormBuilder,
    private userProfile: UserProfileService,
    private cdRef: ChangeDetectorRef,
    private AppService: AppService,
    public dataService: DataService
  ) {
    super(baseService, true);
    this.insuranceDetails = {
      expire_date: "",
      insurance_description: "",
      image_url: "",
    };
    this.baseService.global.showLoader();
    this.baseService.baseApi.getInsuranceDetails();
    this.add_policy_disable = false;
  }

  initForm() {
    this.insurance_form = this.fb.group({
      insurance_description: ["", Validators.required],
      expire_date: ["", Validators.required],
      start_date: ["", Validators.required],
      renter_insurance_provided: [false],
      renter_insurance_amount: [],

      owner_insurance_provided: [false],
      owner_insurance_amount: [],
      owner_insurance_percentage: [0],
      snapshot: [""],
      insurance_image_url: [""],
      // image_url: ['https://e0.365dm.com/19/09/768x432/skysports-lionel-messi-barcelona_4767416.jpg?20190906225656']
    });

    this.insurance_form.get("snapshot").valueChanges.subscribe((val) => {
      this.imageToBeUploaded = val;
      this.insurance_payload["image"] = this.imageToBeUploaded;
      //this.onImageUpload(this.imageToBeUploaded);
    });
  }

  ngOnInit() {
    this.fetchInsurance();
    this.initForm();
    this.observeStreams();
    this.observeControlChanges();
  }

  fetchInsurance() {
    this.userProfile.fetchInsuranceList().subscribe((res: any) => {
      if (res.result && res.result.length) {
        this.available_insurance = [];
        res.result.map((res: any) => {
          let insurance = new Insurance(
            res.is_active,
            res.user_insurance_proof_id,
            res.ks_user_certificate_currency_desc,
            res.ks_user_certificate_currency_start,
            res.ks_user_certificate_currency_exp,
            {
              amount: res.renter_insurance_amount,
              status: res.renter_insurance_status,
            },
            {
              amount: res.owner_insurance_amount,
              status: res.owner_insurance_status,
            },
            res.image_url
          );
          this.available_insurance.push(insurance);
        });
      } else {
        this.available_insurance = [];
      }
    });
  }

  observeControlChanges() {
    // renter insurance
    this.insurance_form.controls[
      "renter_insurance_provided"
    ].valueChanges.subscribe((status) => {
      if (status) {
        this.insurance_form.controls["renter_insurance_amount"].setValidators(
          Validators.required
        );
        this.insurance_form.controls[
          "renter_insurance_amount"
        ].updateValueAndValidity();
      } else {
        this.insurance_form.controls[
          "renter_insurance_amount"
        ].clearValidators();
        this.insurance_form.controls[
          "renter_insurance_amount"
        ].updateValueAndValidity();
      }
    });

    this.insurance_form.controls[
      "owner_insurance_provided"
    ].valueChanges.subscribe((status) => {
      if (status) {
        this.insurance_form.controls["owner_insurance_amount"].setValidators(
          Validators.required
        );
        this.insurance_form.controls[
          "owner_insurance_amount"
        ].updateValueAndValidity();
      } else {
        this.insurance_form.controls[
          "owner_insurance_amount"
        ].clearValidators();
        this.insurance_form.controls[
          "owner_insurance_amount"
        ].updateValueAndValidity();
      }
    });
  }
  observeStreams() {
    this.AppService.calOpen$.subscribe((res) => {
      if (res.status === false) {
        this.insurance_form.get(res.initiator).markAsTouched();
      }
    });

    this.userProfile.inactiveInsuranceAction$.subscribe((res) => {
      let payload = {};
      payload["user_insurance_proof_id"] = res.insurance_id;
      this.changeActiveInsurance(payload);
    });
  }

  changeActiveInsurance(payload) {
    this.userProfile.changeActiveInsurance(payload).subscribe((res) => {});
  }

  handleApiResponse(data: any) {
    if (data.resulttype === getInsuranceDetails) {
      this.insuranceDetails = {
        expire_date: "",
        insurance_description: "",
        image_url: "",
      };

      if (data.result.result) {
        this.insuranceDetails.insurance_description =
          data.result.result.ks_user_certificate_currency_desc;
        this.insuranceDetails.image_url = data.result.result.image_url;
        this.expiration_date = new moment(
          data.result.result.ks_user_certificate_currency_exp
        );

        // get Todays date
        let todays_date = new Date();
        let expiry_date_formated = new Date(
          data.result.result.ks_user_certificate_currency_exp
        );

        if (
          todays_date > expiry_date_formated &&
          data.result.result.is_approved == "1"
        ) {
          this.has_insurance_expired = true;
        } else {
          this.has_insurance_expired = false;
        }

        if (
          data.result.result.is_approved == "1" &&
          !this.has_insurance_expired &&
          data.result.result.is_active == "Y"
        ) {
          this.is_insurance_approved = true;
        } else {
          this.is_insurance_approved = false;
        }

        if ((data.result.result.is_active = "Y")) {
          this.is_insurance_inactive = false;
        } else {
          this.is_insurance_inactive = true;
        }
      }
    }
    if (data.resulttype === postInsuranceDetails) {
      this.dataService.openSnackBar("successfully updated!");
    }
    this.baseService.global.hideLoader();
  }
  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.policy = <File>event.target.files[0];
    }
  }
  updatePolicy() {
    this.insuranceDetails.expire_date =
      this.expiration_date.format("YYYY-MM-DD");
    this.baseService.global.showLoader();
    this.baseService.baseApi.postInsuranceDetails(this.insuranceDetails);
    if (this.policy) {
      let uploadData = new FormData();
      uploadData.append("image", this.policy, this.policy.name);
      uploadData.append("type", "insurance");
      uploadData.append("token", this.auth.userData.auth_token);
      this.baseService.baseApi.uploadFiles(uploadData);
    }
  }

  fetchValidityStatus(control) {
    // console.log('control:::', control);
    return ((control.touched || control.dirty) && control.errors) ||
      control.value === "Invalid date"
      ? true
      : false;
  }

  createInsuranceUI(payload) {
    let insurance = new Insurance(
      payload.is_active,
      payload.user_insurance_proof_id,
      payload.ks_user_certificate_currency_desc,
      payload.ks_user_certificate_currency_start,
      payload.ks_user_certificate_currency_exp,
      {
        amount: payload.renter_insurance_amount,
        status: payload.renter_insurance_status,
      },
      {
        amount: payload.owner_insurance_amount,
        status: payload.owner_insurance_status,
      },
      payload.image_url
    );
    this.available_insurance = [...this.available_insurance, insurance];
  }

  onSubmit() {
    this.add_policy_disable = true;
    let payload = {
      image: this.insurance_payload["image"],
      insurance_data: this.insurance_form.value,
      owner_image: "",
    };

    this.userProfile.addInsurance(payload).subscribe((res: any) => {
      if (res && res.result) {
        this.createInsuranceUI(res.result);
        this.show_insurance_cerificate = false;
        this.insurance_form.reset();
      } else {
        this.dataService.openSnackBar(res.status_message, "snack-success");
      }
      this.add_policy_disable = false;
    });
  }

  addInsuranceCertificate() {
    this.show_insurance_cerificate = true;
    this.add_policy_disable = false;
  }

  onImageUpload(image) {
    this.userProfile.addInsuranceImage(image).subscribe((res: any) => {
      setTimeout((_) => {
        this.insurance_form.controls["insurance_image_url"].setValue(
          res.result.image_url
        );
        this.cdRef.detectChanges();
      }, 10);
    });
  }

  onPickerOpen(event) {}

  setCurrentControl(controlName) {
    this.current_control = controlName;
  }
  deleteInsuranceParent(id) {
    this.current_ins_id = id;
    $("#confirmdeleteinsurancemodal").modal("show");
  }
  nowDeleteInsurance() {
    this.userProfile
      .removeInsuracneById(this.current_ins_id)
      .subscribe((res: any) => {
        console.log("insuracne removed", res);
        this.dataService.openSnackBar(res.status_message, "snack-success");
        this.fetchInsurance();
      });
  }
}
