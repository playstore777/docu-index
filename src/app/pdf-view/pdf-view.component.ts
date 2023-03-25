import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css'],
})

export class PdfViewComponent implements OnInit {
  @Input() currentPageNumber: number = 1;
  @Output() pageNumber = new EventEmitter<number>();
  @Input() docType: number = 1;
  base64String: string = '';
  @Output() getFieldsAPICallback = new EventEmitter<number>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.pdfAPI(this.docType);
  }

  pdfAPI(docTypeValue: any) {
    if (docTypeValue.target) {
      docTypeValue = docTypeValue.target.value
    }
    let headers = new HttpHeaders({
      'Accept': '*/*'
    });
    this.http
			.get<any>(`https://pdfanalysis.azurewebsites.net/api/Analysis/GetDocument?data=${docTypeValue}`, {
        headers: headers
      })
			.subscribe(data => {
        this.updateBase64String(data[0].doc_value);
			});
  }

  updateBase64String(base64: string) {
    this.base64String = base64;
  }

  pageChange(event: any) {
    this.pageNumber.emit(event);
    this.getFieldsAPICallback.emit(event);
  }
}
