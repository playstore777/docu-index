import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SuperAdminService {
  constructor(private http: HttpClient) {}

  getMasterForms(headers: any) {
    return this.http.get<any>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/GetMasterForms",
      { headers }
    );
  }

  uploadMasterDocument(headers: any, obj: any) {
    return this.http.post<object>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/UpdloadMasterDocument",
      obj,
      { headers }
    );
  }

  getMasterDocumentFields(headers: any, docID: number) {
    return this.http.get<any>(
      `https://pdfanalysis.azurewebsites.net/api/Analysis/GetMasterDocumentFields?Doc_Id=${docID}`,
      {
        headers,
      }
    );
  }

  updateMasterDocumentFields(headers: any, obj: any) {
    return this.http.post<any>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/UpdateMasterDocumentFields",
      obj,
      { headers }
    );
  }

  updateDocumentFields(headers: any, obj: any) {
    return this.http.post<any>(
      `https://pdfanalysis.azurewebsites.net/api/Analysis/UpdateDocumentFields`,
      obj,
      {
        headers: headers,
      }
    );
  }
}
