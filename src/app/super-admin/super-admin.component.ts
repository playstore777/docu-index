import { Component, EventEmitter, Input, Output } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { updateSUAdminData } from "../store/actions/app.action";

@Component({
  selector: "app-super-admin",
  templateUrl: "./super-admin.component.html",
  styleUrls: ["./super-admin.component.css"],
})
export class SuperAdminComponent {
  currentPageNumber: number = 1;
  docType: number = 0;
  pdfSrc: string = "";
  isPdfUploaded: boolean = false;
  totalPages: any = 0;
  postRes: any;
  @Output() getFieldsAPICallback = new EventEmitter<any>();

  constructor(private http: HttpClient, private store: Store) {}

  async uploadFile(event: any) {
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
    
    await this.http
    .post<object>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/UpdloadMasterDocument",
      {
        doc_id: 0,
        doc_value: value,
        doc_name: name,
        pages: totalPages,
      },
      { headers }
      )
      .forEach((res) => {
        this.postRes = res;
      });
      
      // console.log("this.postRes: ", typeof this.postRes.doc_id);
      this.docType = this.postRes.doc_id;
      this.store.dispatch(
        updateSUAdminData({ suAdminData: { docId: this.docType } })
      );
    }
}
