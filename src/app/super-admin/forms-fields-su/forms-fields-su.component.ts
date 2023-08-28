import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import html2canvas from "html2canvas";
import { Store } from "@ngrx/store";
import {
  Observable,
  Subscription,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
} from "rxjs";

import { updateSUAdminData } from "src/app/store/actions/app.action";
import { SuperAdminService } from "src/app/services/super-admin-services/super-admin.service";
import { LoaderService } from "src/app/loader.service";

@Component({
  selector: "app-forms-fields-su",
  templateUrl: "./forms-fields-su.component.html",
  styleUrls: ["./forms-fields-su.component.css"],
})
export class FormsFieldsSuComponent {
  @Input() currentPageNumber: number = 1;
  allSelectedReview: boolean = false;
  allSelectedMandatory: boolean = false;
  isCropImage: any;
  cropper: any;
  selectedFieldsList: Array<any> = [];
  cropTarget: any;
  @ViewChild("layout") canvasRef: any;
  croppedImageSRC: string = "";
  isCropping: boolean = false;
  isDrawing: boolean = false;

  data$: Observable<any> = new Observable();
  pageFields: any = [
  ];

  //cache data
  currPageNo: number = 0;
  docId: number = 0;
  subscription: Subscription = new Subscription();
  uploadedList: Array<Number> = [];

  constructor(
    private store: Store,
    private service: SuperAdminService // private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.getFieldsAPI();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // Unsubscribe from the subscription when the component is destroyed
  }

  getFieldsAPI() {
    console.log("SuperAdmin getFieldsAPI()");

    // Use debounceTime to debounce the API request
    this.subscription = this.store
      .select((state) => state)
      .pipe(
        debounceTime(12000), // Debounce the API request for 12000ms
        catchError((error) => {
          // Handle errors and return an empty observable to prevent breaking the chain
          console.error("Error in getFieldsAPI():", error);
          return of(null);
        })
      )
      .subscribe((data: any) => {
        if (this.allSelectedReview) {
          this.allSelectedReview = false;
        }
        const docID = data?.app?.suAdminData?.docId;
        if (docID !== this.docId && docID !== 0) {
          this.pageFields = [];
          const headers = new HttpHeaders({
            Accept: "*/*",
          });
          this.service
            .getMasterDocumentFields(headers, docID)
            .subscribe((res) => {
              // if (res)
              // this.loaderService.hideLoader();
              this.data$ = of(res);
              this.updatePageData();
              this.store.dispatch(
                updateSUAdminData({ suAdminData: { fieldsList: res } })
              );
            });
          this.docId = docID;
        }
      });
  }

  pushData(element: any, array: any) {
    const obj = {
      fieldNumber: element.field_no,
      pageNumber: element.page_no,
      imgSrc: element.imgSrc,
      keyname: element.keyname,
      // isSelectedReview: false,
      // isSelectedMandatory: false,
    };
    // console.log("obj from pushData(): ", obj);
    array.push(obj);
    return array;
  }

  updatePageData() {
    this.store
      .select((state) => state)
      .pipe(
        map((data: any) => data.app.suAdminData.currPage),
        distinctUntilChanged()
      )
      .subscribe((currPage) => {
        this.pageFields = [];
        this.data$.subscribe((element) => {
          element.forEach((data: any) => {
            if (currPage === data.page_no) {
              this.pageFields.push(data);
            }
          });
        });
      });
  }

  addField() {
    this.selectedFieldsList.forEach((item: any) => {
      let obj = {
        doc_no: this.docId,
        page_no: item.pageNumber,
        field_no: item.fieldNumber,
        mandatory: "Y",
      };

      let headers = new HttpHeaders({
        Accept: "*/*",
        "Content-Type": "application/json",
      });
      this.service.updateDocumentFields(headers, obj).subscribe((e) => e);
    });
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
    document.querySelector(".draw-popup-su")?.classList.toggle("active");
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
      this.store.dispatch(
        updateSUAdminData({ suAdminData: { fieldsList: temp } })
      );
    });
    this.updatePageData();
  }

  public drawRect() {
    // document.querySelector(".popup-overlay")?.classList.toggle("show");
    this.croppedImageSRC = this.download();
    this.isCropping = false;
    this.isDrawing = true;
    document.querySelector(".draw-popup-su")?.classList.toggle("active");
    let canvas = this.canvasRef.nativeElement;
    let context = canvas.getContext("2d");
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
        console.log("edited image: ", imageBase64SRC);
        const fieldNumber = parseInt(
          this.cropTarget.parentElement.parentElement.parentElement.children[1]
            .textContent
        );
        this.store
          .select((state) => state)
          .subscribe((data: any) => {
            this.currentPageNumber = data.app.suAdminData.currPage;
            this.docId = data.app.suAdminData.docId;
          });
        const headers = new HttpHeaders({
          Accept: "*/*",
        });
        const obj = {
          doc_no: this.docId,
          page_no: this.currentPageNumber,
          field_no: fieldNumber,
          filed_value: imageBase64SRC,
        };
        console.log("upload for UpdateMasterDocumentFields API", obj);
        const res = this.service
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
