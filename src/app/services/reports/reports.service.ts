import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  readonly reportsAPIUrl = "http://localhost:1010/api/Analysis";
  
  constructor(private http: HttpClient) {}

  getReportData(headers: any, obj: any) {
    return this.http.post<any>(`${this.reportsAPIUrl}/GetReportData`, obj, {
      headers,
    });
  }
}
