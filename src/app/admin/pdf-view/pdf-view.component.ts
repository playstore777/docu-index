import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import html2canvas from "html2canvas";
import Cropper from "cropperjs";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { updateAdminData } from "src/app/store/actions/app.action";
import { AdminService } from "src/app/services/admin-services/admin.service";
import { LoaderService } from "src/app/loader.service";

@Component({
  selector: "app-pdf-view",
  templateUrl: "./pdf-view.component.html",
  styleUrls: ["./pdf-view.component.css"],
})
export class PdfViewComponent implements OnInit {
  @Input() currentPageNumber: number = 1;
  base64String: string = "";
  @Output() getFieldsAPICallback = new EventEmitter<number>();
  isCropImage: any;
  cropper: any;

  //epic stuff!!!
  base64String$: Observable<String> = new Observable();
  docData$: Observable<any> = new Observable();
  docID: number = 0;

  constructor(
    private store: Store,
    private service: AdminService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.pdfAPI();
  }

  pdfAPI() {
    this.loaderService.showLoader();
    this.docData$ = this.store.select((state) => state);
    const headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.docData$.subscribe((state: any) => {
      const docId = state.app.adminData.docId;
      if (this.docID !== docId && docId !== 0) {
        this.service.getDocument(headers, docId).subscribe((data) => {
          if (data.length > 0) {
            this.loaderService.hideLoader();
          }
          this.store.dispatch(
            updateAdminData({
              adminData: {
                pdfSRC: data[0].doc_value,
                currPage: this.currentPageNumber,
              },
            })
          );
          this.updateBase64String();
        });
        this.docID = docId;
      }
    });
  }

  updateBase64String() {
    this.loaderService.showLoader();
    this.store
      .select((state) => state)
      .subscribe((data: any) => {
        if (data.app.adminData.pdfSRC.length > 0) {
          this.loaderService.hideLoader();
        }
        this.base64String = data.app.adminData.pdfSRC;
      });
    // this.loaderService.hideLoader();
  }

  pageChange(event: any) {
    this.getFieldsAPICallback.emit();
    this.store.dispatch(updateAdminData({ adminData: { currPage: event } }));
  }

  public crop() {
    document.querySelector(".popup-overlay")?.classList.toggle("show");
    html2canvas(document.querySelector(".pdf-container") as HTMLElement).then(
      (canvas: any) => {
        console.log(canvas);
        let ctx = canvas.getContext("2d");
        const context = ctx;
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
            console.log("this.cropper: ", this.cropper);
            let cropper = this.cropper;
          },
          crop: (e) => {},
        });
      }
    );
  }

  // reset crop image
  public reset() {
    this.isCropImage = false;
    this.cropper.clear();
    this.cropper.destroy();
    document.querySelector(".popup-overlay")?.classList.toggle("show");
  }
}
