import { Component, Input, Output, EventEmitter } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { PdfViewComponent } from './pdf-view/pdf-view.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'docu-index';
  currentPageNumber: number = 1;
  docType: number = 1;

  constructor(private http: HttpClient) {}

  changeCurrentPageNumber(newPageNumber: number) {
    this.currentPageNumber = newPageNumber;
  }

  onDropdownChange(event: any, pdfAPI: any, getFieldsAPI: any) {
    this.docType = parseInt(event.target.value);
    this.currentPageNumber = 1;
    console.log('callAPI from onDropdownChange: ', pdfAPI);
    pdfAPI(this.docType);
    getFieldsAPI(this.docType);
  }
}
