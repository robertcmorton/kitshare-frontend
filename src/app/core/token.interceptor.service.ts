import { AuthService } from "./../services/auth.service";
import { Router } from "@angular/router";
import { CoreService } from "./core.service";
import { Injectable } from "@angular/core";

import {
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
} from "@angular/common/http";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    public coreService: CoreService,
    public router: Router,
    private auth: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const currentUrl = window.location.href;
    const reqUrl = req.url;

    const token = localStorage.getItem("token");
    const isWhitelisted =
      currentUrl.includes("search") ||
      currentUrl.includes("faq") ||
      currentUrl.includes("login") ||
      currentUrl.includes("view-gear") ||
      currentUrl.includes("about-us") ||
      currentUrl.includes("trust-and-safety") ||
      currentUrl.includes("how-we-work") ||
      currentUrl.includes("what-is-kitshare") ||
      currentUrl.includes("privacy-policy") ||
      currentUrl.includes("customer-damage-waiver") ||
      currentUrl.includes("contact-us") ||
      currentUrl.includes("account-confirmation") ||
      currentUrl.includes("terms-and-conditions") ||
      currentUrl.includes("/");

    if (!token && !isWhitelisted && !reqUrl.includes("Search")) {
      localStorage.clear();
      this.auth.setUser(null);
      this.router.navigate(["/login"]);
    }
    return next.handle(req).pipe(tap((evt) => {}));
  }
}
