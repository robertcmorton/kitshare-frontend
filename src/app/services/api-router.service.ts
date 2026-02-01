import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
@Injectable()
export class ApiRouterService {
  public apiUrl: string = `${environment.baseUrl}`; // development server

  public registration: string = this.apiUrl + "registration";

  public checkEmail: string = this.apiUrl + "registration/check_email";

  public login: string = this.apiUrl + "login";

  public logout: string = this.apiUrl + "logout";

  public authUser: string = this.apiUrl + "Authuser";

  public googleLogin: string = this.apiUrl + "socialmedia_login/gmail";

  public facebookLogin: string = this.apiUrl + "socialmedia_login/facebook";

  public forgotPassword: string = this.apiUrl + "forget_password";

  public resetPassword: string = this.apiUrl + "resetpassword";

  public getUserFromToken: string = this.apiUrl + "user_info/user_credentials";

  public userInfoForProfile: string = this.apiUrl + "user_info/profile_data";

  /**
   * contain user unavailable dates data api for profile page
   */
  public userUnavailableDate: string =
    this.apiUrl + "user_info/ListUnavailableDates";
  /**
   * contain delete dates data api for profile page
   */
  public deleteUnavialableDate: string =
    this.apiUrl + "user_info/DeleteUnavailableDates";

  public getUserInfoId: string = this.apiUrl + "user_info/GetUserInfoId";

  /**
   * contain user profile data api for profile page
   */
  public userInfoForProfileByID: string =
    this.apiUrl + "user_info/UserProfileDetails";

  /**
   * contain gear data api
   */
  public userInfoGearData: string = this.apiUrl + "user_info/gear_data";

  /**
   * contain product review api
   */
  public userInfoProdutReviews: string =
    this.apiUrl + "user_info/product_reviews";

  /**
   * contain user profile data api for profile page
   */
  public userProfile: string = this.apiUrl + "profile/profile_info";

  /**
   * contain rental type api
   */
  public rentalType: string = this.apiUrl + "pre_fill/rentaltype";

  /**
   * contain profession type api
   */
  public professionType: string = this.apiUrl + "pre_fill/profession_types";

  /**
   * contain profile update api
   */
  public updateProfile: string = this.apiUrl + "user_info/modify_data";

  /**
   * contain state list type api
   */
  public stateList: string = this.apiUrl + "pre_fill/StateList";

  /**
   * contain Suburbs list type api
   */
  public suburbList: string = this.apiUrl + "pre_fill/SuburbsList?state_id=";

  /**
   * contain Suburbs list type api
   */
  public usersContactInfo: string =
    this.apiUrl + "ProfilepageDetails/GetUseraddress";

  public updateContactInfo: string =
    this.apiUrl + "ProfilepageDetails/Adduseraddress";

  public deleteContactInfo: string =
    this.apiUrl + "ProfilepageDetails/DeleteUserAddress";

  public getAccountSettings: string =
    this.apiUrl + "ProfilepageDetails/accounsettingget";

  public postAccountSettings: string =
    this.apiUrl + "ProfilepageDetails/accounsettingadd";

  public getNotificationSettings: string =
    this.apiUrl + "ProfilepageDetails/Getnotifcationlist";

  public postNotificationSettings: string =
    this.apiUrl + "ProfilepageDetails/UserNotificatonSetting";

  public getPublicGearDetails: string =
    this.apiUrl + "Gear_listing/SignleGearList/";

  public getPrivateGearDetails: string =
    this.apiUrl + "gear_listing/privategearDetails/";

  public getSingleGearDetails: string =
    this.apiUrl + "gear_listing/ViewSingleGearList/"; // added by N. Roy

  public closeUserListing: string =
    this.apiUrl + "Gear_listing/CloseUserListing"; // added by N. Roy

  public uploadFiles: string = this.apiUrl + "ProfilepageDetails/ImageUpload";
  // public uploadFiles: string = "http://localhost/testapi.php";

  public getInsuranceDetails: string =
    this.apiUrl + "ProfilepageDetails/getInsurance";

  public postInsuranceDetails: string =
    this.apiUrl + "ProfilepageDetails/addInsurance";

  public getAllGearCategory: string = this.apiUrl + "Gear_listing/Categorylist";

  public getAllGearSubCategory: string =
    this.apiUrl + "Gear_listing/Subcategorylist";

