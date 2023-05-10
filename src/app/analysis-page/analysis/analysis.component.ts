import { Component } from "@angular/core";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.css"],
})
export class AnalysisComponent {
  data: any;
  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select((state) => state)
      .subscribe((e: any) => {
        this.data = e.app.analysisMasterData;
        console.log(e, this.data);
      });
  }

  docFilter() {
    console.log("consent!", this.data);
    const docType = "G"; // just for testing purpose
    this.store
      .select((state) => state)
      .subscribe((e: any) => {
        const data = e.app.analysisDataList;
        data.subscribe((element: any) => {
          element.sort((a: any, b: any) => {
            if (
              a.color_code.startsWith(docType) &&
              !b.color_code.startsWith(docType)
            ) {
              return -1; // a should come before b
            } else if (
              b.color_code.startsWith(docType) &&
              !a.color_code.startsWith(docType)
            ) {
              return 1; // b should come before a
            } else {
              return 0; // no change in order
            }
          });
          console.log(element);
        });
        console.log(e, this.data);
      });
  }

  onDropdownChange(event: any) {
    const type = event.target.value;
    this.store
      .select((state) => state)
      .subscribe((e: any) => {
        const data = e.app.analysisDataList;
        data.subscribe((element: any) => {
          element.sort((a: any, b: any) => {
            if (a[type] > b[type]) {
              return -1; // a should come before b
            } else if (b[type] > a[type]) {
              return 1; // b should come before a
            } else {
              return 0; // no change in order
            }
          });
          console.log("from dropdown: ", element);
        });
        console.log("from dropdown: ", e, this.data);
      });
  }
}
