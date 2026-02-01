import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-not-exist',
  templateUrl: './page-not-exist.component.html',
  styleUrls: ['./page-not-exist.component.scss']
})
export class PageNotExistComponent implements OnInit {

  constructor(
      private route: ActivatedRoute,
      private router: Router
      ) {}

  ngOnInit() {
    this.router.navigate(['/']);
  }

}
