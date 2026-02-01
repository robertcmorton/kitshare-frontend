import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kit-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  @Input() loggedIn: any;
  @Input() avatar: any;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
  }

}
