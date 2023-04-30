import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  readonly adminAPIUrl = "https://pdfanalysis.azurewebsites.net/api/Analysis";

  constructor(private http: HttpClient) {}

  getAllDocumentList(headers: any){
    return this.http.get<any>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/GetAllDocumentList",
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
      `https://pdfanalysis.azurewebsites.net/api/Analysis/GetDocumentFields?Doc_Id=${docId}&page=${currentPageNumber}`,
      {
        headers: headers,
      }
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

  getDocument(headers: any, docId: number): Observable<any> {
    return this.http.get<any>(
      `https://pdfanalysis.azurewebsites.net/api/Analysis/GetDocument?data=${docId}`,
      {
        headers: headers,
      }
    );
  }


}
