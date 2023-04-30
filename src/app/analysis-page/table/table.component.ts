import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class TableComponent implements OnInit {
  data = new Observable();
  tableData: any = [
    {
      field_no: "1",
      page_no: "2",
      field_value: "assets/images/first_snippet.png",
      doc_type: "Consents",
      batch_no: "B00000123456",
      facility: "SJHMC",
      isMandatory: true,
      color_code: "R",
    },
    {
      field_no: "1",
      page_no: "1",
      field_value: "assets/images/second_snippet.png",
      doc_type: "Consents",
      batch_no: "B00000123456",
      facility: "SJHMC",
      isMandatory: true,
      color_code: "G",
    },
  ];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select((state) => state)
      .subscribe((data: any) => {
        data.app.analysisDataList.subscribe((element: any) => {
          this.tableData = [];
          element.forEach((e: any) => {
            console.log(e.mandatory);
            e = {
              ...e,
              isMandatory: e.mandatory === "Y" ? true : false,
              isDisabled: e.mandatory === "Y" ? true : false,
            };
            this.tableData.push(e);
          });
        });
      });
  }

  actions(event: any, mandatory: any) {
    // if (!mandatory) {
    const review = event.target.parentElement.parentElement.firstChild;
    const ignore = event.target.parentElement.parentElement.lastChild;
    console.log(review, ignore, mandatory);

    review?.classList.toggle("review-active");
    ignore?.classList.toggle("ignore-active");
    // }
  }

  openNote(row: any) {
    document.querySelector(".popup-overlay")?.classList.toggle("show");
    document.querySelector<HTMLElement>(
      ".popup-overlay .text-content"
    )!.textContent = row.note;
  }

  closeNote() {
    document.querySelector<HTMLElement>(
      ".popup-overlay .text-content"
    )!.textContent = "";
    document.querySelector(".popup-overlay")?.classList.toggle("show");
  }
}
