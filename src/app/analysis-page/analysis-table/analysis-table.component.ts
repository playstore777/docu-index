import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AnalysisService } from "src/app/services/analysis-services/analysis.service";
import {
  addAnalysisMasterData,
  updateAnalysisList,
} from "src/app/store/actions/app.action";

@Component({
  selector: "app-analysis-table",
  templateUrl: "./analysis-table.component.html",
  styleUrls: ["./analysis-table.component.css"],
})
export class AnalysisTableComponent implements OnInit {
  data$: Observable<any> = new Observable();
  responseData$: Observable<any> = new Observable();
  constructor(
    private service: AnalysisService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    const headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.data$ = this.service.getAnalysisMasterData(headers);
  }
  
  navigateToAnalysisPage(row: any) {
    const headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.responseData$ = this.service.getAnalysisData(headers, row.batch_no);
    this.store.dispatch(
      updateAnalysisList({ analysisDataList: this.responseData$ })
      );
      this.store.dispatch(
        addAnalysisMasterData({ analysisMasterData: row })
      );
    this.router.navigate(["analysis-details"]);
  }
}
