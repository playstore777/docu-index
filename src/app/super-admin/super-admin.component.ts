import { Component, OnInit } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import {
  clearSUAdminData,
  updateSUAdminData,
} from "../store/actions/app.action";
import { SuperAdminService } from "../services/super-admin-services/super-admin.service";

@Component({
  selector: "app-super-admin",
  templateUrl: "./super-admin.component.html",
  styleUrls: ["./super-admin.component.css"],
})
export class SuperAdminComponent implements OnInit {
  dropdownData$: Observable<any> = new Observable();
  dropdownData: any[] = [];
  currentPageNumber: number = 1;
  docType: number = 0;
  pdfSrc: string = "";
  totalPages: any = 0;
  postRes: any;
  dropdownValue: String = "Select a pdf";
  dropdownName: String = "";

  constructor(private store: Store, private service: SuperAdminService) {}

  ngOnInit(): void {
    const headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.dropdownData$ = this.service.getMasterForms(headers);
    this.dropdownData$.subscribe((e) => (this.dropdownData = e));
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.pdfSrc = reader.result?.slice(28) as string;
      let bin = atob(reader.result?.slice(28) as string);
      this.totalPages = bin.match(/\/Type\s*\/Page\b/g)?.length;
      this.UploadMasterDocument(file.name, this.totalPages, this.pdfSrc);
    };
  }

  onDropdownChange() {
    console.log("dropdown value: ", this.dropdownValue);
    this.dropdownName = "";
    this.getDocName();
    if (this.dropdownValue !== "Select a pdf") {
      let bin = atob(this.dropdownValue as string);
      this.totalPages = bin.match(/\/Type\s*\/Page\b/g)?.length;
      this.UploadMasterDocument(
        this.dropdownName as string,
        this.totalPages,
        this.dropdownValue as string
      );
    }
  }

  getDocName() {
    this.dropdownData.forEach((element) => {
      // console.log(element.from_Name);
      if (element.from_value === this.dropdownValue) {
        this.dropdownName = element.from_Name;
      }
    });
  }

  async UploadMasterDocument(name: string, totalPages: number, value: string) {
    let headers = new HttpHeaders({
      Accept: "*/*",
    });
    const obj = {
      doc_id: 0,
      doc_value: value,
      doc_name: name,
      pages: totalPages,
    };
    await this.service.uploadMasterDocument(headers, obj).forEach((res) => {
      this.postRes = res;
    });

    this.docType = this.postRes.doc_id;
    console.log(this.docType);
    this.store.dispatch(clearSUAdminData());
    this.store.dispatch(
      updateSUAdminData({ suAdminData: { docId: this.docType, pdfSRC: value } })
    );
  }
}
