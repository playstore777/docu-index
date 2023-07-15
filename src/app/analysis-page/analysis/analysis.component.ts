import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { LoaderService } from "src/app/loader.service";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.css"],
})
export class AnalysisComponent {
  data: any;
  docTypes: any = [];
  constructor(private store: Store, private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.showLoader();
    this.store
      .select((state) => state)
      .subscribe((e: any) => {
        if (e.length > 0) {
          this.loaderService.hideLoader();
        }
        this.data = e.app.analysisMasterData;
        e.app.analysisDataList.subscribe((element: any) => {
          this.docTypes = [];
          element.forEach((e: any) => {
            if (!this.docTypes.includes(e.doc_type)) {
              this.docTypes.push(e.doc_type);
            }
          });
        });
      });
  }

  docFilter(event: any) {
    console.log("consent!", this.data);
    const docType = event.target.value;
    this.store
      .select((state) => state)
      .subscribe((e: any) => {
        const data = e.app.analysisDataList;
        data.subscribe((element: any) => {
          element.sort((a: any, b: any) => {
            if (
              a.doc_type.startsWith(docType) &&
              !b.doc_type.startsWith(docType)
            ) {
              return -1; // a should come before b
            } else if (
              b.doc_type.startsWith(docType) &&
              !a.doc_type.startsWith(docType)
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
