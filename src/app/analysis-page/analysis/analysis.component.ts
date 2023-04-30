import { HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AnalysisService } from "src/app/services/analysis-services/analysis.service";
import { updateAnalysisList } from "src/app/store/actions/app.action";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.css"],
})
export class AnalysisComponent {
  data$: Observable<any> = new Observable();
  constructor(private service: AnalysisService, private store: Store) {}

  getData(event: any) {
    const headers = new HttpHeaders({
      Accept: "*/*",
    });
    const data = event.target.parentElement.firstChild.value;
    this.data$ = this.service.getAnalysisData(headers, data);
    this.store.dispatch(updateAnalysisList({ analysisDataList: this.data$ }));
  }
}
