import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { LoaderService } from "src/app/loader.service";
import { AnalysisService } from "src/app/services/analysis-services/analysis.service";
import {
  addAnalysisMasterData,
  updateAnalysisFilteredList,
  updateAnalysisList,
} from "src/app/store/actions/app.action";

@Component({
  selector: "app-analysis-table",
  templateUrl: "./analysis-table.component.html",
  styleUrls: ["./analysis-table.component.css"],
})
export class AnalysisTableComponent implements OnInit {
  data: any[] = [];
  responseData$: Observable<any> = new Observable();
  constructor(
    private service: AnalysisService,
    private store: Store,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    // this.loaderService.showLoader();
    const headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.service.getAnalysisMasterData(headers).subscribe((e: any) => {
      if (e.length > 0) {
        console.log("number: ", e);
        this.data = e.filter((element: any) => element.submit_Action !== "S");
        // this.loaderService.hideLoader();
      }
    });
  }

  navigateToAnalysisPage(row: any) {
    const headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.responseData$ = this.service.getAnalysisData(headers, row.batch_no);
    this.responseData$.subscribe((e: any) => {});
    this.store.dispatch(
      updateAnalysisList({ analysisDataList: this.responseData$ })
    );
    this.store.dispatch(
      updateAnalysisFilteredList({
        analysisFilteredDataList: this.responseData$,
      })
    );
    this.store.dispatch(addAnalysisMasterData({ analysisMasterData: row }));
    this.router.navigate(["analysis-details"]);
  }
}
