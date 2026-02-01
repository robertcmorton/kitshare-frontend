import { AuthService } from './../services/auth.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UserProfileService {

  BASE_URL: string = environment.baseUrl;
  token: string;

  inactiveInsurance: Subject<any> = new Subject();
  inactiveInsuranceAction$ = this.inactiveInsurance.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) { }

  setInsuranceInactive(data) {
    this.inactiveInsurance.next(data);
  }

  makeAddrDefault(id) {
    let token = this.auth.userData.auth_token;
    let data = {
      token,
      user_address_id: id,
      is_default: true,
    }
    return this.http.put(`${this.BASE_URL}ProfilepageDetails/modifyAddress`, data);
  }

  changeActiveInsurance(payload) {
    let token = this.auth.userData.auth_token;
    let data = {
      token,
      user_insurance_proof_id: payload.user_insurance_proof_id,
      is_active: false,
    }

    return this.http.post(`${this.BASE_URL}ProfilepageDetails/ChangeInsuranceStatus`, data);
  }

  addInsurance(payload) {
    let token = this.auth.userData.auth_token;

    let processed_payload = {
      ...payload,
      insurance_data: {
        ...payload['insurance_data'],
      }
    };

    delete processed_payload['insurance_data']['snapshot'];
    delete processed_payload['insurance_data']['insurance_image_url'];
    delete processed_payload['owner_image'];

    let data = Object.assign({}, processed_payload, {token});
    let uploadData = new FormData();
    uploadData.append("token", data.token);
    uploadData.append("insurance_data", JSON.stringify(data.insurance_data));
    uploadData.append("image", data.image);

    return this.http.post(`${this.BASE_URL}Gear_listing/AddInsuranceData`, uploadData);
  }

  fetchInsuranceList() {
    let token = this.auth.userData.auth_token;

    let payload = {
      token,

    };
    return this.http.post(`${this.BASE_URL}ProfilepageDetails/getInsurance`, payload);
  }

  addInsuranceImage(image) {
    let token = this.auth.userData.auth_token;

    let payload = {
      token,
      type: 'owner_insurance',
      image
    };

    let uploadData = new FormData();
    // uploadData.append("image[]", eachFile, eachFile.name);
    uploadData.append("token", token);
    uploadData.append("type", 'owner_insurance');
    uploadData.append("image", image);



    return this.http.post(`${this.BASE_URL}server/ProfilepageDetails/ImageUpload`, uploadData);

  }

  addAddress(addresses) {
    let data = [...addresses];

    let token = this.auth.userData.auth_token;

    let payload = {
      token,
      data
    };
    return this.http.post(`${this.BASE_URL}ProfilepageDetails/Adduseraddress`, payload);
  }

  getSavedAddresses() {
    let token = this.auth.userData.auth_token;

    let payload = {
      token,
    };
    return this.http.post(`${this.BASE_URL}ProfilepageDetails/GetUseraddress`, payload);
  }

  deleteAddress(addressId) {
    let token = this.auth.userData.auth_token;

    let payload = {
      token,
      user_address_id: addressId
    };
    return this.http.post(`${this.BASE_URL}ProfilepageDetails/DeleteUserAddress`, payload);
  }
  removeInsuracneById(user_insurance_proof_id) {
    let token = this.auth.userData.auth_token;
    let payload = {
      token,
      user_insurance_proof_id:user_insurance_proof_id
    }
    return this.http.post(`${this.BASE_URL}ProfilepageDetails/removeInsurance`, payload);
  }
}
