import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 *
 */
@Pipe({
  name: 'safe',
  standalone: false,
})
export class SafePipe implements PipeTransform {
  /**
   *
   * @param sanitizer
   */
  constructor(private sanitizer: DomSanitizer) {}

  /**
   *
   * @param url
   * @param type
   * @returns SafeResourceUrl
   */
  transform(url: string, type: string): SafeResourceUrl {
    if (type === 'resourceUrl') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return url;
  }
}
