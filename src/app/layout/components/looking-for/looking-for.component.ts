import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kit-looking-for',
  templateUrl: './looking-for.component.html',
  styleUrls: ['./looking-for.component.scss']
})
export class LookingForComponent implements OnInit {

  @Output() searchQuery: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onKeyUp(event) {
    const value = event.target.value;
    this.searchQuery.emit(value);
  }

}
