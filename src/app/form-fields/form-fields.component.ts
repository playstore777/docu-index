import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.css'],
})
export class FormFieldsComponent implements OnInit {
  @Input() currentPageNumber = 1;
  @Input() docType = 0;
  allSelectedReview: boolean = false;
  allSelectedMandatory: boolean = false;

  data: any = [];
  addFieldButton = document.querySelector('.bottom-toolbar .add');
  rows = document.getElementsByClassName('rows');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getFieldsAPI(this.currentPageNumber);
  }

  getFieldsAPI(page: any) {
    this.allSelectedReview = false;
    if (page.target) {
      this.docType = page.target.value;
      page = 1;
    }
    let headers = new HttpHeaders({
      'Accept': '*/*'
    });
    this.http
			.get<any>(`https://pdfanalysis.azurewebsites.net/api/Analysis/GetDocumentFields?Doc_Id=${this.docType}&page=${page}`, {
        headers: headers
      })
			.subscribe(res => {
        this.data = [];
        console.log('response from form-fields: ', this.data);
        res.forEach((element: any) => {
          let obj = {
            fieldNumber: element.field_no,
            pageNumber: element.page_no,
            imgSrc: element.filed_value,
            isSelectedReview: false,
            isSelectedMandatory: false,
          }
          this.data.push(obj);
        });
			});
  }

  addField() {
    let selectedFields = this.data.filter((element: any) => element.isSelectedReview === true);
    console.log('from onSubmit(): ', selectedFields);
    selectedFields.forEach((item: any) => {
      let obj = {
        "doc_no": this.docType,
        "page_no": item.pageNumber,
        "field_no": item.fieldNumber,
        "mandatory": "Y"
      }

      console.log('object to be sent: ', JSON.stringify(obj));

      let headers = new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json'
      });
      this.http
        .post<any>(`https://pdfanalysis.azurewebsites.net/api/Analysis/UpdateDocumentFields`, obj, {
          headers: headers
        }).subscribe(e => e)

    })
  }

  onChangeSelectAll() {
    if (this.allSelectedReview) {
      this.data.forEach((element:any) => element.isSelectedReview = true);
    }else{
      this.data.forEach((element:any) => element.isSelectedReview = false);
    }
  }


}
