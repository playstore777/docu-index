import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { LoaderService } from "src/app/loader.service";
import { updateAnalysisFilteredList } from "src/app/store/actions/app.action";
import { map, take } from "rxjs/operators";

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
    let filteredList: any[] = [];
    this.store
      .select((state: any) => state)
      .subscribe((e: any) => {
        const data = e.app.analysisDataList;
        data.subscribe((element: any) => {
          console.log("docType: ", docType);
          if (docType !== "all") {
            if (
              JSON.stringify(filteredList) !==
              JSON.stringify(
                element.filter((ele: any) => ele.doc_type === docType)
              )
            ) {
              filteredList = element.filter(
                (ele: any) => ele.doc_type === docType
              );
              console.log("filteredList inside subscribe: ", of(filteredList));
              const filteredObservable = of(filteredList);
              this.store.dispatch(
                updateAnalysisFilteredList({
                  analysisFilteredDataList: filteredObservable,
                })
              );
            }
          } else {
            filteredList = element;
            const filteredObservable = of(filteredList);
            this.store.dispatch(
              updateAnalysisFilteredList({
                analysisFilteredDataList: filteredObservable,
              })
            );
          }
        });
      });
    console.log(filteredList);
  }

  onDropdownChange(event: any) {
    const type = event.target.value;
    console.log(type);

    this.store
      .select((state) => state)
      .pipe(take(1))
      .subscribe((e: any) => {
        let data = e.app.analysisDataList;

        data
          .pipe(
            map((list: any[]) => {
              // Make a copy of the array to avoid modifying the original data
              let filteredList = list.slice();
              filteredList.sort((a: any, b: any) => {
                if (a[type] < b[type]) {
                  return -1; // a should come before b
                } else if (b[type] < a[type]) {
                  return 1; // b should come before a
                } else {
                  return 0; // no change in order
                }
              });
              console.log("oh shisshhh!!!");
              return filteredList;
            })
          )
          .subscribe((filteredList: any[]) => {
            const filteredObservable = of(filteredList);
            this.store.dispatch(
              updateAnalysisFilteredList({
                analysisFilteredDataList: filteredObservable,
              })
            );
          });
      });
  }
}
