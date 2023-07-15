import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PdfViewComponent } from './admin/pdf-view/pdf-view.component';
import { FormFieldsComponent } from './admin/form-fields/form-fields.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { TableComponent } from './analysis-page/table/table.component';
import { AdminComponent } from './admin/admin.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { PdfViewSuComponent } from './super-admin/pdf-view-su/pdf-view-su.component';
import { FormsFieldsSuComponent } from './super-admin/forms-fields-su/forms-fields-su.component';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/reducers/app.reducer';
import { SpinnerComponent } from './spinner/spinner.component';
import { AnalysisComponent } from './analysis-page/analysis/analysis.component';
import { ReportsPageComponent } from './reports/reports-page/reports-page.component';
import { ReportsFormComponent } from './reports/reports-form/reports-form.component';
import { ReportsDownloadComponent } from './reports/reports-download/reports-download.component';
import { AnalysisTableComponent } from './analysis-page/analysis-table/analysis-table.component';

@NgModule({
  declarations: [
    AppComponent,
    PdfViewComponent,
    FormFieldsComponent,
    TableComponent,
    AdminComponent,
    SuperAdminComponent,
    PdfViewSuComponent,
    FormsFieldsSuComponent,
    SpinnerComponent,
    AnalysisComponent,
    ReportsPageComponent,
    ReportsFormComponent,
    ReportsDownloadComponent,
    AnalysisTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxExtendedPdfViewerModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ app: appReducer })
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
