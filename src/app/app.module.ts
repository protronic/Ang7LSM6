import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { Lsm6Service } from './lsm6.service';
import { DimmPipe } from './gui/dimm-slider/dimm.pipe';
import { DimmSliderComponent } from './gui/dimm-slider/dimm-slider.component';
import { JsonCompactPipe } from './jsonlib/json-compact.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ProSliderComponent } from './gui/pro-slider/pro-slider.component';
import { ProSelectComponent } from './gui/pro-select/pro-select.component';
import { FlagsPipe } from './gui/flags.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DimmPipe,
    DimmSliderComponent,
    JsonCompactPipe,
    ProSliderComponent,
    ProSelectComponent,
    FlagsPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgSelectModule,
    BrowserAnimationsModule,
    InputTextModule,
    FontAwesomeModule
  ],
  providers: [Lsm6Service, DimmPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(fas, far);
  }
}
