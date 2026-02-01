import { expand } from "rxjs/operators";
export const REQUEST_GET: string  = "getRequest";
export const REQUEST_POST: string = "postRequest";
export const RESULT_ERROR: string = "errorResponse";
import { environment } from '../../environments/environment';
/**** Google API key for development server *****/
/* export const GOOGLE_CLIENT_KEY: string = "1042560193789-gjr6gt1j6veupm3i2063b859i6iff4h2.apps.googleusercontent.com";
export const GOOGLE_API_KEY: string = "AIzaSyBkRKs_oho-255AnRz_geSap0EOtg4mEnM"; */

/*** Google API key for Live server ****/
export const GOOGLE_CLIENT_KEY: string = "558921154887-nm9gm2t0qrm5akpgscpj5meedkk9tuno.apps.googleusercontent.com";
export const GOOGLE_API_KEY: string = "AIzaSyCPU8keawNREwb4_tHM8D1mcw4bRuSEoUQ";
export const FB_CLIENT_KEY: string = "212709582679326";

export const userInfoForProfile: string = "userInfoForProfile";
export const userInfoGearData: string = "userInfoGearData";
export const userInfoProdutReviews: string = "userInfoProdutReviews";
export const userProfile: string = "userProfile";
export const ListUnavailableDates: string = "ListUnavailableDates";
export const rentalType: string = "rentalType";
export const professionType: string = "professionType";
export const updateProfile: string = "updateProfile";
export const stateList: string = "stateList";
export const suburbList: string = "suburbList";
export const usersContactInfo: string = "usersContactInfo";
export const updateContactInfo: string = "updateContactInfo";
export const deleteContactInfo: string = "deleteContactInfo";
export const getAccountSettings: string = "getAccountSettings";
export const postAccountSettings: string = "postAccountSettings";
export const getNotificationSettings: string = "getNotificationSettings";
export const postNotificationSettings: string = "postNotificationSettings";
export const getPublicGearDetails: string = "getPublicGearDetails";
export const getPrivateGearDetails: string = "getPrivateGearDetails";
export const getInsuranceDetails: string = "getInsuranceDetails";
export const postInsuranceDetails: string = "postInsuranceDetails";
export const uplaodFiles: string = "uplaodFiles";
export const getAllGearCategory: string = "getAllGearCategory";
export const getAllGearSubCategory: string = "getAllGearSubCategory";
export const getAllGearBrand: string = "getAllGearBrand";
export const getAllModelsOfBrand: string = "getAllModelsOfBrand";
export const getModelDetails: string = "getModelDetails";
export const addGearList: string = "addGearList";
export const checkSecurityStatus: string = "checkSecurityStatus";
export const addGearImage: string = "addGearImage";
export const getGearListItems: string = "getGearListItems";
export const getFeatureDetails: string = "getFeatureDetails";
export const getGearListMyItems: string = "getGearListMyItems";
export const getFaqCategory: string = "getFaqCategory";
export const getFaqList: string = "getFaqList";
export const getFaqDetails: string = "getFaqDetails";
export const deleteGearImage: string = "deleteGearImage";
export const updateGearList: string = "updateGearList";
// export const SITE_BASE_URL: string = "https://www.kitshare.com.au/"; // live server
// export const SITE_BASE_URL: string = "https://www.kitsharebeta.com.au/"; // beta live server
//export const SITE_BASE_URL: string = "https://www.kitshare.com.au/kitlab/"; // development
// export const SITE_BASE_URL: string = "http://www.inferasolz.com/kitshare/client/";

export const SITE_BASE_URL: string = `${environment.baseUrl}`; // development
