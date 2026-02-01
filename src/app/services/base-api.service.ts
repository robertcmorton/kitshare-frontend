import { MatSnackBar } from "@angular/material/snack-bar";
import * as con from "./../shared/constant";
import { AuthService } from "./auth.service";
import { ApiRouterService } from "./api-router.service";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { REQUEST_GET, REQUEST_POST, RESULT_ERROR } from "../shared/constant";
import { HttpClient } from "@angular/common/http";
import { UserEditProfileData } from "../shared/models/user-profile";
import { map } from "rxjs/operators";

@Injectable()
export class BaseApiService {
  /**
   * contain api response
   */
  private _result: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  /**
   * manage dependency injection
   * @param http
   * @param apiRoute
   * @param auth
   * @param flash
   */
  constructor(
    public http: HttpClient,
    public apiRoute: ApiRouterService,
    public auth: AuthService,
    public flash: MatSnackBar
  ) {}

  /**
   * manage all api calling
   * @param url api endpoint
   * @param rtype constant of unique request. you can identify a response by this
   * @param bodydata optional, post data
   * @param requesttype constat of GET, POST
   */
  public genericApiCall(
    url,
    rtype: string,
    bodydata: any = null,
    requesttype: string = REQUEST_GET,
    json: boolean = true
  ) {
    switch (requesttype) {
      case REQUEST_GET:
        this.apiRoute.http.get(url).subscribe(
          (data) => {
            this._result.next({ resulttype: rtype, result: data });
          },
          (error) => {
            this.handleError(error, rtype);
          }
        );
        break;

      case REQUEST_POST:
        bodydata = bodydata ? bodydata : {};
        bodydata.token = this.auth.userData.auth_token;
        var headers = this.apiRoute.getHeader(json);
        this.apiRoute.http.post(url, bodydata, { headers: headers }).subscribe(
          (data) => {
            this._result.next({ resulttype: rtype, result: data });
          },
          (error) => {
            this.handleError(error, rtype);
          }
        );
        break;
    }
  }

  /**
   * handle http error response
   * @param error
   * @param requestid
   */
  private handleError(error: any, requestid: string) {
    this._result.next({
      resulttype: RESULT_ERROR,
      result: error,
      requestid: requestid,
    });
  }

  /**
   * observer of api response
   */
  get apiResults() {
    return this._result.asObservable();
  }

  /**
   * call userinfo for profile page api
   */
  getUserInfoForPrfile(action = "") {
    var profileBody = {
      app_user_id: "",
      action: action,
    };
    const url = this.apiRoute.userInfoForProfile;
    this.genericApiCall(url, con.userInfoForProfile, profileBody, REQUEST_POST);
  }

  /**
   * call userinfo new by N.Roy
   */
  getUserInfoForPrfileNew(token, app_user_id = "") {
    const url = this.apiRoute.userInfoForProfile;
    let data = { token: token, app_user_id: app_user_id, action: "" };
    return this.apiRoute.http.post(url, data);
  }

  /**
   * call userinfo for profile page api by ID
   */
  getUserProfileByID(id) {
    var profileBody = {
      app_user_id: id,
    };
    const url = this.apiRoute.userInfoForProfileByID;
    this.genericApiCall(url, con.userInfoForProfile, profileBody, REQUEST_POST);
  }

