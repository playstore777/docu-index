import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import * as XLSX from "xlsx";

@Component({
  selector: "app-reports-download",
  templateUrl: "./reports-download.component.html",
  styleUrls: ["./reports-download.component.css"],
})
export class ReportsDownloadComponent implements OnInit {
  data$: Observable<any> = new Observable();
  data: any[] = [];
  temp: any[] = [];
  constructor(private store: Store) {}
  @ViewChild(HTMLElement) table!: ElementRef;

  ngOnInit(): void {
    this.store
      .select((state) => state)
      .subscribe((e: any) => {
        this.data$ = e.app.reportsDataList;
      });

    this.data$.subscribe((value: any) => {
      this.data = value;
      // delete this.data?.reportDocData;
      this.temp = []; // Clear the temp array
      value.forEach((e: any) => {
        e.reportDocData?.forEach((element: any) => {
          element = { ...element, batch_id: e.batch_id };
          this.temp.push(element);
        });
        console.log("data from temp: ", this.data, this.temp);
      });

      const combinedArray: any[] = [];
      let singleElement = this.data[0];

      this.temp.forEach((tempItem: any) => {
        console.log("tempData: ", tempItem);
        if (singleElement.batch_id === tempItem.batch_id) {
          combinedArray.push({ ...singleElement, ...tempItem });
        } else {
          this.data.forEach((item: any) => {
            if (item.batch_id === tempItem.batch_id) {
              singleElement = item;
              combinedArray.push({ ...singleElement, ...tempItem });
            }
          });
        }
        console.log("combined array: ", combinedArray);
      });
      this.data$ = of(combinedArray);
    });
  }

  htmlTableToExcelFile(): void {
    const table = document.querySelector("table") as HTMLElement;
    const fileName = "reports";
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName + ".xlsx");
  }
}
