import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { LoaderService } from "src/app/loader.service";
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
export class ReportsFormComponent {
  displayDropdown: string = "flex";
  displayDateRange: string = "none";
  displayAdvancedOptions: string = "none";
  accordion: string = "▼";
  selectedDateType: string = "Analysis";

  datePickerFrom: Date = new Date();
  datePickerTo: Date = new Date();
  today: Date = new Date();
  facility: String = "SSMS";
  dropdownValue: String = `${this.today.getFullYear()}-${this.today.getMonth()}-${this.today.getDate()}`;
  BatchID: String = "";
  AnalysisUser: String = "";
  responseData: any;

  radioClicked(e: any) {
    this.selectedDateType = e.target.value;
  }

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
    private store: Store, private loaderService: LoaderService,
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

  onDateDropdownChange() {
    console.log(this.dropdownValue);
    this.displayDateRange = this.dropdownValue === "custom" ? "flex" : "none";
  }

  callAPI() {
    this.loaderService.showLoader();
    const headers = new HttpHeaders({
      Accept: "*/*",
    });

    const obj = {
      batch_id: this.BatchID,
      facility: this.facility,
      analysed_date:
        this.dropdownValue !== "custom" &&
        (this.selectedDateType === "Analysis" ||
          this.selectedDateType === "Both")
          ? this.dropdownValue
          : "",
      indexed_date:
        this.dropdownValue !== "custom" &&
        (this.selectedDateType === "Index" || this.selectedDateType === "Both")
          ? this.dropdownValue
          : "",
      analysed_user: this.AnalysisUser,
      analysed_fromdate:
        this.dropdownValue === "custom" &&
        (this.selectedDateType === "Analysis" ||
          this.selectedDateType === "Both")
          ? this.datePickerFrom
          : "",
      analysed_todate:
        this.dropdownValue === "custom" &&
        (this.selectedDateType === "Analysis" ||
          this.selectedDateType === "Both")
          ? this.datePickerTo
          : "",
      indexed_fromdate:
        this.dropdownValue !== "custom" &&
        (this.selectedDateType === "Index" || this.selectedDateType === "Both")
          ? this.dropdownValue
          : "",
      indexed_todate:
        this.dropdownValue !== "custom" &&
        (this.selectedDateType === "Index" || this.selectedDateType === "Both")
          ? this.dropdownValue
          : "",
    };

    this.responseData = this.service.getReportData(headers, obj);
    this.responseData.subscribe((e: any) =>
      e.forEach((element: any) => {
        const { reportDocData } = element;
        this.store.dispatch(
          addReportDocData({ reportDocData: { batch_id: reportDocData } })
        );
        this.loaderService.hideLoader();
      })
    );
    this.store.dispatch(addReportsList({ reportsDataList: this.responseData }));
  }

  onView() {
    console.log("dates from & to: ", this.datePickerFrom, this.datePickerTo);
    this.callAPI();
    this.router.navigate(["reports"]);
  }

  advancedSearchOptions() {
    this.accordion = this.accordion === "▼" ? "▲" : "▼";
    this.displayAdvancedOptions =
      this.displayAdvancedOptions === "none" ? "flex" : "none";
  }
}