  public getAllGearBrand: string = this.apiUrl + "Gear_listing/brandlist";

  public getAllModelsOfBrand: string =
    this.apiUrl + "Gear_listing/getModallist";

  public getModelDetails: string = this.apiUrl + "Gear_listing/ModelDetails";

  public addGearList: string = this.apiUrl + "Gear_listing/addGearList";

  public updateGearList: string = this.apiUrl + "Gear_listing/EditListing";

  public addGearImage: string = this.apiUrl + "Gear_listing/GearImageUpload";

  public getGearListItems: string = this.apiUrl + "Gear_listing/GetGearlist";

  public getGearListMyItems: string =
    this.apiUrl + "Gear_listing/GetUserGearlist";

  public getFaqCategory: string = this.apiUrl + "Gear_listing/FAQCatgoryList";

  public getFaqList: string =
    this.apiUrl + "Gear_listing/GetFaqList?category_id=";

  public getFaqDetails: string =
    this.apiUrl + "Gear_listing/GetFaqDetails?faq_id=";

  public checkSecurityDeposite: string =
    this.apiUrl + "Gear_listing/checksecuritydeposite";

  public deleteGearImage: string = this.apiUrl + "Gear_listing/DeletGearImage";

  // fetch feature details with category name
  public getCategoryFeature: string =
    this.apiUrl + "Gear_listing/getCategoryFeature";

  /** Dashboard realted API URLS **/
  public rentalList: string = this.apiUrl + "RentalDashboard/RenterList";
  public rentalOwnerList: string = this.apiUrl + "RentalDashboard/OwnerList";
  public rentalOwnerOrderInvoice: string =
    this.apiUrl + "RentalDashboard/OrderInvoice";
  public rentalOwnerManagelist: string =
    this.apiUrl + "RentalDashboard/ManageListing";
  public rentalOwnerDeactivatelist: string =
    this.apiUrl + "RentalDashboard/DeactiveGear";
  public rentalOwnerDeleteGear: string =
    this.apiUrl + "RentalDashboard/DeleteGear";
  public rentalOwnerAddUnavailableDates: string =
    this.apiUrl + "RentalDashboard/AddUnavailbleDates";

  public rentalOwnerGetAllReviews: string =
    this.apiUrl + "RentalDashboard/Reviews";
  public rentalOwnerGetAllReference: string =
    this.apiUrl + "RentalDashboard/Reference";
  public rentalOwnerAddGearAddress: string =
    this.apiUrl + "RentalDashboard/AddGearAddress";
  public rentalOwnerRemoveGearAddress: string =
    this.apiUrl + "RentalDashboard/RemoveGearAddress";
  public rentalOwnerGearAddressList: string =
    this.apiUrl + "RentalDashboard/GearAddressList";
  public getAddressListByGear: string =
    this.apiUrl + "RentalDashboard/getAddressListByGear";

  public getOrderSummeryForOwner: string =
    this.apiUrl + "Gear_listing/OwnerOrderSummary";
  public getOrderSummeryForRenter: string =
    this.apiUrl + "Gear_listing/RentalsOrderSummary";
  public acceptRental: string =
    this.apiUrl + "Gear_listing/AcceptByOwnerGearRequest";
  public declineRental: string =
    this.apiUrl + "Gear_listing/RejectByOwnerGearRequest";
  public cancelRental: string =
    this.apiUrl + "Gear_listing/CancelOrderByRenter";
  public completeRental: string =
    this.apiUrl + "Gear_listing/OrderMarkCompletedRenter";
  public addGearViewCount: string =
    this.apiUrl + "Gear_listing/AddGearViewCount";

  public addGearReviews: string =
    this.apiUrl + "RentalDashboard/AddUserReviews";
  public getOwnerReviews: string =
    this.apiUrl + "RentalDashboard/GetOwnerReviews";
  public getRenterReview: string =
    this.apiUrl + "RentalDashboard/GetRenterReview";
  public reviewOrderList: string =
    this.apiUrl + "RentalDashboard/ReviewOrderList";

