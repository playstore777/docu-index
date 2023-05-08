import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  constructor(private http: HttpClient) {}

  getReportData(headers: any, obj: any) {
    return this.http.post<any>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/GetReportData",
      obj,
      { headers }
    );
  }
}
