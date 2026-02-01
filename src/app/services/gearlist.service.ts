import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiRouterService } from "./api-router.service";
import { map } from "rxjs/operators";

@Injectable()
export class GearlistService {
  base_url: string;
  constructor(private http: HttpClient, public api: ApiRouterService) {
    this.base_url = this.api.apiUrl + "Gear_listing/";
  }

  checkSecurity(category_name) {
    let url = this.base_url + "checksecuritydeposite";

    let data = {
      category_name: encodeURIComponent(encodeURIComponent(category_name)),
    };
    return this.http.post(url, data);
  }

  getAverageValue(sub_category_name) {
    let url =
      this.base_url +
      "Gearaveragevalue/" +
      encodeURIComponent(encodeURIComponent(sub_category_name));
    return this.http.get(url);
  }

  getAllGearSubCategory(gearCategoryId: string) {
    const url =
      this.api.getAllGearSubCategory +
      "?gear_category_id=" +
      encodeURIComponent(encodeURIComponent(gearCategoryId));
    return this.http.get(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getFeatureDetails(category_name) {
    const url = this.api.getCategoryFeature + "/" + category_name;
    return this.http.get(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getModelDetails(modelDetails) {
    const url = this.api.getModelDetails;
    return this.http.post(url, modelDetails).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
