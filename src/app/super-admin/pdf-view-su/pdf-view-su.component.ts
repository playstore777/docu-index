import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import html2canvas from "html2canvas";
import Cropper from "cropperjs";
import { Store } from "@ngrx/store";
import { updateSUAdminData } from "src/app/store/actions/app.action";

@Component({
  selector: "app-pdf-view-su",
  templateUrl: "./pdf-view-su.component.html",
  styleUrls: ["./pdf-view-su.component.css"],
})
export class PdfViewSuComponent implements OnInit {
  @Input() currentPageNumber: number = 0;
  docId: number = 1;
  base64String: string = "";
  isCropImage: any;
  cropper: any;

  constructor(private http: HttpClient, private store: Store) {}

  ngOnInit() {
    this.pdfAPI();
  }

  pdfAPI() {
    this.store
      .select((state) => state)
      .subscribe((data: any) => {
        this.docId = data.app.suAdminData.docId;
      });
    let headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.http
      .get<any>(
        `https://pdfanalysis.azurewebsites.net/api/Analysis/GetDocument?data=${this.docId}`,
        {
          headers,
        }
      )
      .subscribe((data) => {
        this.base64String = data[0].doc_value;
        // console.log('base64: ', this.base64String);
        this.store.dispatch(
          updateSUAdminData({ suAdminData: { pdfSRC: data[0].doc_value } })
        );
      });
  }

  pageChange(event: any) {
    this.store.dispatch(
      updateSUAdminData({ suAdminData: { currPage: event } })
    );
  }

  public crop() {
    document.querySelector(".popup-overlay")?.classList.toggle("show");
    html2canvas(document.querySelector(".pdf-container") as HTMLElement).then(
      (canvas: any) => {
        // console.log(canvas);
        let ctx = canvas.getContext("2d");
        ctx.scale(3, 3);
        let image = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/png");
        document.querySelector("#cropper-img")?.setAttribute("src", image);
        document.querySelector("#cropper-img")?.classList.add("ready");
        this.isCropImage = true;
        let cropImg: any = document.getElementById("cropper-img");
        this.cropper = new Cropper(cropImg, {
          zoomable: true,
          background: false,
          guides: false,
          highlight: false,
          movable: false,
          ready: (e) => {
            let cropper = this.cropper;
          },
          crop: (e) => {},
        });
      }
    );
  }

  public upload() {
    if (this.isCropImage) {
      let canvas = this.cropper.getCroppedCanvas();
      this.getCanvasToUpload(canvas);
    } else {
      html2canvas(document.querySelector(".pdf-container") as HTMLElement).then(
        (canvas: any) => {
          this.getCanvasToUpload(canvas);
        }
      );
    }
  }

  private getCanvasToUpload(canvas: any) {
    let ctx = canvas.getContext("2d");
    ctx.scale(3, 3);
    let image = canvas.toDataURL("image/png").replace("image/png", "image/png");
    var link = document.createElement("a");
    link.download = "my-image.png";
    link.href = image;
    this.UpdateMasterDocumentFields(image);
    // console.log("image from getCanvasToDownload(): ", image);
    return image;
  }

  // reset crop image
  public reset() {
    this.isCropImage = false;
    this.cropper.clear();
    this.cropper.destroy();
    document.querySelector(".popup-overlay")?.classList.toggle("show");
  }

  UpdateMasterDocumentFields(fieldValue: string) {
    let headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.http.post<any>(
      "https://pdfanalysis.azurewebsites.net/api/Analysis/UpdateMasterDocumentFields",
      {
        doc_no: this.docId,
        page_no: this.currentPageNumber,
        field_no: 0,
        filed_value: fieldValue,
      },
      { headers }
    );
  }
}
