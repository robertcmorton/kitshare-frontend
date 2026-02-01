import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { BaseComponent } from "../../base.componant";
import { BaseService } from "../../services/base.service";
import { AuthService } from "../../services/auth.service";
import { GearlistService } from "../../services/gearlist.service";
import {
  getAllGearSubCategory,
  getAllGearBrand,
  getAllGearCategory,
  getAllModelsOfBrand,
  getModelDetails,
  usersContactInfo,
  addGearList,
  addGearImage,
  getFeatureDetails,
} from "../../shared/constant";
import { GearList, ExtraItems } from "../../shared/models/gear-listing.model";
import { ContactInfoData } from "../../shared/models/contact-info";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { DataService } from "app/shared/data/data.service";
declare var $: any;

const MY_MOMENT_FORMATS = {
  parseInput: "l LT",
  fullPickerInput: "l LT",
  datePickerInput: "LL",
  timePickerInput: "LT",
  monthYearLabel: "MMM YYYY",
  dateA11yLabel: "LL",
  monthYearA11yLabel: "MMMM YYYY",
};

@Component({
  selector: "app-gear-list",
  templateUrl: "./gear-list.component.html",
  styleUrls: ["./gear-list.component.scss"],
})
export class GearListComponent extends BaseComponent implements OnInit {
  public ngxControl = new FormControl();

  public gearCategoryList: Array<any> = [];
  public gearSubCategoryList: Array<any> = [];
  public gearBrandList: Array<any> = [];
  public gearModelList: Array<any> = [];
  public gearConditionlList: Array<any> = [
    "New",
    "Like New",
    "Slightly Worn",
    "Worn",
  ];
  public gearTypeList: Array<any> = [
    { id: 1, label: "Creative Space" },
    { id: 2, label: "Kit" },
    { id: 4, label: "Equipment" },
  ]; // { id: 3, label: "Accessory" },
  public gearListData: GearList = new GearList();
  public gearImageList = [];
  // public extraItems: Array<ExtraItems> = [new ExtraItems()];
  public extraItems: Array<any> = [new ExtraItems()];
  public disabled = { category: true, subCategory: false };
  public allAddress: Array<any> = [new ContactInfoData()];
  public sliderDetails = {
    minValue: "30",
    maxValue: "100",
    minRange: "15",
    maxRange: "120",
  };
  public uploadedFiles: Array<File> = [];
  public unAvailableCount: Array<any> = ["dt3"];
  public minDate = new Date();
  public unAvailableDates: Date[] = [];
  public gearItemsList = [];
  public gearMyItemsList = [];

  public feature: Array<object> = [];
  public categoris: Array<object> = [];
  feature_details_id: Array<object> = [];
  feature_details_id_array_param: Array<any> = [];
  feature_master_id_array_param: Array<any> = [];
  has_security_deposite: boolean = false;

  model_gear_category_name: string = "";
  model_gear_sub_category_name: string = "";

  gear_type_id: number = null;
  show_feature_list: boolean = true;

  average_value: any;
  myMinVar: any;
  myMaxVar: any;

  has_address: boolean = false;

  is_generic_barnd_selection_available: boolean;

  security_deposite_inc_gst: any = 0;

  checkSecurity: boolean;
  public Editor = ClassicEditor;
  public model = {
    editorData: "",
  };
  brand_name_temp: string = "";
  model_name_selected: string = "";
  isBrandSelected: boolean = true;
  techSpace: boolean = false;
  deskSpace: boolean = true;
  hasFeatures: boolean = false;
  save_disabled: boolean = false;

  title = "appBootstrap";

  closeResult: string;

