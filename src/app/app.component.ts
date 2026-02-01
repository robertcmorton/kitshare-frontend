import { environment } from './../environments/environment';
import { AppService } from './app.service';
import { Component, HostListener, Renderer2, OnInit, ChangeDetectorRef, AfterContentChecked } from "@angular/core";
import { GlobalService } from "./services/global.service";
import { AuthService } from "./services/auth.service";
import { CartService } from "./services/cart.service";
import { DashboardService } from "./services/dashboard.service";
import { SaveBarService } from './shared/component/save-bar/save-bar.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({height: 50, opacity: 1}),
        animate('0.2s ease-out', style({height: 50, opacity: 1}))
      ]),
      transition(':leave', [
        style({height: 50, opacity: 1}),
        animate('0.2s ease-out', style({height: 0, opacity: 0}))
      ])
    ])
  ]
})

/**
 * main component functionality
 */
export class AppComponent implements OnInit, AfterContentChecked {
  innerWidth: any;
  public loaderState: boolean = false;
  public verifyUserState: boolean = false;
  desktopBreakpoint = environment.breakpoints.desktop;
  saveBarConfig: any = null;

  ngAfterContentChecked() : void {
    this.cdRef.detectChanges();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    this.AppService.setScreenSize(this.innerWidth);
  }

  observeLS() {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    this.auth.setUser(user);
  }

  observeSaveBarStream() {
      this.savebar.TRIGGER_BAR_ACTION$.subscribe(config => {
        this.saveBarConfig = config;
        // debugger;
        this.cdRef.detectChanges();
      })
  }

  ngOnInit() {
    this.observeLS();
    this.observeSaveBarStream();
    this.innerWidth = window.innerWidth;
    this.AppService.setScreenSize(this.innerWidth);

    this.AppService.onResize$.subscribe(size => {
      if(size <= this.desktopBreakpoint ) {
        this.renderer.removeAttribute(document.body, 'class');
        this.renderer.addClass(document.body, 'isMobile')
      }else {
        this.renderer.removeAttribute(document.body, 'class');
        this.renderer.addClass(document.body, 'isDesktop');
      }
    });

    this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          window.scrollTo(0, 0);
        });
  }

  constructor(
    public global: GlobalService,
    private auth: AuthService,
    private cartService: CartService,
    private dashboard: DashboardService,
    private AppService: AppService,
    private renderer: Renderer2,
    private savebar: SaveBarService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {
    //this.verifyUserState = true;
    this.global.loaderState.subscribe(state => {
      this.loaderState = state;
    });
    this.global.verifyState.subscribe(state => {
      this.verifyUserState = state;
    });
  }

  loginNow() {
      this.verifyUserState = false;
  }
}
