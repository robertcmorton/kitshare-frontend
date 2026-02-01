import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../base.componant";
import { BaseService } from "../../services/base.service";
import { AuthService } from "../../services/auth.service";
import { GearlistService } from "../../services/gearlist.service";
import {
  getAllGearSubCategory,
  getPrivateGearDetails,
  getAllGearBrand,
  getAllGearCategory,
  getAllModelsOfBrand,
  getModelDetails,
  usersContactInfo,
  deleteGearImage,
  updateGearList,
  addGearImage,
  getFeatureDetails,
} from "../../shared/constant";
import {
  ExtraItems,
  UpdateGearList,
} from "../../shared/models/gear-listing.model";
import { ContactInfoData } from "../../shared/models/contact-info";

import { GearDetails } from "../../shared/models/gear-details.model";

import * as moment from "moment/moment";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "app-editgear",
  templateUrl: "./editgear.component.html",
  styleUrls: ["./editgear.component.scss"],
})
export class EditgearComponent extends BaseComponent implements OnInit {
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
  public gearListData: UpdateGearList;
  public gearImageList: Array<any>;
  public extraItems: Array<ExtraItems> = [new ExtraItems()];
  public hasExtraItems: Boolean = false;
  public disabled = { category: true, subCategory: false };
  public allAddress: Array<any> = [new ContactInfoData()];
  public sliderDetails = {
    minValue: "30",
    maxValue: "100",
    minRange: "15",
    maxRange: "120",
  };
  public uploadedFiles: Array<File> = [];
  isImageSorted = false;
  public unAvailableCount: Array<any> = ["dt3"];
  public minDate = new Date();
  public unAvailableDates: Array<any> = [];
  public gearItemsList = [];
  public gearMyItemsList = [];
  public previousFeatureList: Array<any> = [];

  public feature: Array<object> = [];
  public categoris: Array<object> = [];
  feature_details_id: Array<object> = [];
  feature_details_id_array_param: Array<any> = [];
  feature_master_id_array_param: Array<any> = [];
  has_security_deposite: boolean = false;

  model_gear_category_name: string = "";
  model_gear_sub_category_name: string = "";

  gear_type_id: number = null;

  protected gearId: any;

  public gearDetails: GearDetails = new GearDetails();

  selectedValue: string = "";

  suggestionListOptions: any = [];
  showSuggestionList: boolean = false;

  is_model_changed_manually: boolean;

  is_generic_barnd_selection_available: boolean;

  security_deposite_inc_gst: any = 0;

  checkSecurity: boolean;

  flage: boolean = true;
  isGearBrandSelected: boolean = true;
  isSuggestionsEmpty: boolean = false;

  techSpace: boolean = false;
  deskSpace: boolean = true;
  hasFeatures: boolean = false;
  gearRendered: boolean = false;

