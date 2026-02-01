
import { updateProfile } from "./../../shared/constant";
import { BaseComponent } from "../../base.componant";
import { BaseService } from "./../../services/base.service";
import { Component, OnInit } from '@angular/core';
import { userProfile, rentalType, professionType } from "../../shared/constant";
import {
  UserEditProfileData,
  RentalTypeOption,
  ProfessionTypeOption
} from "../../shared/models/user-profile";

@Component({
  selector: 'app-connect-social',
  templateUrl: './connect-social.component.html',
  styleUrls: ['./connect-social.component.css']
})
export class ConnectSocialComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
