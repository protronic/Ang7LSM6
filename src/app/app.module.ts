import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Lsm6Service } from './lsm6.service';
import { DimmPipe } from './gui/dimm-slider/dimm.pipe';
import { DimmSliderComponent } from './gui/dimm-slider/dimm-slider.component';
import { JsonCompactPipe } from './jsonlib/json-compact.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ProSliderComponent } from './gui/pro-slider/pro-slider.component';
import { ProSelectComponent } from './gui/pro-select/pro-select.component';
import { FlagsPipe } from './gui/flags.pipe';
import { HttpClientModule } from '@angular/common/http';
import { PrettyPrintPipe } from './jsonlib/pretty-print.pipe';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    DimmPipe,
    DimmSliderComponent,
    JsonCompactPipe,
    ProSliderComponent,
    ProSelectComponent,
    FlagsPipe,
    PrettyPrintPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgSelectModule,
    NgxSmartModalModule.forRoot()
  ],
  providers: [Lsm6Service, DimmPipe],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() { }
}
