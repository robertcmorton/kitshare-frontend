import { Injectable } from "@angular/core";

import { BehaviorSubject, Subject } from "rxjs";
import { ApiRouterService } from "../services/api-router.service";
import { GOOGLE_API_KEY } from "./../shared/constant";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { GlobalService } from "./global.service";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/internal/observable/of";

export interface SearchParams {
  limit?: string;
  per_page?: string;
  key_word?: string;
  gear_category_id?: string;
  manufacturer_id?: string;
  model_id?: string;
  order_by?: string; // 'ASC' | 'DESC';
  ks_gear_type_id?: string;
  owner_type_id?: string;
  ks_renter_type_id?: string;
  to_date?: string; // YYYY-MM-DD
  from_date?: string; // YYYY-MM-DD
  address?: string;
  searchby_fields?: string; // ?
  la?: string;
  lng?: string;
  radius?: string;
  sub_category_id?: string;
  order_by_fld?: string; // price&order_by=Desc /ASC
  suburb_name?: string;
  latNorth?: string;
  latSouth?: string;
  lngEast?: string;
  lngWest?: string;
}

export interface SearchResult {
  addresses: any[];
  items: any[];
  totalItems: number;
  offset: number;
  error: boolean;
}

const searchResultInitial: SearchResult = {
  addresses: [],
  items: [],
  totalItems: 0,
  offset: 0,
  error: false,
};

const searchParamsInitial: SearchParams = {
  limit: "24",
  order_by: null,
};

@Injectable()
export class SearchService {
  baseUrl: string;
  searchUrl: string;

  myMethod$: Observable<any>;
  private myMethodSubject = new BehaviorSubject<any>({});

  private searchTriggered = new BehaviorSubject<any>(null);
  searchTriggered$ = this.searchTriggered.asObservable();

  searchResults$ = new BehaviorSubject(searchResultInitial);

  searchParams: any = searchParamsInitial;

  categories$ = new BehaviorSubject([]);

  brands$ = new BehaviorSubject([]);

  gearTypes$ = new BehaviorSubject([]);

  ownerTypes$ = new BehaviorSubject([]);

  searchParams$ = new BehaviorSubject(this.searchParams);

  selectedItem$ = new BehaviorSubject(null);

  selectedAddressIndex$ = new BehaviorSubject(-1);

  resetSearch$ = new Subject();

  searchMethod(data) {
    this.myMethodSubject.next(data);
  }

  setSearch(status) {
    this.searchTriggered.next(status);
  }

  constructor(
    private http: HttpClient,
    public apiroute: ApiRouterService,
    private router: Router,
    private globalService: GlobalService
  ) {
    this.myMethod$ = this.myMethodSubject.asObservable();
    this.baseUrl = `${this.apiroute.apiUrl}Gear_listing/`;
    // this.searchUrl = `${this.baseUrl}Search`;
    this.searchUrl = `${this.apiroute.apiUrl}Search`;
    this.fetchCategories();
    this.fetchBrands();
    this.fetchGearTypes();
    this.fetchOwnerTypes();
  }

  fetchCategories() {
    const url = `${this.baseUrl}/CategoryListAPI`;
    this.http
      .get(url, {})
      .pipe(
        catchError((error) => {
          console.error(error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.categories$.next(res.result);
      });
  }

  fetchBrands() {
    const url = `${this.baseUrl}/brandlist`;
    this.http
      .get(url, {})
      .pipe(
        catchError((error) => {
          console.error(error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.brands$.next(res.result);
      });
  }

  fetchGearTypes() {
    const url = `${this.searchUrl}/fetchGearType`;
    this.http
      .get(url, {})
      .pipe(
        catchError((error) => {
          console.error(error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.gearTypes$.next(res.gear_type || []);
      });
  }

  fetchOwnerTypes() {
    const url = `${this.searchUrl}/fetchRenterType`;
    this.http
      .get(url, {})
      .pipe(
        catchError((error) => {
          console.error(error);
          return of([]);
        })
      )
      .subscribe((res: any) => {
        this.ownerTypes$.next(res.owner_data || []);
      });
  }

  setSearchParams(newParams: Partial<SearchParams>) {
    this.searchParams = { ...this.searchParams, ...newParams };
    Object.keys(this.searchParams).forEach(
      (key) => !this.searchParams[key] && delete this.searchParams[key]
    );
    this.searchParams$.next(this.searchParams);
  }

  callNormalSearch(hideLoader = false) {
    if (!hideLoader) {
      this.globalService.showLoader();
    }
    this.selectedAddressIndex$.next(-1);
    this.selectedItem$.next(null);
    this.http
      .get(this.searchUrl, { params: this.searchParams })
      .pipe(
        catchError((error) => {
          console.error(error);
          if (!hideLoader) {
            this.globalService.hideLoader();
          }
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (!hideLoader) {
          this.globalService.hideLoader();
        }
        window.scrollTo(0, 0); // scroll to top after search

        if (!res) {
          this.searchResults$.next({ ...searchResultInitial, error: true });
          return;
        }
        const extendedItems = this.extendSearchResult(res);
        // this.searchResults$.next(extendedItems);

        const uniqueAddresses = this.getUniqueAddresses(res.address_data);
        const extendedAddresses = Object.keys(uniqueAddresses).map((key) =>
          this.getAddressWithItems(uniqueAddresses[key], res.result)
        );
        this.searchResults$.next({
          offset: res.offset,
          totalItems: res.total_rows,
          addresses: extendedAddresses,
          items: extendedItems,
          error: false,
        });
        if (!this.router.url.includes("search")) {
          this.router.navigate(["search"]);
        }
      });
  }

  getAddressWithItems(address, searchResults) {
    return {
      ...address,
      gears: searchResults.filter(
        (result) => result.app_user_id === address.app_user_id
      ),
    };
  }

  getUniqueAddresses(addressData) {
    const addresses = {};
    if (!addressData) {
      return addresses;
    }
    addressData.forEach((data) => {
      addresses[data.app_user_id] = {
        lat: data.lat,
        lng: data.lng,
        app_user_id: data.app_user_id,
      };
    });
    return addresses;
  }

  extendSearchResult(res: any) {
    return res.result.map((item) => {
      const addressData = res.address_data.find(
        (data) => data.app_user_id === item.app_user_id
      );
      if (!addressData) {
        console.error(`Empty address data for item ${item.gear_name}`);
        return item;
      }
      return { ...item, addressData };
    });
  }

  subCategories(cat_id) {
    const url = this.baseUrl + "SubcategorylistByID?gear_category_id=" + cat_id;
    return this.http.get(url);
  }

  getGoogleAddress(address) {
    let data = { address: address };
    let url = `${this.baseUrl}/AddressAPi`;
    return this.http.post(url, data);
  }

  generateLatlong(address) {
    let url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      address +
      "&key=" +
      GOOGLE_API_KEY;
    return this.http.get(url);
  }

  resetSearchParams() {
    this.searchParams = {
      ...this.searchParams$.value,
    };
    if (this.searchParams["key_word"]) delete this.searchParams["key_word"];
    this.searchParams$.next(this.searchParams);
    this.resetSearch$.next(true);
    // this.callNormalSearch();
  }
}
