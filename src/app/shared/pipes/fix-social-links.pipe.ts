import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixSocial'
})

export class FixSocialLinksPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let url = value;
    if (value !== undefined) {
      if(!value.includes('http') ) {
        url = `https://${url}`;
      }
    }
    return url;
  }
}
