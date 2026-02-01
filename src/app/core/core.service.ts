import { map } from "rxjs/operators";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { ApiRouterService } from "./../services/api-router.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CoreService {
  constructor(public apiRoute: ApiRouterService) {}

  getCookieStatus() {
    const url: string = this.apiRoute.authUser;

    return this.apiRoute.http.get(url).pipe(
      map((res) => {
        const cookie_result = JSON.parse(res["_body"]);
        return cookie_result;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
