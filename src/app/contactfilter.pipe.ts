import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contactfilter'
})
export class ContactfilterPipe implements PipeTransform {

  transform(items: Array<any>): Array<any> {
  	    return items.filter(item => item.user_details.length > 0);
    }

}
