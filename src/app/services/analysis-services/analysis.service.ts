import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AnalysisService {
  readonly analysisAPIUrl = "http://localhost:1010/api/Analysis"

  constructor(private http: HttpClient) {}

  getAnalysisMasterData(headers: any) {
    return this.http.get<any>(
      `${this.analysisAPIUrl}/GetAnaylysisMasterData`,
      { headers }
    );
  }

  getAnalysisData(headers: any, data: string): Observable<any> {
    return this.http.get<any>(
      `${this.analysisAPIUrl}/GetAnaylysisData?data=${data}`,
      {
        headers: headers,
      }
    );
  }

  updateNoteColumn(headers: any, obj: any) {
    return this.http.post<any>(
      `${this.analysisAPIUrl}/UpdateNoteCoulmn`,
      obj,
      { headers }
    );
  }

  getFieldDocumentView(headers: any, obj: any) {
    return this.http.post<any>(
      `${this.analysisAPIUrl}/GetFieldDocumentView`,
      obj,
      { headers }
    );
  }

  updateColorCode(headers: any, obj: any) {
    return this.http.post<any>(
      `${this.analysisAPIUrl}/UpdateColorCode`,
      obj,
      { headers }
    );
  }

  submitAnalysis(headers: any, obj: any) {
    return this.http.post<any>(
      `${this.analysisAPIUrl}/Submit`,
      obj,
      { headers }
    );
  }
}
