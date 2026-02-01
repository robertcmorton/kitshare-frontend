import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, EventEmitter, Output,  forwardRef, Renderer2, ViewChild } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const IMAGE_UPLOAD_VALUE_ACCESSOR : any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageUploadComponent),
  multi: true,
};

@Component({
  selector: 'kit-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  providers: [IMAGE_UPLOAD_VALUE_ACCESSOR],
})
export class ImageUploadComponent implements  ControlValueAccessor {

  uploadedFiles: Array<any> = [];
  public files: NgxFileDropEntry[] = [];
  public hasFile :string;
  @Output() upload: EventEmitter<any>;

  constructor(private _sanitizer: DomSanitizer) {

  }

  onChange(val) {
  }



  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;

    for (const droppedFile of files) {

      // Is it a file?

      if (droppedFile.fileEntry && droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.hasFile = 'hasFile';
          this.createLocalImageFileWrap([file]);
          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // it's a selected File
        this.createLocalImageFileWrap(this.files);
        // It was a directory (empty directories are added, otherwise only files)
        // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  private createLocalImageFileWrap(files) {

    for(let i= 0; i < files.length; i++) {
      let sanitized_file = this._sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(files[i]));

      setTimeout(_ => {
        this.uploadedFiles = [...this.uploadedFiles, sanitized_file];
      }, 1000);

    }

    this.change(files[0]);

  }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }


  writeValue( value : any ) : void {
    // const div = this.textarea.nativeElement;
    // this.renderer.setProperty(div, 'textContent', value);
  }

  registerOnChange( fn : any ) : void {
    this.onChange = fn;
  }

  change( $event ) {
    this.onChange($event);
  }

  setDisabledState( isDisabled : boolean ) : void {
    // const div = this.textarea.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    // this.renderer[action](div, 'disabled');
  }

  registerOnTouched(fn: any) : void {}

}
