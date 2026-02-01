import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { ApiRouterService } from "./api-router.service";

@Injectable()
export class LandingService {
  base_url: string;
  constructor(public api: ApiRouterService, public http: HttpClient) {
    this.base_url = this.api.apiUrl;
  }

  getHomePageUsers() {
    let url = this.api.getHomePageUsers;

    return this.http.get(url);
  }

  getSocialLinks() {
    let url = this.api.socailLinks;
    return this.http.get(url);
  }
}
