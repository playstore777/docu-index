import { Component, EventEmitter, Input, Output } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import { Store } from "@ngrx/store";

import { updateSUAdminData } from "../store/actions/app.action";
import { SuperAdminService } from "../services/super-admin-services/super-admin.service";

@Component({
  selector: "app-super-admin",
  templateUrl: "./super-admin.component.html",
  styleUrls: ["./super-admin.component.css"],
})
export class SuperAdminComponent {
  currentPageNumber: number = 1;
  docType: number = 0;
  pdfSrc: string = "";
  totalPages: any = 0;
  postRes: any;

  constructor(private store: Store, private service: SuperAdminService) {}

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
    this.store.dispatch(
      updateSUAdminData({ suAdminData: { docId: this.docType, pdfSRC: value } })
    );
  }
}
