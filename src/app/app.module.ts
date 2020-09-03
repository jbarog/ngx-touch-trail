import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxTouchTrailModule } from 'ngx-touch-trail';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxTouchTrailModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
