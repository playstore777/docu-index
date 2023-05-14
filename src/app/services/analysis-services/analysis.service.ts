import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AnalysisService {
  constructor(private http: HttpClient) {}

  getAnalysisMasterData(headers: any) {
    return this.http.get<any>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/GetAnaylysisMasterData",
      { headers }
    );
  }

  getAnalysisData(headers: any, data: string): Observable<any> {
    return this.http.get<any>(
      `https://pdfanalysis.azurewebsites.net/api/Analysis/GetAnaylysisData?data=${data}`,
      {
        headers: headers,
      }
    );
  }

  updateNoteColumn(headers: any, obj: any) {
    return this.http.post<any>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/UpdateNoteCoulmn",
      obj,
      { headers }
    );
  }

  getFieldDocumentView(headers: any, obj: any) {
    return this.http.post<any>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/GetFieldDocumentView",
      obj,
      { headers }
    );
  }

  updateColorCode(headers: any, obj: any) {
    return this.http.post<any>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/UpdateColorCode",
      obj,
      { headers }
    );
  }
}
