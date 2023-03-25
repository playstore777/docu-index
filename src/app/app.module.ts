import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
import { FormFieldsComponent } from './form-fields/form-fields.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { TableComponent } from './analysis-page/table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    PdfViewComponent,
    FormFieldsComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxExtendedPdfViewerModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
