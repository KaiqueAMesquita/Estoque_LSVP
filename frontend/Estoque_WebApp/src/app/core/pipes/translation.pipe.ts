import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../translation/translation.service';  
@Pipe({
  name: 'translation'
})
export class TranslationPipe implements PipeTransform {
   translation = inject(TranslationService);

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.translation.translate(value as string);
  }

}
