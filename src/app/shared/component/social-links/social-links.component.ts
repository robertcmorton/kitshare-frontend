import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kit-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss']
})
export class SocialLinksComponent implements OnInit {

  @Input() userdata: any;
  social = ['facebook_link', 'twitter_link', 'youtube_link', 'linkedin_link', 'instagram_link', 'user_website', 'imdb_link', 'vimeo_link'];
  socialLinks = [];

  constructor() { }

  curateLinks() {
    let social_keys = Object.keys(this.userdata);
    this.social.map(item => {
      if (social_keys.includes(item) && this.userdata[item] !== '') {
        let obj = {
          item,
          link: this.userdata[item],
          label : item.split('_')[0]
        };
        this.socialLinks.push(obj);
      }
    });
  }

  ngOnChanges() {
    if(Object.keys(this.userdata).length > 0) {
      this.curateLinks();
    }
  }

  ngOnInit() {


  }

}
