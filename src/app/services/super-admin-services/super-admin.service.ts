import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SuperAdminService {
  readonly superAdminAPIUrl = "http://localhost:1010/api/Analysis";

  constructor(private http: HttpClient) {}

  getMasterForms(headers: any) {
    return this.http.get<any>(`${this.superAdminAPIUrl}/GetMasterForms`, {
      headers,
    });
  }

  uploadMasterDocument(headers: any, obj: any) {
    return this.http.post<object>(
      `${this.superAdminAPIUrl}/UpdloadMasterDocument`,
      obj,
      { headers }
    );
  }

  getMasterDocumentFields(headers: any, docID: number) {
    return this.http.get<any>(
      `${this.superAdminAPIUrl}/GetMasterDocumentFields?Doc_Id=${docID}`,
      {
        headers,
      }
    );
  }

  updateMasterDocumentFields(headers: any, obj: any) {
    return this.http.post<any>(
      `${this.superAdminAPIUrl}/UpdateMasterDocumentFields`,
      obj,
      { headers }
    );
  }

  updateDocumentFields(headers: any, obj: any) {
    return this.http.post<any>(
      `${this.superAdminAPIUrl}/UpdateDocumentFields`,
      obj,
      {
        headers: headers,
      }
    );
  }
}
