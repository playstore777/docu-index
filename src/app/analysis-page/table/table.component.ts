import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AnalysisService } from "src/app/services/analysis-services/analysis.service";
import { updateAnalysisList } from "src/app/store/actions/app.action";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class TableComponent implements OnInit {
  rowData: any;
  note: string = "";
  tableData: any = [];
  currPageNo: number = 1;
  base64String: string = "";

  constructor(private store: Store, private service: AnalysisService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.store
      .select((state) => state)
      .subscribe((data: any) => {
        data.app.analysisDataList.subscribe((element: any) => {
          this.tableData = [];
          element.forEach((e: any) => {
            // console.log(e, e.mandatory);
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

  actions(event: any, data: any) {
    const review = event.target.parentElement.parentElement.firstChild;
    const ignore = event.target.parentElement.parentElement.lastChild;
    console.log(review, ignore, data);

    review?.classList.toggle("review-active");
    ignore?.classList.toggle("ignore-active");

    this.tableData.forEach((element: any) => {
      console.log("element: ", element);
      if (
        element.batch_no === data.batch_no &&
        element.field_no === data.field_no &&
        element.page_no === data.page_no
      ) {
        const headers = new HttpHeaders({
          Accept: "*/*",
        });

        element.color_code = element.color_code === "G" ? "R" : "G";
        const obj = {
          batch_no: element.batch_no,
          doc_no: element.doc_no,
          page_no: element.page_no,
          field_no: element.field_no,
          color_code: element.color_code,
        };
        this.service
          .updateColorCode(headers, obj)
          .subscribe((e) => console.log(e));
      }
    });
  }

  openNote(row: any) {
    document.querySelector(".popup-overlay")?.classList.toggle("show");
    document.querySelector("body")?.classList.toggle("stop-overflow");
    document.querySelector<HTMLElement>(".card.note")!.style.display = "grid";
    this.note = row.note;
    this.rowData = row;
  }

  submitNote() {
    const headers = new HttpHeaders({
      Accept: "*/*",
    });

    const obj = {
      batch_no: this.rowData.batch_no,
      doc_no: this.rowData.doc_no,
      page_no: this.rowData.page_no,
      field_no: this.rowData.field_no,
      note: this.note,
    };

    console.log(obj);
    this.service.updateNoteColumn(headers, obj).subscribe((e) => e);
    this.loadData();
    this.store.dispatch(
      updateAnalysisList({
        analysisDataList: this.service.getAnalysisData(
          headers,
          this.rowData.batch_no
        ),
      })
    );
    this.closeNote();
  }

  closeNote() {
    this.note = "";
    document.querySelector<HTMLElement>(".card.note")!.style.display = "none";
    document.querySelector(".popup-overlay")?.classList.toggle("show");
    document.querySelector("body")?.classList.toggle("stop-overflow");
  }

  closeDoc() {
    this.note = "";
    document.querySelector("body")?.classList.toggle("stop-overflow");
    document.querySelector<HTMLElement>(".card.doc")!.style.display = "none";
    document.querySelector(".popup-overlay")?.classList.toggle("show");
  }

  openDoc(data: any) {
    document.querySelector(".popup-overlay")?.classList.toggle("show");
    document.querySelector("body")?.classList.toggle("stop-overflow");
    document.querySelector<HTMLElement>(".card.doc")!.style.display = "grid";
    const headers = new HttpHeaders({
      Accept: "*/*",
    });

    const obj = {
      batch_no: data.batch_no,
      doc_no: data.doc_no,
      page_no: data.page_no,
      field_no: data.field_no,
    };

    this.service
      .getFieldDocumentView(headers, obj)
      .subscribe((e: any) => (this.base64String = e.doc_value));
  }
}
