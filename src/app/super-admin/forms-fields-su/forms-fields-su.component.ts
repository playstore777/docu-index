import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import html2canvas from "html2canvas";
import { Store } from "@ngrx/store";
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
} from "rxjs";
import { updateSUAdminData } from "src/app/store/actions/app.action";

@Component({
  selector: "app-forms-fields-su",
  templateUrl: "./forms-fields-su.component.html",
  styleUrls: ["./forms-fields-su.component.css"],
})
export class FormsFieldsSuComponent implements OnInit {
  @Input() currentPageNumber: number = 2;
  index: number = 0;
  allSelectedReview: boolean = false;
  allSelectedMandatory: boolean = false;
  isCropImage: any;
  cropper: any;
  selectedFieldsList: Array<any> = [];
  cropTarget: any;

  data$: Observable<any> = new Observable();
  pageFields: any = [];

  //cache data
  currPageNo: number = 0;
  docId: number = 0;
  subscription: any;
  uploadedList: Array<Number> = [];

  addFieldButton = document.querySelector(".bottom-toolbar .add");

  constructor(private http: HttpClient, private store: Store) {}

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
        debounceTime(300), // Debounce the API request for 300ms
        catchError((error) => {
          // Handle errors and return an empty observable to prevent breaking the chain
          console.error("Error in getFieldsAPI:", error);
          return of(null);
        })
      )
      .subscribe((data: any) => {
        if (this.allSelectedReview) {
          this.allSelectedReview = false;
        }
        const docID = data?.app?.suAdminData?.docId; // Use optional chaining to safely access nested properties
        if (docID !== this.docId) {
          console.log(this.index++);
          this.pageFields = [];
          this.currentPageNumber = 1;
          this.http
            .get<any>(
              `https://pdfanalysis.azurewebsites.net/api/Analysis/GetMasterDocumentFields?Doc_Id=${docID}`,
              {
                headers: new HttpHeaders({
                  Accept: "*/*",
                }),
              }
            )
            .subscribe((res) => {
              this.data$ = of(res);
              this.updatePageData();
              this.store.dispatch(
                updateSUAdminData({ suAdminData: { fieldsList: res } })
              );
              console.log(
                "response from form-fields-su: ",
                res,
                this.data$,
                this.pageFields
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
    // let selectedFields = this.data$.filter(
    //   (element: any) => element.isSelectedReview === true
    // );
    // console.log("from onSubmit(): ", selectedFields);
    this.selectedFieldsList.forEach((item: any) => {
      let obj = {
        doc_no: this.docId,
        page_no: item.pageNumber,
        field_no: item.fieldNumber,
        mandatory: "Y",
      };

      // console.log("object to be sent: ", JSON.stringify(obj));

      let headers = new HttpHeaders({
        Accept: "*/*",
        "Content-Type": "application/json",
      });
      this.http
        .post<any>(
          `https://pdfanalysis.azurewebsites.net/api/Analysis/UpdateDocumentFields`,
          obj,
          {
            headers: headers,
          }
        )
        .subscribe((e) => e);
    });
  }

  onChangeSelectAll() {
    // if (this.allSelectedReview) {
    //   this.data.forEach((element:any) => element.isSelectedReview = true);
    // }else{
    //   this.data.forEach((element:any) => element.isSelectedReview = false);
    // }
  }

  public crop(event: any) {
    this.cropTarget = event.target;
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
    let imageBase64SRC;
    if (this.isCropImage) {
      const canvas = this.cropper.getCroppedCanvas();
      imageBase64SRC = this.getCanvasToUpload(canvas);
    } else {
      html2canvas(document.querySelector(".pdf-container") as HTMLElement).then(
        (canvas: any) => {
          imageBase64SRC = this.getCanvasToUpload(canvas);
        }
      );
    }
    const fieldNumber = parseInt(
      this.cropTarget.parentElement.parentElement.parentElement.children[1]
        .textContent
    );
    this.http.post<any>('https://pdfanalysis.azurewebsites.net/api/Analysis/UpdateMasterDocumentFields', {
      doc_no: this.docId,
      page_no: this.currPageNo,
      field_no: fieldNumber,
      filed_value: imageBase64SRC
    });
    this.updateImageAfterUpload(imageBase64SRC, fieldNumber);
    document.querySelector(".popup-overlay")?.classList.toggle("show");
  }

  private getCanvasToUpload(canvas: any) {
    let ctx = canvas.getContext("2d");
    ctx.scale(3, 3);
    let image = canvas.toDataURL("image/png").replace("image/png", "image/png");
    var link = document.createElement("a");
    link.download = "my-image.png";
    link.href = image;
    return image;
    // this.UpdateMasterDocumentFields(image);
    // console.log("image from getCanvasToDownload(): ", image);
  }

  // reset crop image
  public reset() {
    this.isCropImage = false;
    this.cropper.clear();
    this.cropper.destroy();
    document.querySelector(".popup-overlay")?.classList.toggle("show");
  }

  updateImageAfterUpload(imgSrc: string, fieldNumber: number) {
    const temp: Array<any> = [];
    this.data$.subscribe((element) => {
      element.forEach((data: any) => {
        if (data.field_no === fieldNumber) {
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
}
