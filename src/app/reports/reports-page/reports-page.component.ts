import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

@Component({
  selector: "app-reports-page",
  templateUrl: "./reports-page.component.html",
  styleUrls: ["./reports-page.component.css"],
})
export class ReportsPageComponent implements OnInit {
  data$: Observable<any> = new Observable();
  data: any[] = [
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
      reportDocData: [
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 1,
          status: "Red",
          note: "",
        },
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 2,
          status: "Red",
          note: "",
        },
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 3,
          status: "Red",
          note: "",
        },
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 4,
          status: "Green",
          note: "",
        },
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 5,
          status: "Green",
          note: "",
        },
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 6,
          status: "Green",
          note: "",
        },
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 7,
          status: "Red",
          note: "",
        },
        {
          doc_type: "Consent_for_Admission",
          pages: 2,
          field: 8,
          status: "Green",
          note: "",
        },
      ],
    },
  ];

  onDownload() {
    this.router.navigate(['reports-download']);
  }

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store
      .select((state) => state)
      .subscribe((e: any) => {
        console.log(e.app);
        this.data$ = e.app.reportsDataList;
      });
  }
}