  /**
   * call userinfo for profile page api by ID/AppUsername
   */
  getUserProfileByAppUsername(app_username) {
    var data = {
      app_username: app_username,
    };
    const url = this.apiRoute.userInfoForProfileByID;
    this.genericApiCall(url, con.userInfoForProfile, data, REQUEST_POST);
  }
  /**
   * call userinfo for profile page api
   */
  getProfile(action = "") {
    var profileBody = {
      app_user_id: "",
      action: action,
    };
    const url = this.apiRoute.userInfoForProfile;
    this.genericApiCall(url, con.userProfile, profileBody, REQUEST_POST);
  }
  /**
   * call ListUnavailableDates for profile page api
   */
  ListUnavailableDates(action = "") {
    var profileBody = {
      app_user_id: "",
      action: action,
    };
    const url = this.apiRoute.userUnavailableDate;
    this.genericApiCall(
      url,
      con.ListUnavailableDates,
      profileBody,
      REQUEST_POST
    );
  }
  /**
   * call deleteUnavialableDate for profile page api
   */
  deleteUnavialableDate(from_date, to_date) {
    var profileBody = {
      app_user_id: "",
      action: "",
      from_date: from_date,
      to_date: to_date,
    };
    const url = this.apiRoute.deleteUnavialableDate;
    this.genericApiCall(url, "", profileBody, REQUEST_POST);
  }
  /**
   * call gear details api for profile page with search key ()
   */
  getUserInfoGearDatawithSearchKey(
    searchitem = "",
    catvalue = "",
    per_page = 0,
    app_user_id = 0
  ) {
    let searchBody = {
      gear_name: searchitem,
      gear_category_id: catvalue,
      per_page: per_page,
    };

    var data_payload = null;
    if (app_user_id != 0) {
      data_payload = {
        app_user_id: app_user_id,
        gear_name: searchitem,
        gear_category_id: catvalue,
        per_page: per_page,
      };
    } else {
      data_payload = {
        gear_name: searchitem,
        gear_category_id: catvalue,
        per_page: per_page,
      };
    }

    if (this.auth.userData.auth_token == undefined) {
      //made object for anonymouse users
      data_payload.app_username = app_user_id;
      delete data_payload.app_user_id;
    }

    const url = this.apiRoute.userInfoGearData + "?per_page=" + per_page;
    this.genericApiCall(url, con.userInfoGearData, data_payload, REQUEST_POST);
  }

  /**
   * call gear details api for profile page with all, public, private key
   */
  getUserInfoGearDatawithPublicPrivateKey(
    searchitem,
    app_user_id = "",
    page = 0,
    catvalue = "",
    item_name = ""
  ) {
    let searchBody = {
      type: searchitem,
      app_user_id: app_user_id,
      per_page: page,
      gear_name: item_name,
      gear_category_id: catvalue,
    };

    const url = this.apiRoute.userInfoGearData + "?per_page=" + page;
    this.genericApiCall(url, con.userInfoGearData, searchBody, REQUEST_POST);
  }

  /**
   * call gear details api for profile page with app_username and page number
   */
  getUserInfoGearByAppUsername(app_user_name = "", page = 0) {
    let searchBody = {
      app_username: app_user_name,
      per_page: page,
    };

    const url = this.apiRoute.userInfoGearData + "?per_page=" + page;
    this.genericApiCall(url, con.userInfoGearData, searchBody, REQUEST_POST);
  }

