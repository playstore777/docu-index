import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  readonly adminAPIUrl = "http://localhost:1010/api/Analysis";

  constructor(private http: HttpClient) {}

  getAllDocumentList(headers: any){
    return this.http.get<any>(
      `${this.adminAPIUrl}/GetAllDocumentList`,
      {
        headers: headers,
      }
    );
  }

  getDocumentFields(
    headers: any,
    docId: number,
    currentPageNumber: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.adminAPIUrl}/GetDocumentFields?Doc_Id=${docId}&page=${currentPageNumber}`,
      {
        headers: headers,
      }
    );
  }

  updateDocumentFields(headers: any, obj: any) {
    return this.http.post<any>(
      `${this.adminAPIUrl}/UpdateDocumentFields`,
      obj,
      {
        headers: headers,
      }
    );
  }

  getDocument(headers: any, docId: number): Observable<any> {
    return this.http.get<any>(
      `${this.adminAPIUrl}/GetDocument?data=${docId}`,
      {
        headers: headers,
      }
    );
  }


}
