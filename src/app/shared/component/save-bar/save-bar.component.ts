import { Component, OnInit, Input } from '@angular/core';
import { SaveBarService } from './save-bar.service';

@Component({
  selector: 'kit-save-bar',
  templateUrl: './save-bar.component.html',
  styleUrls: ['./save-bar.component.scss']
})
export class SaveBarComponent implements OnInit {
  @Input() config:any;


  constructor(private saveBar: SaveBarService) { }

  ngOnInit() {
  }

  onCancel() {
    let config = {
      status: 'cancel',
      action: 'cancel'
    }
    this.saveBar.triggerBar(config);
    this.saveBar.onSaveBarAction(config);

    // setTimeout(_ => {
    //   let anotherConfig = {
    //     action: 'close'
    //   };
    //   this.onCancel();
    // });

  }

  onSave() {
    let config = {
      action: 'save'
    };
    this.saveBar.onSaveBarAction(config);
    setTimeout(_ => {
      let anotherConfig = {
        action: 'close'
      };
      this.onCancel();
    })
  }

}
