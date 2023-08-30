import { Component, Input, ViewChild } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";

import {
  clearAdminData,
  updateAdminData,
} from "src/app/store/actions/app.action";
import { AdminService } from "src/app/services/admin-services/admin.service";
import { LoaderService } from "src/app/loader.service";
import html2canvas from "html2canvas";
import { SuperAdminService } from "src/app/services/super-admin-services/super-admin.service";

@Component({
  selector: "app-form-fields",
  templateUrl: "./form-fields.component.html",
  styleUrls: ["./form-fields.component.css"],
})
export class FormFieldsComponent {
  @Input() docType = 0;
  allSelectedReview: boolean = false;
  allSelectedMandatory: boolean = false;
  selectedFields: Array<any> = [];
  isCropImage: any;
  cropper: any;
  cropTarget: any;
  @ViewChild("layout") canvasRef: any;
  croppedImageSRC: string = "";
  isCropping: boolean = false;
  isDrawing: boolean = false;

  data$: Observable<any> = new Observable();
  
  // cache data
  docID: number = 0;
  currPageNo: number = 0;
  uploadedList: Array<Number> = [];

  addFieldButton = document.querySelector(".bottom-toolbar .add");
  rows = document.getElementsByClassName("rows");

  constructor(
    private store: Store,
    private service: AdminService, // private loaderService: LoaderService
    private superAdminService: SuperAdminService
  ) {}

  ngOnInit() {
  this.getFieldsAPI();
  }

  ngOnDestroy() {
  this.store.dispatch(clearAdminData());
  this.store
  .select((state) => state)
  .subscribe((data: any) => console.log("data on destroy: ", data));
  }

  getFieldsAPI() {
    // // this.loaderService.showLoader();
    this.store
      .select((state) => state)
      .subscribe((data: any) => {
        this.allSelectedReview = false;
        const headers = new HttpHeaders({
          Accept: "*/*",
        });
        const currentPageNumber = data.app.adminData.currPage;
        const docId = data.app.adminData.docId;
        if (this.docID !== docId || this.currPageNo !== currentPageNumber) {
          this.data$ = this.service.getDocumentFields(
            headers,
            docId,
            currentPageNumber
          );
          this.docID = docId;
          this.currPageNo = currentPageNumber;
          let temp: any = [];
          this.data$.subscribe((element) => {
            if (element.length > 0) {
            }
            element.forEach((data: any) => {
              console.log(data, data.reviewed === "Y", data.mandatory === "Y");
              data = {
                ...data,
                reviewed: data.reviewed === "Y" ? true : false,
                mandatory: data.mandatory === "Y" ? true : false,
              };
              temp.push(data);
            });
            this.data$ = of(temp);
          });
        }
      });
  }

  addField(event: any) {
    console.log("from onSubmit(): ", this.selectedFields);
    this.data$.subscribe(
      (fieldData: any) =>
        (this.selectedFields = fieldData.filter(
          (element: any) => element.reviewed || element.mandatory
        ))
    );
    this.selectedFields.forEach((item: any) => {
      let obj = {
        doc_no: item.doc_no,
        page_no: item.page_no,
        field_no: item.field_no,
        mandatory: item.mandatory ? "Y" : "N",
        reviewed: item.reviewed ? "Y" : "N",
      };

      console.log("object to be sent: ", JSON.stringify(obj), item);

      let headers = new HttpHeaders({
        Accept: "*/*",
        "Content-Type": "application/json",
      });
      this.service.updateDocumentFields(headers, obj).subscribe((e) => e);
    });
    this.highlightBottomNavBtns(event);
  }

  highlightBottomNavBtns(e: any) {
    const btn = e.target;
    const btns = Array.from(btn.parentElement.children);
    for (let element of btns) {
      const temp = element as HTMLElement;
      temp.classList.remove("btn-primary");
      temp.classList.add("btn-secondary");
    }
    btn.classList.remove("btn-secondary");
    btn.classList.add("btn-primary");
  }

