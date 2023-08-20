import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { LoaderService } from "src/app/loader.service";

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
  isTableExtended = false;

  constructor(
    private store: Store,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    // this.loaderService.showLoader();
    this.store
      .select((state) => state)
      .subscribe((e: any) => {
        console.log(e.app);
        this.data$ = e.app.reportsDataList;
      });
  }

  onDownload() {
    this.router.navigate(["reports-download"]);
    // this.loaderService.hideLoader();
  }

  onCancel() {
    this.router.navigate(["reports-form"]);
  }

  showFullTable(event: any) {
    const plusBtn = event.target;
    console.log("plusBtn: ", plusBtn);
    plusBtn.textContent = plusBtn.textContent === "+" ? "-" : "+";
    const miniTable = event.target.parentElement.lastChild as HTMLElement;
    if (this.isTableExtended) {
      miniTable!.style.width = "72.5%";
      miniTable!.style.height = "150px";
      miniTable!.style.overflowY = "scroll";
      this.isTableExtended = false;
    } else {
      miniTable!.style.width = "auto";
      miniTable!.style.height = "auto";
      miniTable!.style.overflow = "auto";
      this.isTableExtended = true;
    }
  }
}
