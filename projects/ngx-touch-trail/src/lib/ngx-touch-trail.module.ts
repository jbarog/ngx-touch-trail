import { NgModule } from '@angular/core';
import { TouchTrailDirective } from './touch-trail.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [TouchTrailDirective],
  imports: [BrowserAnimationsModule],
  exports: [TouchTrailDirective]
})
export class NgxTouchTrailModule { }
