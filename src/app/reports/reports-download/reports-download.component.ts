import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";

@Component({
  selector: "app-reports-download",
  templateUrl: "./reports-download.component.html",
  styleUrls: ["./reports-download.component.css"],
})
export class ReportsDownloadComponent implements OnInit {
  data$: Observable<any> = new Observable();
  data = [
    {
      batch_id: "12312",
      facility: "SSMS",
      patient_type: null,
      account: "12312",
      admit_date: null,
      discharge_date: null,
      scanned_date: "5/5/2023 12:00:00 AM",
      analysed_date: "5/5/2023 12:00:00 AM",
      analysed_user: "ram",
    },
    {
      batch_id: "12234",
      facility: "SSMS",
      patient_type: null,
      account: "12312",
      admit_date: null,
      discharge_date: null,
      scanned_date: "5/5/2023 12:00:00 AM",
      analysed_date: "5/5/2023 12:00:00 AM",
      analysed_user: "ram",
    },
  ];
  temp = [
    {
      "12312": [
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 1,
          status: "Red",
          note: "",
        },
        ,
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 2,
          status: "Red",
          note: "",
        },
      ],
    },
  ];
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select((state) => state)
      .subscribe((e: any) => {
        this.data$ = e.app.reportsDataList;
      });

    this.data$.subscribe((value: any) => {
      this.data = value;
      this.temp = []; // Clear the temp array
      value.forEach((e: any) => {
        const obj: any = {}; // Define the object with a string index signature
        obj[e.batch_id] = e.reportDocData;
        this.temp.push(obj);
        console.log("data from temp: ", this.temp);
      });
    });

    const combinedArray: any[] = [];

    this.temp.forEach((tempItem) => {
      Object.entries(tempItem).forEach(([batchId, documents]) => {
        const dataItem = this.data.find((d) => d.batch_id === batchId);

        if (dataItem) {
          documents.forEach((document) => {
            combinedArray.push({
              ...dataItem,
              ...document,
            });
          });
        }
      });
    });

    console.log("combined array: ", combinedArray);
  }
}
