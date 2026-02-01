import {
  Component,
  OnInit,
  NgZone,
  AfterViewInit,
  AfterViewChecked,
  AfterContentInit,
  AfterContentChecked,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { SITE_BASE_URL } from "../../shared/constant";
import { Router } from "@angular/router";
import { BaseApiService } from "../../services/base-api.service";
import { DashboardService } from "../../services/dashboard.service";

// import {} from '../../../assets/js/digitalid';

@Component({
  selector: "app-digital-id",
  templateUrl: "./digital-id.component.html",
  styleUrls: ["./digital-id.component.scss"],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
})
export class DigitalIdComponent
  implements
    OnInit,
    AfterViewInit,
    AfterViewChecked,
    AfterContentInit,
    AfterContentChecked
{
  window: any = window;
  token: string;
  digital_id_sdk_url: string;
  digital_id_client_id: string;

  public _reload = true;

  is_digital_verified: boolean;

  constructor(
    private zone: NgZone,
    private elementRef: ElementRef,
    private location: Location,
    private router: Router,
    private baseapi: BaseApiService,
    private dashboard: DashboardService,
    private ref: ChangeDetectorRef,
    public auth: AuthService
  ) {
    this.token = this.auth.userData.auth_token;
    this.digital_id_sdk_url = "";
    this.digital_id_client_id = "";
    this.is_digital_verified = false;
  }

  newDigitalId() {
    // this.getProfileInfo();
    /* let digital_id_from_localstorage = localStorage.getItem('digital_id');
    let digital_id_parsed   = JSON.parse(digital_id_from_localstorage); */
    // this.digital_id_sdk_url = digital_id_parsed.digitalId_url

    const script = document.createElement("script");

    script.src = this.digital_id_sdk_url;
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      /* Verify with Digital iD */

      // @ts-ignore
      (window as any).digitalId.init({
        clientId: this.digital_id_client_id,
        uxMode: "popup",
        onLoadComplete() {},
        onComplete(response) {
          // this.is_digital_verified = true;

          let userDetails = localStorage.getItem("userDetails");
          let parsed_Userdetails = JSON.parse(userDetails);
          let token = parsed_Userdetails.auth_token;
          /* console.log(`Grant code: ${response}`);
          console.log(`Grant code: ${JSON.parse(response)}`);
          console.log(`Grant code: ${response.json()}`);
          console.log(`Grant code: ${response.code}`);*/

          let data = {};

          if (response.error != undefined && response.error != "") {
          } else {
            if (response.code != undefined) {
              data = {
                token: token,
                code: response.code,
                transaction_id: response.transaction_id,
                status: "Y",
                message: "verification success",
              };
              document.getElementById("digitalid-verify").remove();
              let x = document.getElementById("hidden-verified");
              x.style.display = "block";
            }
            if (response.error != undefined) {
              if (response.transaction_id == undefined) {
                response.transaction_id = "";
              }
              data = {
                token: token,
                transaction_id: response.transaction_id,
                status: "N",
                message: response.error_description,
              };
            }

            // console.log(data);
            // const digiVeriUrl = 'http://www.inferasolz.com/kitshare/server/Gear_listing/digitalIdVerfication';
            // const digiVeriUrl = 'https://www.kitshare.com.au/server/Gear_listing/digitalIdVerfication';  // live
            // const digiVeriUrl = 'https://www.kitsharebeta.com.au/server/Gear_listing/digitalIdVerfication';  // beta live
            const digiVeriUrl =
              SITE_BASE_URL + "Gear_listing/digitalIdVerfication"; // development
            /* console.log(JSON.parse(response));
              console.log(`Grant code: ${response.code}`); */
            fetch(digiVeriUrl, {
              method: "POST",
              body: JSON.stringify(data),
            })
              .then((response) => response.json())
              .then((json) => {});
          }
        },
        onClick(opts) {},
        onKeepAlive() {},
      });
    };
  }

  ngOnInit() {
    this.dashboard.getDigitalKey().subscribe((res: any) => {
      this.digital_id_sdk_url = res.result.digitalId_url;
      this.digital_id_client_id = res.result.digitalId_clientid;

      this.getProfileInfo();
      /* let digital_id = {
					digitalId_url : res.result.digitalId_url,
					digitalId_clientid :  res.result.digitalId_clientid
				} */
    });

    // this.getProfileInfo();
  }

  getProfileInfo() {
    this.baseapi.getProfileInfo(this.token).subscribe((res: any) => {
      if (res.result[0].aus_post_verified == "Y") {
        this.is_digital_verified = true;
        // this.newDigitalId();
      } else {
        this.newDigitalId();
      }
    });
  }

  ngAfterViewInit() {
    /*
    this.getProfileInfo();

    this.loadDigitalSdk();
    setTimeout(() => {
      this.zone.run(() => {
        console.log('Running with ng zone');
        this.loadDigitalJs();
        console.log('Reload true');
      });

    }, 1000);
    */
  }

  ngAfterViewChecked() {}

  ngAfterContentInit() {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
    /* this.loadDigitalSdk();
    setTimeout(() => {
      this.loadDigitalJs();

    }, 2000); */
  }

  ngAfterContentChecked() {}

  /*
  ngAfterViewInit() {

    console.log(this.router.url);




    this.zone.runOutsideAngular(()=>{
      //call function
      this.window.digitalIdAsyncInit = function () {
        digitalId.init({
          clientId : 'ctid4o1mEByVe7orZMcoxdOKph',
          onComplete: this.onComplete()
        });
      };
    });
    this.zone.runOutsideAngular(() => {
      console.log('running zone js..');
      this.window.digitalIdAsyncInit = function (digitalId: any) {
        digitalId.init({
          clientId : 'ctid4o1mEByVe7orZMcoxdOKph',
          onComplete: this.onComplete()
        });
      };
    });

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "./../../../assets/custom.js";
    this.elementRef.nativeElement.appendChild(s);

    //this.loadScripts();
    this.loadDigitalSdk();
    this.loadDigitalJs();
    //this.loadScripts();

  }*/

  public async loadDigitalSdk() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement("script");
    script.innerHTML = "";
    script.src = this.digital_id_sdk_url;
    script.async = false;
    /* script.defer = true; */
    script.charset = "utf-8";
    body.appendChild(script);
  }

  public loadDigitalJs() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement("script");
    script.innerHTML = "";
    script.src = SITE_BASE_URL + "assets/js/digitalid.js";

    // script.src = '../../../assets/js/digitalid.js';
    script.type = "text/javascript";
    script.async = false;
    script.charset = "utf-8";
    body.appendChild(script);
  }

  loadScripts() {
    const dynamicScripts = ["../../../assets/js/digitalid.js"];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement("script");
      node.src = dynamicScripts[i];
      node.type = "text/javascript";
      node.async = false;
      node.charset = "utf-8";
      document.getElementsByTagName("head")[0].appendChild(node);
    }
  }

  onComplete(response) {
    let data = {
      token: this.token,
      code: response.code,
    };
    // The OAuth grant code you need to pass to your backend;
    fetch(SITE_BASE_URL + "Gear_listing/digitalIdVerfication", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res)
      .then((json) => {});
  }
}