  public crop(event: any) {
    this.cropTarget = event.target;
    this.isCropping = true;
    // document.querySelector(".popup-overlay")?.classList.toggle("show");
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
        console.log("#cropper-img: ", document.querySelector("#cropper-img"));
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

  // reset crop image
  public reset() {
    this.isCropImage = false;
    this.cropper.clear();
    this.cropper.destroy();
    this.isCropping = false;
    // document.querySelector(".popup-overlay")?.classList.toggle("show");
  }

  // reset crop image
  public resetDraw() {
    this.isCropImage = false;
    this.cropper.clear();
    this.cropper.destroy();
    this.isDrawing = false;
    document.querySelector(".draw-popup")?.classList.toggle("active");
  }

  updateImageAfterUpload(imgSrc: string, fieldNumber: number) {
    const temp: Array<any> = [];
    this.data$.subscribe((element) => {
      element.forEach((data: any) => {
        if (data.field_no === fieldNumber) {
          console.log("image in the blahblahblah: ", imgSrc);
          data = { ...data, imgSrc };
          this.uploadedList.push(fieldNumber);
        }
        temp.push(data);
      });
      this.data$ = of(temp);
      this.store.dispatch(updateAdminData({ adminData: { fieldsList: temp } }));
    });
    // this.updatePageData();
  }

  public drawRect() {
    // document.querySelector(".popup-overlay")?.classList.toggle("show");
    this.croppedImageSRC = this.download();
    this.isCropping = false;
    this.isDrawing = true;
    document.querySelector(".draw-popup")?.classList.toggle("active");
    let canvas = this.canvasRef.nativeElement;
    let context = canvas.getContext("2d");
    console.log("context: ", context);
    const ctx = context;

    let source = new Image();
    source.onload = () => {
      context!.drawImage(source, 0, 0);
      //Variables
      const a = canvas.getBoundingClientRect();
      var canvasx = canvas.getBoundingClientRect().left;
      var canvasy = canvas.getBoundingClientRect().top;
      var last_mousex = 0,
        last_mousey = 0;
      var mousex = 0,
        mousey = 0;
      var mousedown = false;

      //Mousedown
      canvas.addEventListener("mousedown", function (e: any) {
        last_mousex = e.clientX - canvasx;
        last_mousey = e.clientY - canvasy;
        mousedown = true;
      });

      //Mouseup
      canvas.addEventListener("mouseup", function (e: any) {
        mousedown = false;
      });

      //Mousemove
      canvas.addEventListener("mousemove", function (e: any) {
        mousex = e.clientX - canvasx;
        mousey = e.clientY - canvasy;
        if (mousedown) {
          ctx!.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
          context!.drawImage(source, 0, 0);
          ctx!.beginPath();
          var width = mousex - last_mousex;
          var height = mousey - last_mousey;
          ctx!.rect(last_mousex, last_mousey, width, height);
          ctx!.strokeStyle = "red";
          ctx!.lineWidth = 3;
          ctx!.stroke();
        }
      });
    };

    source.src = this.croppedImageSRC;
  }

  private getCanvasToDownload(canvas: any) {
    let ctx = canvas.getContext("2d");
    ctx.scale(3, 3);
    let image = canvas.toDataURL("image/png").replace("image/png", "image/png");
    var link = document.createElement("a");
    link.href = image;
    console.log("image from getCanvasToDownload(): ", image);
    return image;
  }

  public download() {
    if (this.isCropImage) {
      let canvas = this.cropper.getCroppedCanvas();
      return this.getCanvasToDownload(canvas);
    } else {
      html2canvas(document.querySelector("canvas") as HTMLElement).then(
        (canvas: any) => {
          return this.getCanvasToDownload(canvas);
        }
      );
    }
  }

  public uploadEdited() {
    html2canvas(document.querySelector("canvas") as HTMLElement).then(
      (canvas: any) => {
        const imageBase64SRC = this.getCanvasToDownload(canvas);
        const fieldNumber = parseInt(
          this.cropTarget.parentElement.parentElement.parentElement.children[2]
            .textContent
        );
        this.store
          .select((state) => state)
          .subscribe((data: any) => {
            this.currPageNo = data.app.adminData.currPage;
            this.docID = data.app.adminData.docId;
          });
        const headers = new HttpHeaders({
          Accept: "*/*",
        });
        const obj = {
          doc_no: this.docID,
          page_no: this.currPageNo,
          field_no: fieldNumber,
          filed_value: imageBase64SRC,
        };
        console.log("upload for UpdateMasterDocumentFields API", obj);
        const res = this.superAdminService
          .updateMasterDocumentFields(headers, obj)
          .subscribe((response) => {
            console.log(response);
          });
        console.log(res);
        this.updateImageAfterUpload(imageBase64SRC, fieldNumber);
      }
    );
    this.resetDraw();
  }
}
