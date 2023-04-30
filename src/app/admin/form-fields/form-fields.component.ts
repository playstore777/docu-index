import { Component, OnInit, Input } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";

import { clearAdminData } from "src/app/store/actions/app.action";
import { AdminService } from "src/app/services/admin-services/admin.service";

@Component({
  selector: "app-form-fields",
  templateUrl: "./form-fields.component.html",
  styleUrls: ["./form-fields.component.css"],
})
export class FormFieldsComponent implements OnInit {
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

  constructor(private store: Store, private service: AdminService) {}

  ngOnInit() {
    this.getFieldsAPI();
  }

  ngOnDestroy() {
    this.store.dispatch(clearAdminData());
    this.store
      .select((state) => state)
      .subscribe((data: any) => console.log("data on destroy: ", data));
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
          this.data$ = this.service.getDocumentFields(
            headers,
            docId,
            currentPageNumber
          );
          this.docID = docId;
          this.currPageNo = currentPageNumber;
          let temp: any = [];
          this.data$.subscribe((element) => {
            element.forEach((data: any) => {
              data = { ...data, isReviewed: false, isMandatory: false };
              temp.push(data);
            });
            this.data$ = of(temp);
          });
        }
      });
  }

  addField() {
    console.log("from onSubmit(): ", this.selectedFields);
    this.data$.subscribe(
      (fieldData: any) =>
        (this.selectedFields = fieldData.filter(
          (element: any) => element.isReviewed || element.isMandatory
        ))
    );
    this.selectedFields.forEach((item: any) => {
      let obj = {
        doc_no: item.doc_no,
        page_no: item.page_no,
        field_no: item.field_no,
        mandatory: item.isMandatory ? "Y" : "N",
      };

      console.log("object to be sent: ", JSON.stringify(obj), item);

      let headers = new HttpHeaders({
        Accept: "*/*",
        "Content-Type": "application/json",
      });
      this.service.updateDocumentFields(headers, obj).subscribe((e) => e);
      item.isReviewed = false;
      item.isMandatory = false;
    });
  }
}
