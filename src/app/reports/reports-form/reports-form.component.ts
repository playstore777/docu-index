import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ReportsService } from "src/app/services/reports/reports.service";
import {
  addReportDocData,
  addReportsList,
} from "src/app/store/actions/app.action";

@Component({
  selector: "app-reports-form",
  templateUrl: "./reports-form.component.html",
  styleUrls: ["./reports-form.component.css"],
})
export class ReportsFormComponent implements OnInit {
  datePickerAnalysed: Date = new Date();
  datePickerIndexed: Date = new Date();
  today: Date = new Date();
  facility: String = "SSMS";
  Analysed: String = `${this.today.getFullYear()}-${this.today.getMonth()}-${this.today.getDate()}`;
  Indexed: String = `${this.today.getFullYear()}-${this.today.getMonth()}-${this.today.getDate()}`;
  BatchID: String = "";
  AnalysisUser: String = "";
  responseData: any;
  showIndexedDate: string = "calendar hide";
  showAnalysisDate: string = "calendar hide";

  facilitiesList: any = [
    { id: "SSMS", name: "SSMS" },
    { id: "SJHMC", name: "SJHMC" },
    { id: "BJH", name: "BJH" },
    { id: "STNH", name: "STNH" },
    { id: "KUMS", name: "KUMS" },
    { id: "HYCC", name: "HYCC" },
  ];
  DateRange: any = [
    {
      id: `${this.today.getFullYear()}-${this.today.getMonth()}-${this.today.getDate()}`,
      name: "Today",
    },
    { id: this.getYesterday(this.today), name: "Yesterday" },
    {
      id: this.getThisWeek(this.today),
      name: "This Week",
    },
    { id: this.getLastWeek(this.today), name: "Last Week" },
    {
      id: this.getThisMonth(this.today),
      name: "This Month",
    },
    {
      id: this.getLastMonth(this.today),
      name: "Last Month",
    },
    {
      id: "custom",
      name: "Custom Date",
    },
  ];

  constructor(
    private service: ReportsService,
    private router: Router,
    private store: Store
  ) {}

  getYesterday(today: Date) {
    const yesterday = today;
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
  }

  getLastWeek(today: Date) {
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const weekEndDate = new Date(today.setDate(diff + 6));
    return `${weekEndDate.getFullYear()}-${weekEndDate.getMonth()}-${weekEndDate.getDate()}`;
  }

  getThisWeek(today: Date) {
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const weekStartDate = new Date(today.setDate(diff));
    return `${weekStartDate.getFullYear()}-${weekStartDate.getMonth()}-${weekStartDate.getDate()}`;
  }

  getThisMonth(today: Date) {
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return `${firstDayOfMonth.getFullYear()}-${firstDayOfMonth.getMonth()}-${firstDayOfMonth.getDate()}`;
  }

  getLastMonth(today: Date) {
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    return `${lastDayOfMonth.getFullYear()}-${lastDayOfMonth.getMonth()}-${lastDayOfMonth.getDate()}`;
  }

  onIndexedDropdownChange() {
    console.log(this.Indexed);
    const datepickerInput = document.querySelector(".calendar");
    if (this.Indexed === "custom") {
      this.showIndexedDate = "calendar show";
    } else {
      this.showIndexedDate = "calendar hide";
    }
  }

  onAnalysisDropdownChange() {
    console.log(this.Analysed);
    const datepickerInput = document.querySelector(".calendar");
    if (this.Analysed === "custom") {
      this.showAnalysisDate = "calendar show";
    } else {
      this.showAnalysisDate = "calendar hide";
    }
  }

  onDownload() {
    this.callAPI();
    this.router.navigate(["reports-download"]);
  }

  async callAPI() {
    const headers = new HttpHeaders({
      Accept: "*/*",
    });

    const obj = {
      batch_id: this.BatchID,
      facility: this.facility,
      analysed_date:
        this.Analysed === "custom" ? this.datePickerAnalysed : this.Analysed,
      analysed_user: this.AnalysisUser,
      indexed_date:
        this.Indexed === "custom" ? this.datePickerIndexed : this.Indexed,
    };

    this.responseData = this.service.getReportData(headers, obj);
    this.responseData.subscribe((e: any) =>
      e.forEach((element: any) => {
        const { reportDocData } = element;
        this.store.dispatch(
          addReportDocData({ reportDocData: { batch_id: reportDocData } })
        );
      })
    );
    this.store.dispatch(addReportsList({ reportsDataList: this.responseData }));
  }

  onView() {
    this.callAPI();
    this.router.navigate(["reports"]);
  }

  ngOnInit(): void {}
}
