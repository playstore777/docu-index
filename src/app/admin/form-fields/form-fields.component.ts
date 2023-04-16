import { Component, OnInit, Input } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

@Component({
  selector: "app-form-fields",
  templateUrl: "./form-fields.component.html",
  styleUrls: ["./form-fields.component.css"],
})
export class FormFieldsComponent implements OnInit {
  // @Input() currentPageNumber = 1;
  @Input() docType = 0;
  allSelectedReview: boolean = false;
  allSelectedMandatory: boolean = false;
  selectedFields: Array<any> = [];

  data$: Observable<any> = new Observable();

  // cache data
  docID: number = 0;
  currPageNo: number = 0;

  addFieldButton = document.querySelector(".bottom-toolbar .add");
  rows = document.getElementsByClassName("rows");

  constructor(private http: HttpClient, private store: Store) {}

  ngOnInit() {
    this.getFieldsAPI();
  }

  getFieldsAPI() {
    this.store
      .select((state) => state)
      .subscribe((data: any) => {
        this.allSelectedReview = false;
        let headers = new HttpHeaders({
          Accept: "*/*",
        });
        const currentPageNumber = data.app.adminData.currPage;
        const docId = data.app.adminData.docId;
        if (this.docID !== docId || this.currPageNo !== currentPageNumber) {
          // console.log(
          //   "before get fields call from Admin: ",
          //   docId,
          //   currentPageNumber
          // );
          this.data$ = this.http.get<any>(
            `https://pdfanalysis.azurewebsites.net/api/Analysis/GetDocumentFields?Doc_Id=${docId}&page=${currentPageNumber}`,
            {
              headers: headers,
            }
          );
          this.docID = docId;
          this.currPageNo = currentPageNumber;
        }
      });
  }

  addField() {
    console.log("from onSubmit(): ", this.selectedFields);
    this.selectedFields.forEach((item: any) => {
      let obj = {
        doc_no: this.docType,
        page_no: item.pageNumber,
        field_no: item.fieldNumber,
        mandatory: "Y",
      };

      console.log("object to be sent: ", JSON.stringify(obj));

      let headers = new HttpHeaders({
        Accept: "*/*",
        "Content-Type": "application/json",
      });
      this.http
        .post<any>(
          `https://pdfanalysis.azurewebsites.net/api/Analysis/UpdateDocumentFields`,
          obj,
          {
            headers: headers,
          }
        )
        .subscribe((e) => e);
    });
  }

  onChangeSelectAll() {
    // if (this.allSelectedReview) {
    //   this.data.forEach((element:any) => element.isSelectedReview = true);
    // }else{
    //   this.data.forEach((element:any) => element.isSelectedReview = false);
    // }
  }
}
