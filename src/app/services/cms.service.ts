import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiRouterService } from './api-router.service';

@Injectable()
export class CmsService {

  base_url: string;
  constructor(public api: ApiRouterService, public http: HttpClient) {

    this.base_url = this.api.apiUrl;
  }

  getPagedetails(slug) {
    let apiUrl = this.api.pageDetails + '/' + slug;
    return this.http.get(apiUrl);
  }

}