  constructor(
    public baseService: BaseService,
    private route: ActivatedRoute,
    public router: Router,
    public gearlistService: GearlistService,
    public dataService: DataService,
    public auth: AuthService
  ) {
    super(baseService, true);
    this.baseService.global.showLoader();
    this.gearListData = new UpdateGearList();
    this.gearImageList = [];
    this.route.params.subscribe((params) => {
      this.gearId = params.id ? params.id : 0;
    });

    this.is_model_changed_manually = false;
    this.is_generic_barnd_selection_available = true;
    this.checkSecurity = false;
  }
  public Editor = ClassicEditor;
  public editorData;
  showEditor: boolean = false;

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.gearListData.additional_description = data;
  }

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.techSpace = true;
      this.deskSpace = false;
    }
    this.baseService.baseApi.getPrivateGearDetails(this.gearId);
    this.baseService.baseApi.getAllGearBrand();
    this.baseService.baseApi.getAllGearCategory();
  }

  handleApiResponse(data: any) {
    this.baseService.global.hideLoader();
    if (data.resulttype === getPrivateGearDetails) {
      // Get contact Info
      this.baseService.baseApi.getUsersContactInfo();

      // IF gear type is creative then hide brand, model and 'unsure of the generic brand '
      if (data.result.result.gear_type == "1") {
        document.getElementById("brand-label").style.display = "none";
        document.getElementById("model-label").style.display = "none";
        this.is_generic_barnd_selection_available = false;
      }

      this.gearListData.replacement_value_aud_ex_gst =
        data.result.result.replacement_value_aud_ex_gst;

      if (this.gearListData === undefined) {
        this.gearListData = new UpdateGearList();
      }
      this.gearDetails = data.result.result;
      console.log(this.gearDetails);
      this.gearListData.model_description =
        this.gearDetails["gear_description_1"];
      this.gearListData.gearName = data.result.result.gear_name;
      this.gearListData.gearTypeId = data.result.result.ks_gear_type_id;
      this.gearListData.gear_brand_name = data.result.result.manufacturer_name;
      this.gearListData.gear_model_name = data.result.result.model_name;
      this.gearListData.gearCondition =
        data.result.result.ks_user_gear_condition;
      this.gearListData.image360Link = data.result.result.google_360_link;
      this.gearListData.security_deposite =
        data.result.result.security_deposite;
      this.gearListData.security_deposit_check =
        data.result.result.security_deposit_check;
      this.calculteSecurityIncGst(this.gearListData.security_deposite);
      if (
        this.gearListData.security_deposite != "0" &&
        this.gearListData.security_deposite != "0.00"
      ) {
        this.has_security_deposite = true;

        if (this.gearListData.security_deposit_check == "1") {
          this.checkSecurity = true;
        }
      }

      if (this.gearListData.security_deposite == "0.00") {
        this.gearListData.security_deposite = "";
      }

      if (this.gearDetails.gear_hide_search_results == "N") {
        this.gearListData.listing_option = "not_listed";
      } else {
        this.gearListData.listing_option = "listed";
      }

      this.previousFeatureList = data.result.result.ks_gear_feature_details;
      if (this.previousFeatureList.length > 0) {
        this.previousFeatureList.forEach((elem) => {
          let new_feature_details = {
            feature_master_id: elem.feature_master_id,
            feature_details_id: elem.feature_details_id,
          };

          this.feature_details_id.push(new_feature_details);
        });
      }

      this.gearBrandSelected(this.gearListData.gear_brand_name);

      this.model_gear_category_name = data.result.result.gear_category_name;
      this.gearListData.gear_category_name =
        data.result.result.gear_category_name;
      this.baseService.baseApi.getAllGearSubCategory(
        this.model_gear_category_name
      );

      this.model_gear_sub_category_name =
        data.result.result.gear_sub_category_name;

      this.gearlistService
        .checkSecurity(this.model_gear_sub_category_name)
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

      this.gearListData.gear_sub_category_name =
        data.result.result.gear_sub_category_name; // Sub-category name to be saved

      this.gearListData.ks_gear_feature_details =
        data.result.result.ks_gear_feature_details;

      //  Get model details with the model name to get the feature details
      let modelDetails = {
        model_name: this.gearListData.gear_model_name,
        manufacturer_name: this.gearListData.gear_brand_name,
        gear_category_name: "",
      };
      console.log("model :: ", this.gearListData.gear_model_name);

      if (this.gearListData.gear_model_name != "") {
        this.baseService.baseApi.getModelDetails(modelDetails);
      } else {
        /***  Get feature details directly by category name ***/
        /***  Added by Nilanjib 18/06/2019 ***/

        this.gearlistService
          .getFeatureDetails(this.gearListData.gear_category_name)
          .subscribe((res: any) => {
            this.feature = res;

            // this.categoris = data.result.category;

            if (this.feature != undefined) {
              this.hasFeatures = true;
              this.feature.forEach((element: any) => {
                element.feature_details.forEach((feature_details_id) => {
                  feature_details_id.is_selected = false;

                  this.gearListData.ks_gear_feature_details.forEach(
                    (elem: any) => {
                      // console.log(feature_details_id.feature_details_id +' = '+ elem.feature_details_id);

                      if (
                        feature_details_id.feature_details_id ==
                        elem.feature_details_id
                      ) {
                        feature_details_id.is_selected = true;
                      }
                    }
                  );
                });

                element.selected_text = "Select";

                this.gearListData.ks_gear_feature_details.forEach(
                  (elem: any) => {
                    if (element.feature_master_id == elem.feature_master_id) {
                      element.selected_text = elem.feature_values;
                    }
                  }
                );
              });
            }
          });
      }

      this.gearListData.replacement_value_aud_inc_gst = (
        parseFloat(this.gearListData.replacement_value_aud_ex_gst) * 1.1
      ).toFixed(2);

      this.gearListData.per_day_cost_aud_inc_gst =
        data.result.result.per_day_cost_aud_inc_gst;
      this.gearListData.per_day_cost_aud_ex_gst =
        data.result.result.per_day_cost_aud_ex_gst;
      this.gearListData.additional_description =
        data.result.result.owners_remark;
      setTimeout((_) => {
        this.editorData = this.gearListData.additional_description;
        this.showEditor = true;
      }, 10);

      this.gearListData.serialNumber = data.result.result.serial_number;

      if (data.result.result.address.length > 0) {
        this.gearListData.address = [];
        data.result.result.address.forEach((element) => {
          this.gearListData.address.push(element.user_address_id);
        });
      }

      if (data.result.result.ks_gear_feature_details.length > 0) {
        data.result.result.ks_gear_feature_details.forEach((element) => {
          this.gearListData.feature_master_id.push(element.feature_master_id);
          this.gearListData.feature_details_id.push(element.feature_details_id);
          this.feature_details_id_array_param.push(element.feature_details_id);
        });
      }

      /* console.log('Here...............................................');
      console.log(this.gearListData.feature_details_id);
      console.log(this.gearListData.feature_master_id); */

      if (this.gearImageList == undefined) {
        this.gearImageList = [];
      }

      if (data.result.result.images.length > 0) {
        // console.log('%cImage data', 'color: red;');
        // console.log(data.result.result.images);

        data.result.result.images.forEach((element) => {
          let imageObj = {
            type: "uploadedimage",
            src: element.gear_display_image,
            user_gear_image_id: element.user_gear_image_id,
          };
          this.gearImageList.push(imageObj);
        });
      }
      console.log("gearImageList", this.gearImageList);

      // console.log('Gear list Data........');
      // console.log(this.gearListData);
      // console.log(this.gearImageList);

      // this.gearListData.unAvailableDates = [];

      this.extraItems = data.result.result.extraItems;
      if (this.extraItems.length > 0) {
        this.hasExtraItems = true;
      } else {
        this.hasExtraItems = false;
        this.extraItems = [new ExtraItems()];
      }

      /* console.log('%c xtra items', 'color:green;');
      console.log(this.extraItems); */

      if (data.result.result.gear_unavailable.length > 0) {
        this.unAvailableDates = [];
        this.unAvailableCount = ["dt3"];

        let date_count_index: number = 0;

        data.result.result.gear_unavailable.forEach((element) => {
          let new_array: Array<any> = [];
          let new_array_date: Array<any> = [];

          new_array.push(element.unavailable_from_date);
          new_array.push(element.unavailable_to_date);

          new_array_date.push(moment(new Date(element.unavailable_from_date)));
          new_array_date.push(moment(new Date(element.unavailable_to_date)));
          // new_array_date.push(new Date());
          this.gearListData.unAvailableDates.push(new_array);

          this.unAvailableDates.push(new_array_date);
          this.unAvailableCount.push("dt" + date_count_index);
          date_count_index++;
        });
      } else {
        this.unAvailableDates = [];
        this.unAvailableCount = ["dt3"];
      }
      console.log("last gearImageList", this.gearImageList);
    }

    if (data.resulttype === getAllGearBrand) {
      this.gearBrandList = data.result.result;
      this.baseService.global.hideLoader();
    }

    if (data.resulttype === getAllGearCategory) {
      this.gearCategoryList = data.result.result;
    }

    if (data.resulttype === getAllGearSubCategory) {
      this.gearSubCategoryList = data.result.result;
      // this.gearSubCategoryListSelected = [2];
    }

    if (data.resulttype === getAllModelsOfBrand) {
      //this.gearListData.gear_model_name = "";
      this.flage = false;
      setTimeout(() => {
        this.flage = true;
        this.gearModelList = data.result.result;
      });
    }

    if (data.resulttype === getModelDetails) {
      if (this.gearRendered && data.result.match_found === 1) {
        this.gearCategoryList = data.result.category;
        this.setSelectedModelDetails(data.result.result);
      }

      this.gearRendered = true;
      console.log("data.result", data.result);

      if (data.result.result == "") {
        console.log("data.result is blank");
        this.model_gear_category_name = data.result.result.gear_category_name;
        this.model_gear_sub_category_name =
          data.result.result.gear_sub_category_name;

        this.gearListData.replacement_value_aud_ex_gst =
          data.result.result.replacement_value_aud_ex_gst;
        if (this.gearListData.replacement_value_aud_ex_gst == undefined) {
          this.gearListData.replacement_value_aud_inc_gst = (0 * 1.1).toFixed(
            2
          );
        }

        this.gearListData.per_day_cost_aud_ex_gst =
          data.result.result.per_day_cost_aud_ex_gst;
        if (this.gearListData.per_day_cost_aud_ex_gst == undefined) {
          this.gearListData.per_day_cost_aud_inc_gst = (0 * 1.1).toFixed(2);
        }
        0;
        this.gearImageList = [];
        this.gearListData.gearCondition = "";
        this.gearListData.serialNumber = "";
      }

      this.feature = data.result.feature;

      if (this.feature != undefined && this.feature && this.feature.length) {
        this.hasFeatures = true;
        this.feature.forEach((element: any) => {
          if (element.feature_details && element.feature_details.length) {
            element.feature_details.forEach((feature_details_id) => {
              feature_details_id.is_selected = false;

              this.gearListData.ks_gear_feature_details.forEach((elem: any) => {
                // console.log(feature_details_id.feature_details_id +' = '+ elem.feature_details_id);

                if (
                  feature_details_id.feature_details_id ==
                  elem.feature_details_id
                ) {
                  feature_details_id.is_selected = true;
                }
              });
            });
          }

          element.selected_text = "Select";

          if (
            this.gearListData?.ks_gear_feature_details &&
            this.gearListData?.ks_gear_feature_details.length
          ) {
            this.gearListData.ks_gear_feature_details.forEach((elem: any) => {
              if (element.feature_master_id == elem.feature_master_id) {
                element.selected_text = elem.feature_values;
              }
            });
          }
        });
      }
    }

    if (data.resulttype === usersContactInfo) {
      this.allAddress = this.baseService.global.getContactInfoData(
        data.result.result
      );

      this.allAddress.forEach((element: any) => {
        if (this.gearListData.address.indexOf(element.user_address_id) !== -1) {
          element.selected = true;
        } else {
          element.selected = false;
        }
      });
    }

    if (data.resulttype === updateGearList) {
      this.dataService.openSnackBar("Successfully updated!");
      this.uploadAllImages(
        data.result.result.user_gear_desc_id,
        data.result.result.model_id
      );
    }

    if (data.resulttype === deleteGearImage) {
      this.dataService.openSnackBar("Image deleted");
    }

    if (data.resulttype === addGearImage) {
      this.baseService.global.hideLoader();
      this.dataService.openSnackBar("Image uploaded");
      this.router.navigate(["/profile"]);
    }

    if (data.resulttype === getFeatureDetails) {
      this.feature = data.result;

      // this.categoris = data.result.category;

      if (this.feature != undefined) {
        this.hasFeatures = true;
        this.feature.forEach((element: any) => {
          element.selected_text = "Select";
        });
      }
    }
  }

  isAnySuggestion(isAnySuggestion: boolean) {
    console.log("isAnySuggestion ", isAnySuggestion);
    this.isSuggestionsEmpty = isAnySuggestion;
  }
  gearBrandSelected(brandName: string) {
    if (brandName) {
      this.isGearBrandSelected = false;
      setTimeout(() => {
        this.isGearBrandSelected = true;
      });
      this.gearListData.gear_brand_name = brandName;
      this.baseService.baseApi.getAllModelsOfBrand(brandName);
      console.log("gearBrandSelected called ");
      if (this.gearRendered) {
        this.gearListData.gear_model_name = "";
        let modelDetails = {
          model_name: "NOTHING",
          manufacturer_name: brandName,
          gear_category_name: "",
        };
        this.baseService.baseApi.getModelDetails(modelDetails);
        this.flage = false;
        setTimeout(() => {
          this.flage = true;
        }, 50);
      }
    }
  }

  // Select Model
  gearModelSelected(modelName: string) {
    if (modelName) {
      console.log("gearModelSelected called ", modelName);

      this.flage = false;
      setTimeout(() => {
        this.flage = true;
      }, 50);

      this.is_model_changed_manually = true;

      let modelDetails = {
        model_name: modelName,
        manufacturer_name: this.gearListData.gear_brand_name,
        gear_category_name: "",
      };
      // console.log(modelName);
      this.gearListData.gear_model_name = modelName;

      // this.baseService.baseApi.getModelDetails(modelDetails);
      this.getModelDetailsOnSelectManually(modelDetails);
    }
  }

  getModelDetailsOnSelectManually(modelDetails) {
    this.gearlistService.getModelDetails(modelDetails).subscribe((res: any) => {
      console.log("Manually model details");
      this.setSelectedModelDetails(res.result, true);
    });
  }

  calculteReplacementValue(perDayCost) {
    this.gearListData.replacement_value_aud_inc_gst = (
      parseFloat(perDayCost) * 1.1
    ).toFixed(2);
  }

  calcultePerdayValue(perDayCost) {
    console.log(
      "Calculating per day value...",
      this.gearListData.per_day_cost_aud_ex_gst
    );
    this.gearListData.per_day_cost_aud_inc_gst = (
      parseFloat(perDayCost) * 1.1
    ).toFixed(2);
  }

  calculteSecurityIncGst(security) {
    // console.log('Calculating per day value...');
    if (security == "") {
      this.security_deposite_inc_gst = "0";
    } else if (!isNaN(security)) {
      this.security_deposite_inc_gst = (parseFloat(security) * 1.1).toFixed(2);
    } else {
      this.security_deposite_inc_gst = "0";
    }
  }

  setSelectedModelDetails(modelDetails, is_manually_selected = false) {
    if (modelDetails) {
      this.setCategoryDetails(modelDetails, is_manually_selected);

      this.gearListData.replacement_value_aud_ex_gst =
        modelDetails.replacement_value_aud_ex_gst;
      this.gearListData.model_description = modelDetails.model_description;
      if (this.is_model_changed_manually == true) {
        this.gearListData.per_day_cost_aud_ex_gst =
          modelDetails.per_day_cost_aud_ex_gst;
        this.gearListData.replacement_value_aud_inc_gst = (
          parseFloat(modelDetails.per_day_cost_aud_ex_gst) * 1.1
        ).toFixed(2);
      }
      this.gearListData.replacement_value_aud_inc_gst = (
        parseFloat(this.gearListData.replacement_value_aud_ex_gst) * 1.1
      ).toFixed(2);

      console.log("After Model selected and subscribe...", this.gearImageList);

      this.gearListData.model_image_deleted = 0;
      // if manually selected then show slected model image
      if (is_manually_selected == true) {
        this.gearImageList = [];
        let imgSrc = {
          type: "defaultimage",
          src: modelDetails.model_image,
          user_gear_image_id: "",
        };
        this.gearImageList.push(imgSrc);
      }

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

  setCategoryDetails(modelDetails, is_manually_selected = false) {
    /* console.log('Model details...');
    console.log(modelDetails);
    console.log('Gear category...');
    console.log(this.gearCategoryList); */

    let selectedCategory = this.gearCategoryList.filter((category) => {
      return category.gear_category_id === modelDetails.gear_category_id;
    })[0];
    this.gearListData.gear_category_name = selectedCategory.gear_category_name;
    this.model_gear_category_name = selectedCategory.gear_category_name;
    // get sub categorie
    // this.baseService.baseApi.getAllGearSubCategory(selectedCategory.gear_category_name); // added by N Roy on 15/Nov/2018
    //console.log('modelDetails...',selectedCategory);
    // console.log(this.gearCategoryList);
    if (is_manually_selected) {
      this.onCatChange(this.model_gear_category_name);
    }
    this.disabled.category = true;
    this.model_gear_sub_category_name = modelDetails.gear_sub_category_name;
    this.gearListData.gear_sub_category_name =
      modelDetails.gear_sub_category_name;
    if (selectedCategory.gear_sub_category_id !== "0") {
      let subCategory = this.gearCategoryList.filter((category) => {
        return (
          category.gear_category_id === selectedCategory.gear_sub_category_id
        );
      })[0];
      this.gearListData.gear_sub_category_name = subCategory.gear_category_name;
      this.model_gear_sub_category_name = modelDetails.gear_sub_category_name;
      this.disabled.subCategory = true;
    }
  }

  removeImage(event) {
    let index = event.index;
    let user_gear_image_id = event.imageId || "";
    let model_image_type = event.type;
    if (user_gear_image_id != "" && user_gear_image_id != null) {
      this.baseService.baseApi.deleteGearImage(user_gear_image_id);
    }
    this.gearImageList.splice(index, 1);

    this.uploadedFiles.splice(index - 1, 1);
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
    // console.log('clcicked adderess Update handler');
    updatedAddress.updatedValue.is_default =
      this.gearListData.address[updatedAddress.index].is_default;
    this.gearListData.address[updatedAddress.index] =
      updatedAddress.updatedValue;
  }

  addressSelectHandler(id: string, isChecked: boolean) {
    if (isChecked) {
      this.gearListData.address.push(id);
    } else {
      let index = this.gearListData.address.indexOf(id);
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
        let imgSrc = {
          type: "uploadedimage",
          src: reader.result,
          user_gear_image_id: "",
          toUpload: eachImage,
        };
        if (this.imageExits(reader.result, this.gearImageList)) {
          this.uploadedFiles.pop();
        } else {
          this.gearImageList.push(imgSrc);
        }
      };
      /* console.log('Image ...');
      console.log(this.gearImageList); */
    }
  }
  imageExits(img, arr) {
    return arr.some(function (el) {
      return el.src === img;
    });
  }
  moveImages(arr) {
    this.uploadedFiles = [];
    this.gearImageList = [];
    this.isImageSorted = true;
    this.gearImageList = arr;
    arr.forEach((file) => {
      if (file.toUpload) {
        this.uploadedFiles.push(file.toUpload);
      }
    });
  }
  addNewUnavailableDate() {
    if (this.unAvailableCount === undefined) {
      this.unAvailableCount = ["dt3"];
    }
    let lastIndex = this.unAvailableCount.length;
    this.unAvailableCount.push("dt" + lastIndex);
    this.unAvailableDates.push(new Date());
  }

  updateGearData() {
    let perdaycost = this.gearListData.per_day_cost_aud_ex_gst;
    let repl_value = this.gearListData.replacement_value_aud_ex_gst;

    let unavailableFormattedDates = this.unAvailableDates.map((e) => {
      return [e[0].format("YYYY-MM-DD"), e[1].format("YYYY-MM-DD")];
    });
    if (this.unAvailableDates.length > 0) {
      this.gearListData.unAvailableDates = unavailableFormattedDates;
    } else {
      this.gearListData.unAvailableDates = [];
    }

    this.gearListData.user_gear_desc_id = this.gearId;

    if (
      this.gearListData.gearName == "" ||
      this.gearListData.gearName == null
    ) {
      this.dataService.openSnackBar(
        "Please give listing a title",
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
        "Please choose manufacturer",
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
      parseFloat(perdaycost) <= 0 ||
      perdaycost == "0.00"
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
      } else {
        this.gearListData.security_deposit_check = "0";
      }

      if (!this.checkSecurity) {
        this.gearListData.security_deposite = "";
      }

      this.baseService.global.showLoader();
      this.baseService.baseApi
        .updateGearListManual(this.gearListData)
        .subscribe((res: any) => {
          this.dataService.openSnackBar("Successfully updated!");
          this.uploadAllImages(
            res.result.user_gear_desc_id,
            res.result.model_id
          );
        });
    }
  }

  uploadAllImages(user_gear_desc_id, model_id) {
    if (this.uploadedFiles.length > 0) {
      this.baseService.global.hideLoader();
      let uploadData = new FormData();
      uploadData.append("model_id", model_id);
      uploadData.append("user_gear_desc_id", user_gear_desc_id);
      uploadData.append("token", this.auth.userData.auth_token);
      for (const eachFile of this.uploadedFiles) {
        if (eachFile) {
          uploadData.append("image[]", eachFile, eachFile.name);
        }
      }
      this.baseService.baseApi.addGearImage(uploadData);
    } else if (this.isImageSorted) {
      let ids = [];
      this.gearImageList.forEach((image) => {
        ids.push(image.user_gear_image_id);
      });
      let uploadData = new FormData();
      uploadData.append("existing_images", ids.toString());
      uploadData.append("model_id", model_id);
      uploadData.append("user_gear_desc_id", user_gear_desc_id);
      uploadData.append("token", this.auth.userData.auth_token);
      this.baseService.baseApi.addGearImage(uploadData);
    } else {
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
  }

  onCatChange(value) {
    this.has_security_deposite = false;
    this.gearListData.security_deposite = "";
    this.security_deposite_inc_gst = "0";
    this.gearListData.gear_category_name = value;
    this.gearListData.gear_sub_category_name = "";
    this.model_gear_sub_category_name = "";

    this.gearlistService.getAllGearSubCategory(value).subscribe((res: any) => {
      this.gearSubCategoryList = res.result;
    });

    this.gearlistService.getFeatureDetails(value).subscribe((res: any) => {
      this.feature = res;
      if (this.feature != undefined) {
        this.hasFeatures = true;
        this.feature.forEach((element: any) => {
          element.selected_text = "Select";
        });
      }
    });
  }

  onSubcatCatChange(value) {
    this.gearListData.gear_sub_category_name = value;
    this.gearListData.security_deposit_check = "0";
    this.gearListData.security_deposite = "";
    this.checkSecurity = false;
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
  }

  selectGearType(gear_type) {
    this.gear_type_id = gear_type;
    this.gearListData.gearTypeId = gear_type;
    if (this.gear_type_id == 1) {
      document.getElementById("brand-label").style.display = "none";
      document.getElementById("model-label").style.display = "none";
      this.is_generic_barnd_selection_available = false;
    } else {
      document.getElementById("brand-label").style.display = "block";
      document.getElementById("model-label").style.display = "block";
      this.is_generic_barnd_selection_available = true;
    }

    if (this.gear_type_id == 1 || this.gear_type_id == 2) {
      this.model_gear_category_name = "Creative Spaces";
      this.baseService.baseApi.getAllGearSubCategory("Creative Spaces");
    } else {
      this.model_gear_category_name = "";
    }
  }

  selectConditionType(condition) {
    this.gearListData.gearCondition = condition;
  }

  filterSuggestionList(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.selectedValue = this.gearListData.gear_brand_name;
    if (this.selectedValue && this.selectedValue.length >= 1) {
      this.suggestionListOptions = this.gearBrandList.filter((option) => {
        return (
          option.manufacturer_name
            .toLowerCase()
            .indexOf(this.selectedValue.toLowerCase()) > -1
        );
      });
      if (this.suggestionListOptions.length > 0) {
        this.showSuggestionList = true;
      } else {
        this.showSuggestionList = false;
        this.gearBrandSelected(event.target.value);
      }
    } else {
      this.showSuggestionList = false;
      this.gearListData.gear_brand_name = "";
    }
  }

  updateTextFieldValue(brand_name) {
    this.gearListData.gear_brand_name = brand_name;
    this.showSuggestionList = false;
    this.gearBrandSelected(this.gearListData.gear_brand_name);
  }

  newValueSelected() {
    this.showSuggestionList = false;
  }

  securityRequiredCheckbox(e) {
    if (e.target.checked === true) {
      this.checkSecurity = true;
    }
    if (e.target.checked === false) {
      this.checkSecurity = false;
    }
  }

  unsetUnavailableDate(index) {
    this.unAvailableDates.splice(index, 1);
    this.unAvailableCount.splice(index, 1);
    console.log(this.unAvailableDates);
  }
}
