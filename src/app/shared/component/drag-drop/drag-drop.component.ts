import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { CdkDragEnter, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "kit-drag-drop",
  templateUrl: "./drag-drop.component.html",
  styleUrls: ["./drag-drop.component.scss"],
})
export class DragDropComponent implements OnInit {
  @Input() list;
  @Input() isEdit;
  @Output() removeImage = new EventEmitter();
  @Output() onFileChange = new EventEmitter();
  @Output() onImgDragged = new EventEmitter();
  @Output() sortImage = new EventEmitter();
  constructor() {}
  ngOnInit(): void {}
  remove(i, image) {
    let dataToSend = {};
    dataToSend["index"] = i;
    dataToSend["type"] = image.type;
    if (this.isEdit) {
      dataToSend["imageId"] = image.user_gear_image_id;
    }
    this.removeImage.emit(dataToSend);
  }
  drop(event) {
    console.log(event);
    moveItemInArray(
      this.list,
      event.previousContainer.data,
      event.container.data
    );
  }
  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector(".cdk-drag-placeholder");
    phContainer.removeChild(phElement);
    phContainer.parentElement.insertBefore(phElement, phContainer);
    moveItemInArray(this.list, dragIndex, dropIndex);
    this.sortImage.emit(this.list);
  }
  onFileChanged(event) {
    this.onFileChange.emit(event);
  }
}