  constructor(
    public baseService: BaseService,
    public gearlistService: GearlistService,
    public router: Router,
    public dataService: DataService,
    public auth: AuthService
  ) {
    super(baseService, true);
    this.baseService.global.showLoader();
    this.is_generic_barnd_selection_available = true;
    this.checkSecurity = false;
    this.save_disabled = false;
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.gearListData.additional_description = data;
  }

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.techSpace = true;
      this.deskSpace = false;
    }
    this.baseService.baseApi.getAllGearBrand();
    this.baseService.baseApi.getAllGearCategory();
    this.baseService.baseApi.getUsersContactInfo();
  }
  ngOnDestroy() {
    $("#noaddressmodal").modal("hide");
  }
  handleApiResponse(data: any) {
    if (data.resulttype === getAllGearBrand) {
      this.gearBrandList = data.result.result;
      this.baseService.global.hideLoader();
    }

    if (data.resulttype === getAllGearCategory) {
      this.gearCategoryList = data.result.result;
    }

    if (data.resulttype === getAllGearSubCategory) {
      this.gearSubCategoryList = data.result.result;
    }

    if (data.resulttype === getAllModelsOfBrand) {
      this.gearModelList = data.result.result;
    }
    if (data.resulttype === getModelDetails) {
      this.gearImageList = [];
      if (data.result.match_found === 1) {
        this.gearCategoryList = data.result.category;
        this.setSelectedModelDetails(data.result.result);
      }

      this.model_gear_category_name = data.result.result.gear_category_name;
      this.model_gear_sub_category_name =
        data.result.result.gear_sub_category_name;
      this.gearListData.gear_sub_category_name =
        data.result.result.gear_sub_category_name;

      this.gearListData.replacement_value_aud_ex_gst =
        data.result.result.replacement_value_aud_ex_gst;
      if (this.gearListData.replacement_value_aud_ex_gst == undefined) {
        this.gearListData.replacement_value_aud_inc_gst = (0 * 1.1).toFixed(2);
      }
      this.gearListData.per_day_cost_aud_ex_gst =
        data.result.result.per_day_cost_aud_ex_gst;
      if (this.gearListData.per_day_cost_aud_ex_gst == undefined) {
        this.calcultePerdayValue(this.gearListData.per_day_cost_aud_ex_gst);
      }

      this.gearlistService
        .checkSecurity(this.gearListData.gear_sub_category_name)
        .subscribe((res: any) => {
          let result = res;
          if (result.result == "Yes") {
            this.has_security_deposite = true;
          } else {
            this.has_security_deposite = false;
            this.gearListData.security_deposite = "";
            this.security_deposite_inc_gst = "0";
          }
        });

      this.feature = data.result.feature;

      if (this.feature != undefined) {
        this.hasFeatures = true;
        this.feature.forEach((element: any) => {
          element.selected_text = "Select";
        });
      }
    }

    if (data.resulttype === usersContactInfo) {
      this.allAddress = this.baseService.global.getContactInfoData(
        data.result.result
      );

      if (
        this.allAddress[0].ks_state_id == "" ||
        this.allAddress[0].ks_state_name == ""
      ) {
        this.has_address = false;
        $("#noaddressmodal").modal({
          backdrop: "static",
          keyboard: false,
        });
      } else {
        this.has_address = true;
      }
    }
    if (data.resulttype === addGearList) {
      this.uploadAllImages(
        data.result.result.user_gear_desc_id,
        data.result.result.model_id
      );
      this.gearListData = new GearList();
    }

    if (data.resulttype === addGearImage) {
      this.baseService.global.hideLoader();
      this.dataService.openSnackBar("Successfully added!");
      this.router.navigate(["/profile"]);
    }

    if (data.resulttype === getFeatureDetails) {
      this.feature = data.result;
      if (this.feature != undefined) {
        this.hasFeatures = true;
        this.feature.forEach((element: any) => {
          element.selected_text = "Select";
        });
      }
    }
  }

  gearBrandSelected(brandName: string) {
    console.log("brandName,", brandName);
    if (this.brand_name_temp != brandName && brandName) {
      this.model_name_selected = "";
      this.gearListData.gear_model_name = "";
      this.brand_name_temp = brandName;
      let modelDetails = {
        model_name: "NOTHING",
        manufacturer_name: this.brand_name_temp,
        gear_category_name: "",
      };
      this.baseService.baseApi.getModelDetails(modelDetails);
      this.baseService.baseApi.getAllModelsOfBrand(brandName);
      this.isBrandSelected = false;
      setTimeout(() => {
        this.isBrandSelected = true;
      }, 50);
    }
    if (!brandName) {
      console.log("brandName not selected empty", brandName);
    }
  }

  gearModelSelected(modelName: string) {
    if (this.brand_name_temp != "" && modelName) {
      let encoded_model_name = encodeURIComponent(modelName);
      console.log(encoded_model_name);
      let modelDetails = {
        model_name: encoded_model_name,
        manufacturer_name: this.brand_name_temp,
        gear_category_name: "",
      };
      this.gearListData.gear_model_name = modelName;
      this.baseService.baseApi.getModelDetails(modelDetails);
    }
    if (!modelName) {
      console.log("modelName not selected empty", modelName);
    }
  }

  calculteReplacementValue(perDayCost) {
    if (perDayCost == "") {
      this.gearListData.replacement_value_aud_inc_gst = "0";
    } else if (perDayCost && !isNaN(perDayCost)) {
      this.gearListData.replacement_value_aud_inc_gst = (
        parseFloat(perDayCost) * 1.1
      ).toFixed(2);
    } else {
      this.gearListData.replacement_value_aud_inc_gst = "0";
    }
  }

  calcultePerdayValue(perDayCost) {
    if (perDayCost == "") {
      this.gearListData.per_day_cost_aud_inc_gst = "0";
    } else if (perDayCost && !isNaN(perDayCost)) {
      this.gearListData.per_day_cost_aud_inc_gst = (
        parseFloat(perDayCost) * 1.1
      ).toFixed(2);
    } else {
      this.gearListData.per_day_cost_aud_inc_gst = "0";
    }
  }

  calculteSecurityIncGst(security) {
    if (security == "") {
      this.security_deposite_inc_gst = "0";
    } else if (!isNaN(security)) {
      this.security_deposite_inc_gst = (parseFloat(security) * 1.1).toFixed(2);
    } else {
      this.security_deposite_inc_gst = "0";
    }
  }

  setSelectedModelDetails(modelDetails) {
    this.gearListData.feature_details_id = [];
    this.gearListData.feature_master_id = [];
    if (modelDetails) {
      this.setCategoryDetails(modelDetails);
      this.gearListData.model_description = modelDetails.model_description;
      this.gearListData.model_description =
        this.gearListData.model_description.replace(/\\/g, "");
      // console.log(this.gearListData.model_description);
      this.gearListData.per_day_cost_aud_ex_gst =
        modelDetails.per_day_cost_aud_ex_gst;
      this.gearListData.replacement_value_aud_ex_gst =
        modelDetails.replacement_value_aud_ex_gst;
      this.calcultePerdayValue(this.gearListData.per_day_cost_aud_ex_gst);
      this.calculteReplacementValue(
        this.gearListData.replacement_value_aud_ex_gst
      );
      this.gearImageList = [];
      this.gearListData.model_image_deleted = 0;
      let model_img_desc = {
        type: "defaultimage",
        src: modelDetails.model_image,
      };
      this.gearImageList.push(model_img_desc);
      this.sliderDetails.minValue = (
        parseFloat(this.gearListData.per_day_cost_aud_ex_gst) * 0.5
      ).toFixed(2);
      this.sliderDetails.maxValue = (
        parseFloat(this.gearListData.per_day_cost_aud_ex_gst) * 1.5
      ).toFixed(2);
      this.sliderDetails.minRange = Math.ceil(
        parseFloat(this.sliderDetails.minValue) * 0.5
      ).toString();
      this.sliderDetails.maxRange = Math.ceil(
        parseFloat(this.sliderDetails.maxValue) * 1.4
      ).toString();
    }
  }

  setCategoryDetails(modelDetails) {
    let selectedCategory = this.gearCategoryList.filter((category) => {
      return category.gear_category_id === modelDetails.gear_category_id;
    })[0];

    this.gearListData.gear_category_name = selectedCategory.gear_category_name;
    this.baseService.baseApi.getAllGearSubCategory(
      selectedCategory.gear_category_name
    );
    this.disabled.category = true;
    if (selectedCategory.gear_sub_category_id !== "0") {
      let subCategory = this.gearCategoryList.filter((category) => {
        return (
          category.gear_category_id === selectedCategory.gear_sub_category_id
        );
      })[0];
      this.gearListData.gear_sub_category_name = subCategory.gear_category_name;
      this.disabled.subCategory = true;
    }
  }

  removeImage(event) {
    let index = event.index;
    let model_image_type = event.type;
    this.gearImageList.splice(index, 1);
    // this.uploadedFiles.splice(index, 1);
    if (model_image_type == "defaultimage") {
      this.gearListData.model_image_deleted = 1;
    }
  }
  updateExtraItemValueHandler(newValueDetails) {
    this.gearListData.extraItems[newValueDetails.index] =
      newValueDetails.updatedValue;
  }
  ExtraItemActionValueHandler(actionDetails) {
    if (actionDetails.action === "add") {
      this.gearListData.extraItems.push(new ExtraItems());
      this.extraItems.push(new ExtraItems());
    } else {
      this.gearListData.extraItems.splice(actionDetails.index, 1);
      this.extraItems.splice(actionDetails.index, 1);
    }
  }
  addressActionHandeler(index, action) {
    if (action === "add") {
      this.gearListData.address.push(new ContactInfoData());
    } else {
      this.gearListData.address.splice(index, 1);
      this.allAddress.splice(index, 1);
    }
    // this.allAddress = this.gearListData.address;
  }
  addressUpdateHandler(updatedAddress) {
    updatedAddress.updatedValue.is_default =
      this.gearListData.address[updatedAddress.index].is_default;
    this.gearListData.address[updatedAddress.index] =
      updatedAddress.updatedValue;
  }
  addressSelectHandler(id: string, isChecked: boolean) {
    if (isChecked) {
      this.gearListData.address.push(id);
    } else {
      let index = this.gearListData.address.findIndex((x) => x.value === id);
      this.gearListData.address.splice(index, 1);
    }
  }
  setVariousBrans() {
    this.gearListData.gear_brand_name = "Other";
    this.baseService.baseApi.getAllModelsOfBrand("");
  }
  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let eachImage = event.target.files[0];
      this.uploadedFiles.push(<File>eachImage);
      reader.readAsDataURL(eachImage);
      reader.onload = () => {
        let model_img_desc = {
          type: "uploadedimage",
          src: reader.result,
          toUpload: eachImage,
        };
        if (this.imageExits(reader.result, this.gearImageList)) {
          this.uploadedFiles.pop();
        } else {
          this.gearImageList.push(model_img_desc);
        }
      };
    }
  }
  imageExits(img, arr) {
    return arr.some(function (el) {
      return el.src === img;
    });
  }
  moveImages(arr) {
    this.uploadedFiles = [];
    arr.forEach((file) => {
      this.uploadedFiles.push(file.toUpload);
    });
  }
  addNewUnavailableDate() {
    let lastIndex = this.unAvailableCount.length;
    this.unAvailableCount.push("dt" + lastIndex);
    // this.unAvailableDates.push(new Date());
  }

  unsetUnavailableDate(index) {
    this.unAvailableDates.splice(index, 1);
    this.unAvailableCount.splice(index, 1);
  }

  saveGearData() {
    let perdaycost = this.gearListData.per_day_cost_aud_ex_gst;
    let repl_value = this.gearListData.replacement_value_aud_ex_gst;

    this.gearListData.gear_brand_name = this.brand_name_temp;

    let unavailableFormattedDates = this.unAvailableDates.map((e) => {
      return [e[0].format("YYYY-MM-DD"), e[1].format("YYYY-MM-DD")];
    });
    this.gearListData.unAvailableDates = unavailableFormattedDates;

    if (
      this.gearListData.gearName == "" ||
      this.gearListData.gearName == null
    ) {
      this.dataService.openSnackBar(
        "Please give your listing a title",
        "snack-error"
      );
    } else if (
      this.gearListData.gearTypeId == "" ||
      this.gearListData.gearTypeId == null
    ) {
      this.dataService.openSnackBar(
        "Please select listing type",
        "snack-error"
      );
    } else if (
      (this.gearListData.gear_brand_name == "" ||
        this.gearListData.gear_brand_name == null) &&
      this.gearListData.gearTypeId != "1"
    ) {
      this.dataService.openSnackBar(
        "Please choose a Manufacturer",
        "snack-error"
      );
    } else if (
      (this.gearListData.gear_model_name == "" ||
        this.gearListData.gear_model_name == null) &&
      this.gearListData.gearTypeId != "1"
    ) {
      this.dataService.openSnackBar("Please type model name", "snack-error");
    } else if (
      this.gearListData.gear_category_name == "" ||
      this.gearListData.gear_category_name == null
    ) {
      this.dataService.openSnackBar("Please select a category", "snack-error");
    } else if (
      this.gearListData.gear_sub_category_name == "" ||
      this.gearListData.gear_sub_category_name == null
    ) {
      this.dataService.openSnackBar(
        "Please select a subcategory",
        "snack-error"
      );
    } else if (
      repl_value == "" ||
      repl_value == null ||
      parseFloat(repl_value) <= 0 ||
      repl_value == "0.00"
    ) {
      this.dataService.openSnackBar(
        "Please enter a replacement value",
        "snack-error"
      );
    } else if (
      this.gearListData.gearCondition == "" ||
      this.gearListData.gearCondition == null
    ) {
      console.log("this.gearListData", this.gearListData);

      this.dataService.openSnackBar(
        "Please select a listing condition",
        "snack-error"
      );
    } else if (
      this.gearListData.gearTypeId == "" ||
      this.gearListData.gearTypeId == null
    ) {
      this.dataService.openSnackBar(
        "Please select a listing type",
        "snack-error"
      );
    } else if (
      perdaycost == "" ||
      perdaycost == null ||
      perdaycost == "0.00" ||
      parseFloat(perdaycost) <= 0
    ) {
      this.dataService.openSnackBar(
        "Please enter a price per day",
        "snack-error"
      );
    } else if (
      this.checkSecurity &&
      this.gearListData.security_deposite === ""
    ) {
      this.dataService.openSnackBar(
        "Please untick or add an amount to the security depsoit",
        "snack-error"
      );
    } else if (
      this.gearListData.address.length == 0 ||
      this.gearListData.address == null
    ) {
      this.dataService.openSnackBar(
        "Please choose an address for your listing",
        "snack-error"
      );
    } else if (
      this.gearListData.listing_option == "" ||
      this.gearListData.listing_option == null
    ) {
      this.dataService.openSnackBar(
        "Please choose listing option",
        "snack-error"
      );
    } else {
      if (this.checkSecurity) {
        this.gearListData.security_deposit_check = "1";
      }

      if (!this.checkSecurity) {
        this.gearListData.security_deposite = "";
      }
      if (!this.save_disabled) {
        this.baseService.global.showLoader();
        this.save_disabled = true;
        this.baseService.baseApi.addGearList(this.gearListData);
      }
    }
  }

  uploadAllImages(user_gear_desc_id, model_id) {
    console.log("Before uploading images...");
    console.log(this.uploadedFiles);

    if (this.uploadedFiles.length > 0) {
      this.dataService.openSnackBar(
        "Please wait for all listing images to be uploaded.."
      );

      this.baseService.global.hideLoader();
      let uploadData = new FormData();
      uploadData.append("model_id", model_id);
      uploadData.append("user_gear_desc_id", user_gear_desc_id);
      uploadData.append("token", this.auth.userData.auth_token);

      for (const eachFile of this.uploadedFiles) {
        if (eachFile) {
          // uploadData.append("image[]", eachFile, eachFile.name);
          uploadData.append("image[]", eachFile, eachFile.name);
        }
      }
      this.baseService.baseApi.addGearImage(uploadData);

      this.uploadedFiles = [];
      this.gearImageList = [];
    } else {
      this.uploadedFiles = [];
      this.gearImageList = [];
      this.baseService.global.hideLoader();
      this.router.navigate(["/profile"]);
    }
  }

  onFeatureChange(item, event) {
    if (
      this.gearListData.feature_details_id.length == 0 &&
      this.gearListData.feature_master_id.length == 0
    ) {
      this.gearListData.feature_details_id.push(item.feature_details_id);
      this.gearListData.feature_master_id.push(item.feature_master_id);
    } else {
      if (event.target.checked == false) {
        // this.gearListData.feature_details_id.indexOf(item.feature_details_id);
        if (
          this.gearListData.feature_details_id.indexOf(
            item.feature_details_id
          ) !== -1
        ) {
          this.gearListData.feature_details_id.splice(
            this.gearListData.feature_details_id.indexOf(
              item.feature_details_id
            ),
            1
          );
          this.gearListData.feature_master_id.splice(
            this.gearListData.feature_master_id.indexOf(item.feature_master_id),
            1
          );
        }
      } else {
        this.gearListData.feature_details_id.push(item.feature_details_id);
        this.gearListData.feature_master_id.push(item.feature_master_id);
      }
    }

    console.log(this.gearListData.feature_details_id);
    console.log(this.gearListData.feature_master_id);
  }

  onCatChange(value) {
    console.log(value);
    this.has_security_deposite = false;
    this.gearListData.security_deposite = "";
    this.security_deposite_inc_gst = "0";
    this.checkSecurity = false;
    this.gearListData.gear_category_name = value;
    this.baseService.baseApi.getAllGearSubCategory(value);
    this.baseService.baseApi.getFeatureDetails(encodeURIComponent(value)); // added on 19 April 2019
  }

  onSubcatCatChange(value) {
    console.log("subcat", value);
    this.gearListData.gear_sub_category_name = value;

    this.gearlistService.checkSecurity(value).subscribe((res: any) => {
      let result = res;
      if (result.result == "Yes") {
        this.has_security_deposite = true;
      } else {
        this.has_security_deposite = false;
        this.gearListData.security_deposite = "";
        this.security_deposite_inc_gst = "0";
      }
    });

    this.gearlistService.getAverageValue(value).subscribe((res: any) => {
      let result = res;
      this.average_value = parseFloat(result.result.average_value).toFixed(3);
      this.myMinVar = (this.average_value / 1.5).toFixed(3);
      this.myMaxVar = (this.average_value * 1.5).toFixed(3);
    });
  }

  selectGearType(gear_type) {
    this.gear_type_id = gear_type;
    if (this.gear_type_id == 1) {
      document.getElementById("brand-label").style.display = "none";
      document.getElementById("model-label").style.display = "none";
      this.is_generic_barnd_selection_available = false;
    } else {
      document.getElementById("brand-label").style.display = "block";
      document.getElementById("model-label").style.display = "block";
      this.is_generic_barnd_selection_available = true;
    }
    if (this.gear_type_id == 1) {
      this.model_gear_category_name = "Creative Spaces";
      this.gearListData.gear_sub_category_name = "";
      this.baseService.baseApi.getFeatureDetails(
        encodeURIComponent(this.model_gear_category_name)
      ); // added on 19 April 2019
      this.gearListData.gear_category_name = "Creative Spaces";
      this.baseService.baseApi.getAllGearSubCategory("Creative Spaces");
    }
  }

  myOnUpdate(event) {}
  myOnChange(event) {}
  myOnFinish(event) {}

  securityRequiredCheckbox(e) {
    if (e.target.checked === true) {
      this.checkSecurity = true;
    }
    if (e.target.checked === false) {
      this.checkSecurity = false;
    }
  }
  addAnAddress() {
    console.log("addAnAddress");
    $("#addaddressmodal").modal("show");
  }
  onPlaceSelect(e) {
    console.log("onPlaceSelect");
  }
}