  // For messaging
  public getAllContactListForMessaging: string =
    this.apiUrl + "Message/ContactDetails";
  public getAllMessagingByRenterID: string =
    this.apiUrl + "Message/GetAllmessageList";
  public sendMessage: string = this.apiUrl + "Message/AddUserContact";
  public getMessageStatus: string = this.apiUrl + "Message/GetMessageStatus";
  public updateUserOnlineStatus: string =
    this.apiUrl + "Message/updateUserStatus";
  public searchMessageContacts: string = this.apiUrl + "Message/SearchUsers";
  public markChatSeen: string = this.apiUrl + "Message/MarkChatSeen";

  // Braintree payment
  public getClientToken: string = this.apiUrl + "BrainTree/Token";
  public completePayment: string = this.apiUrl + "BrainTree/Payment";
  public saveRecordToOrder: string = this.apiUrl + "Gear_listing/GearPayment";
  // Braintree payment for insurance
  public depositePayment: string = this.apiUrl + "BrainTree/DepositePayment";
  public saveInsuranceRecordToOrder: string =
    this.apiUrl + "Gear_listing/GearPayment2";

  // Home page
  public getHomePageProduct: string = this.apiUrl + "Gear_listing/homegears";

  // Account phone no verification
  public verifyPhone: string = this.apiUrl + "User_info/VerifyMobile";
  public verifyOtp: string = this.apiUrl + "User_info/VerifyOTP";
  public addUnavailbleDates: string =
    this.apiUrl + "User_info/AddUnavailbleDates";

  public renterCheckListUpload: string =
    this.apiUrl + "Gear_listing/RenterCheckListUpload";
  public ownerCheckListUpload: string =
    this.apiUrl + "Gear_listing/OwnerCheckListUpload";

  public ownerCheckListList: string =
    this.apiUrl + "Gear_listing/OwnerCheckListList";
  public RenterCheckListList: string =
    this.apiUrl + "Gear_listing/RenterCheckListList";

  // Favourites
  public addTofavourite: string = this.apiUrl + "user_info/Addfavourite";
  public getFavouriteList: string = this.apiUrl + "user_info/favouriteList";
  public removeFromFavourite: string =
    this.apiUrl + "user_info/Removefavourite";

  public makeGearPublicPrivate: string =
    this.apiUrl + "RentalDashboard/GearPublicPrivate ";

  // Home page / Landing page
  public getHomePageUsers: string =
    this.apiUrl + "Gear_listing/homeUserDetails";

  // digital key API
  public getDigitalIdKey: string =
    this.apiUrl + "ProfilepageDetails/DigitalIdDetails";

  // CMS page API urls
  public pageDetails: string = this.apiUrl + "Gear_listing/PageDetails";

  // Social links
  public socailLinks: string = this.apiUrl + "Gear_listing/SocailLinks";

  // Connect payout
  public connectPayout: string = this.apiUrl + "user_info/ConnectPayoutAdd";
  public getBankList: string = this.apiUrl + "user_info/GetBankList";
  public connectPayoutDetails: string =
    this.apiUrl + "user_info/GetUserBankDetails";

  // Damage issue
  public addDamageIssue: string = this.apiUrl + "Gear_listing/DamageIssue";
  public getDamageIssueList: string =
    this.apiUrl + "Gear_listing/GetOrderIssueList";
  public updateDamageIssue: string =
    this.apiUrl + "Gear_listing/EditIssueListings";

  public addUserRating: string = this.apiUrl + "Gear_listing/AddUserRating";

  // Send message to owner
  public sendMessageToOwner: string = this.apiUrl + "user_info/ContactOwner";
  public getReplyMessage: string = this.apiUrl + "user_info/GetReplyMessage";
  public replyMessage: string = this.apiUrl + "user_info/ReplyMessage";
  public unreadMessage: string = this.apiUrl + "Gear_listing/UnreadMessage";

  public userCheckoutCheck: string =
    this.apiUrl + "Gear_listing/Usercheckoutcheck";
  public cartunavailableseDates: string =
    this.apiUrl + "Gear_listing/CartunavailableseDates";

  public checkduplicateUserName: string =
    this.apiUrl + "user_info/CheckduplicateUserName";

  /**
   * manage dependency injection
   * @param http Http
   */
  constructor(public http: HttpClient) {}

  /**
   * this will add header on each http request
   */
  getHeader(json: boolean = true) {
    let headers = new HttpHeaders();
    if (json === true) {
      headers.append("Content-Type", "application/json");
    } else {
      // headers.append("Content-Type", "multipart/form-data");
    }
    return headers;
  }
}
