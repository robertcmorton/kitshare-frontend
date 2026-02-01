import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AuthService } from "../../../services/auth.service";
import { tap, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "kit-author-card",
  templateUrl: "./author-card.component.html",
  styleUrls: ["./author-card.component.scss"],
})
export class AuthorCardComponent implements OnInit {
  @Input() data: any;
  @Input() ratings: any;
  @Input() my_gear: boolean;
  @Output() contactClick: EventEmitter<any> = new EventEmitter();

  user$: Observable<any>;
  contactAuthorClickSubject = new Subject<any>();
  contactAuthorAction$ = this.contactAuthorClickSubject.asObservable();

  decideUserFlow(user) {
    if (!user) {
      this.dataService.openSnackBar(
        "You must be logged-in to Contact the Owner. Redirecting...",
        "snack-error"
      );
      setTimeout((_) => {
        this.router.navigate(["/login"]);
      }, 3500);
    } else {
      this.contactClick.emit(true);
    }
  }
  constructor(
    private auth: AuthService,
    private dataService: DataService,
    private router: Router
  ) {
    this.user$ = this.auth.loggedInUser$;

    this.contactAuthorAction$
      .pipe(switchMap((_) => this.user$))
      .subscribe((user) => {
        this.decideUserFlow(user);
      });
  }

  ngOnInit() {}

  onClick() {}
}