  getUserInfoGearByAppUsernameSubscribe(app_user_name = "", page = 0) {
    let searchBody = {
      app_username: app_user_name,
      per_page: page,
    };

    const url = this.apiRoute.userInfoGearData + "?per_page=" + page;
    return this.http.post(url, searchBody).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /**
   * call active gears for profile page
   */
  getUserActiveGear() {
    let searchBody = {
      gear_status: "active",
    };

    const url = this.apiRoute.userInfoGearData;
    this.genericApiCall(url, con.userInfoGearData, searchBody, REQUEST_POST);
  }

  /**
   * call gear details api for profile page
   */
  getUserInfoGearData(
    app_user_id = 0,
    page = 0,
    catvalue = "",
    gear_name = ""
  ) {
    var data_payload = null;
    if (app_user_id != 0) {
      data_payload = {
        app_username: app_user_id,
        app_user_id: app_user_id,
        per_page: page,
        gear_name: gear_name,
        gear_category_id: catvalue,
      };
    } else {
      data_payload = {
        per_page: page,
        gear_name: gear_name,
        gear_category_id: catvalue,
      };
    }
    const url = this.apiRoute.userInfoGearData + "?per_page=" + page;
    this.genericApiCall(url, con.userInfoGearData, data_payload, REQUEST_POST);
  }

  /**
   * call products reviews for profile page
   */
  getUserInfoProductReviews(app_user_id = 0, page = 1) {
    var data_payload = null;
    if (app_user_id != 0) {
      data_payload = {
        app_user_id: app_user_id,
      };
    } else {
      data_payload = {
        app_user_id: "",
      };
    }
    if (this.auth.userData.auth_token == undefined) {
      //made object for anonymouse users
      data_payload.app_username = app_user_id;
      delete data_payload.app_user_id;
    }
    data_payload.page = page;
    data_payload.limit = 10;

    const url = this.apiRoute.userInfoProdutReviews;
    this.genericApiCall(
      url,
      con.userInfoProdutReviews,
      data_payload,
      REQUEST_POST
    );
  }

  /**
   * call rental type option api
   */
  getRentalType() {
    const url = this.apiRoute.rentalType;
    this.genericApiCall(url, con.rentalType);
  }

  getProfessionType() {
    const url = this.apiRoute.professionType;
    this.genericApiCall(url, con.professionType);
  }

  getStateList() {
    const url = this.apiRoute.stateList;
    this.genericApiCall(url, con.stateList);
  }

  getSuburbsList(stateId: string) {
    const url = this.apiRoute.suburbList + stateId;
    this.genericApiCall(url, con.suburbList);
  }

  getUsersContactInfo() {
    const url = this.apiRoute.usersContactInfo;
    this.genericApiCall(url, con.usersContactInfo, null, REQUEST_POST);
  }

  updateContactInfo(contactInfoData) {
    const url = this.apiRoute.updateContactInfo;
    this.genericApiCall(
      url,
      con.updateContactInfo,
      contactInfoData,
      REQUEST_POST
    );
  }

  deleteContactInfo(user_address_id) {
    let user_address_id_data = { user_address_id: user_address_id };
    const url = this.apiRoute.deleteContactInfo;
    this.genericApiCall(
      url,
      con.deleteContactInfo,
      user_address_id_data,
      REQUEST_POST
    );
  }

  getAccountSettings() {
    const url = this.apiRoute.getAccountSettings;
    this.genericApiCall(url, con.getAccountSettings, null, REQUEST_POST);
  }

  postAccountSettings(accountSettingsData) {
    const url = this.apiRoute.postAccountSettings;
    this.genericApiCall(
      url,
      con.postAccountSettings,
      accountSettingsData,
      REQUEST_POST
    );
  }

  getNotificationSettings() {
    const url = this.apiRoute.getNotificationSettings;
    this.genericApiCall(url, con.getNotificationSettings, null, REQUEST_POST);
  }

  postNotificationSettings(notificationSettingsData) {
    const url = this.apiRoute.postNotificationSettings;
    this.genericApiCall(
      url,
      con.postNotificationSettings,
      notificationSettingsData,
      REQUEST_POST
    );
  }

  /**
   * Public gear details
   * @param id
   */
  getPublicGearDetails(id: any) {
    const url = this.apiRoute.getPublicGearDetails + id;
    // this.genericApiCall(url, con.getPublicGearDetails, null, REQUEST_POST);
    return this.apiRoute.http.get(url);
  }

  /**
   * Private gear details
   * @param id
   */
  getPrivateGearDetails(id: any) {
    const url = this.apiRoute.getPrivateGearDetails + id;
    this.genericApiCall(url, con.getPrivateGearDetails, null, REQUEST_POST);
  }

  /**
   * Gear details TEST
   * ------------------------
   * For test data..
   * @param id
   */

  getSingleGearDetailsTest(id: any) {
    const url = this.apiRoute.getSingleGearDetails + id;
    const data = { token: this.auth.userData.auth_token };
    // this.genericApiCall(url, con.getPublicGearDetails, null, REQUEST_GET);
    return this.apiRoute.http.post(url, data);
  }

  deleteGearImage(user_gear_image_id: any) {
    let user_gear_image_id_param = { user_gear_image_id: user_gear_image_id };
    const url = this.apiRoute.deleteGearImage;
    this.genericApiCall(
      url,
      con.deleteGearImage,
      user_gear_image_id_param,
      REQUEST_POST
    );
  }

  updateProfile(userProfileData: UserEditProfileData) {
    const url = this.apiRoute.updateProfile;
    this.genericApiCall(url, con.updateProfile, userProfileData, REQUEST_POST);
  }

  uploadFiles(files: any) {
    const url = this.apiRoute.uploadFiles;
    this.genericApiCall(url, con.uplaodFiles, files, REQUEST_POST, false);
  }
  getInsuranceDetails() {
    const url = this.apiRoute.getInsuranceDetails;
    this.genericApiCall(url, con.getInsuranceDetails, null, REQUEST_POST);
  }
  postInsuranceDetails(insuranceDetails: any) {
    const url = this.apiRoute.postInsuranceDetails;
    this.genericApiCall(
      url,
      con.postInsuranceDetails,
      insuranceDetails,
      REQUEST_POST
    );
  }
  getAllGearCategory() {
    const url = this.apiRoute.getAllGearCategory;
    this.genericApiCall(url, con.getAllGearCategory);
  }
  getFeatureDetails(category_name) {
    const url = this.apiRoute.getCategoryFeature + "/" + category_name;
    this.genericApiCall(url, con.getFeatureDetails);
  }
  getAllGearSubCategory(gearCategoryId: string) {
    const url =
      this.apiRoute.getAllGearSubCategory +
      "?gear_category_id=" +
      gearCategoryId;
    this.genericApiCall(url, con.getAllGearSubCategory);
  }

  getAllGearBrand() {
    const url = this.apiRoute.getAllGearBrand;
    this.genericApiCall(url, con.getAllGearBrand);
  }

  getAllModelsOfBrand(brandId: string) {
    const url = this.apiRoute.getAllModelsOfBrand + "?brand_id=" + brandId;
    this.genericApiCall(url, con.getAllModelsOfBrand);
  }

  getModelDetails(modelDetails) {
    const url = this.apiRoute.getModelDetails;
    this.genericApiCall(url, con.getModelDetails, modelDetails, REQUEST_POST);
  }

  getSecurityDepositeStatus(categoryName) {
    const url = this.apiRoute.checkSecurityDeposite;
    this.genericApiCall(
      url,
      con.checkSecurityStatus,
      categoryName,
      REQUEST_POST
    );
  }

  addGearList(gearListData) {
    const url = this.apiRoute.addGearList;
    this.genericApiCall(url, con.addGearList, gearListData, REQUEST_POST);
  }

  updateGearList(gearListData) {
    const url = this.apiRoute.updateGearList;
    this.genericApiCall(url, con.updateGearList, gearListData, REQUEST_POST);
  }

  updateGearListManual(gearListData) {
    gearListData.token = this.auth.userData.auth_token;
    const url = this.apiRoute.updateGearList;
    // this.http.POST(url, con.updateGearList, gearListData, REQUEST_POST);
    return this.apiRoute.http.post(url, gearListData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  addGearImage(imagesObj) {
    const url = this.apiRoute.addGearImage;
    this.genericApiCall(url, con.addGearImage, imagesObj, REQUEST_POST, false);
  }
  getGearListItems() {
    const url = this.apiRoute.getGearListItems;
    this.genericApiCall(url, con.getGearListItems);
  }
  getGearListMyItems() {
    const url = this.apiRoute.getGearListMyItems;
    this.genericApiCall(url, con.getGearListMyItems, null, REQUEST_POST);
  }
  getFaqCategory() {
    const url = this.apiRoute.getFaqCategory;
    this.genericApiCall(url, con.getFaqCategory);
  }
  getFaqList(categoryId) {
    const url = this.apiRoute.getFaqList + categoryId;
    this.genericApiCall(url, con.getFaqList);
  }
  getFaqDetails(faqId) {
    const url = this.apiRoute.getFaqDetails + faqId;
    this.genericApiCall(url, con.getFaqDetails);
  }

  closeGear(token, user_gear_desc_id: any) {
    const url = this.apiRoute.closeUserListing;
    // this.genericApiCall(url, con.getPublicGearDetails, null, REQUEST_GET);
    const data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.apiRoute.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteGear(token, user_gear_desc_id: any) {
    const url = this.apiRoute.rentalOwnerDeleteGear;
    // this.genericApiCall(url, con.getPublicGearDetails, null, REQUEST_GET);
    const data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.apiRoute.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getProfileInfo(token, action = "", app_user_id = "") {
    const url = this.apiRoute.userInfoForProfile;
    // this.genericApiCall(url, con.getPublicGearDetails, null, REQUEST_GET);
    const data = { token: token, action: action, app_user_id: app_user_id };
    return this.apiRoute.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
