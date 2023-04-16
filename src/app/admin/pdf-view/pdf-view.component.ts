import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import html2canvas from 'html2canvas';
import Cropper from 'cropperjs';
import { Store } from '@ngrx/store';
import { updateAdminData } from 'src/app/store/actions/app.action';
import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css'],
})

export class PdfViewComponent implements OnInit {
  @Input() currentPageNumber: number = 1;
  base64String: string = '';
  @Output() getFieldsAPICallback = new EventEmitter<number>();
  isCropImage: any;
  cropper: any;
  
  //epic stuff!!!
  base64String$: Observable<String> = new Observable();
  docData$: Observable<any> = new Observable();
  docID: number = 0;

  constructor(private http: HttpClient, private store: Store) {}

  ngOnInit() {
    console.log(this.store.select(state => state).subscribe((data) => data));
    this.pdfAPI();
  }

  pdfAPI() {
    this.docData$ = this.store.select(state => state);
    let headers = new HttpHeaders({
      'Accept': '*/*' 
    });
    this.docData$.subscribe(
      (state: any) => {
        const docId = state.app.adminData.docId;
        if (this.docID !== docId){
          this.http
            .get<any>(`https://pdfanalysis.azurewebsites.net/api/Analysis/GetDocument?data=${docId}`, {
              headers: headers
            })
            .subscribe(data => {
              this.store.dispatch(updateAdminData({ adminData: { pdfSRC: data[0].doc_value } }))
              this.updateBase64String();
            })
            this.docID = docId;
        }
      }
    )
  }

  updateBase64String() {
    // this.base64String$ = this.store.select((store: any) => store).subscribe((data: any) => data);
    this.base64String$.subscribe((a: any) => console.log('Observable string? ', a));
    this.store.select(state => state).subscribe((data: any) => this.base64String = data.app.adminData.pdfSRC);
  }

  pageChange(event: any) {
    // this.pageNumber.emit();
    this.getFieldsAPICallback.emit();
    this.store.dispatch(
      updateAdminData({ adminData: { currPage: event} })
    );
  }

  public crop() {
    document.querySelector('.popup-overlay')?.classList.toggle('show');
    html2canvas(document.querySelector(".pdf-container") as HTMLElement).then((canvas: any) => {
      console.log(canvas)
      let ctx = canvas.getContext('2d');
      ctx.scale(3, 3);
      let image = canvas.toDataURL("image/png").replace("image/png", "image/png");
      document.querySelector("#cropper-img")?.setAttribute('src', image);
      document.querySelector('#cropper-img')?.classList.add('ready');
      this.isCropImage = true
      let cropImg: any = document.getElementById('cropper-img');
      this.cropper = new Cropper(cropImg, {
        zoomable: true,
        background: false,
        guides: false,
        highlight: false,
        movable: false,
        ready: (e) => {
          let cropper = this.cropper;
        },
        crop: (e) => {
        }
      });
    })
  }

  public download() {
    if (this.isCropImage) {
      let canvas = this.cropper.getCroppedCanvas();
      this.getCanvasToDownload(canvas)
    } else {
      html2canvas(document.querySelector(".pdf-container") as HTMLElement).then((canvas: any) => {
        this.getCanvasToDownload(canvas)
      })
    }
  }

  private getCanvasToDownload(canvas:any){
    let ctx = canvas.getContext('2d');
    ctx.scale(3, 3);
    let image = canvas.toDataURL("image/png").replace("image/png", "image/png");
    var link = document.createElement('a');
    link.download = "my-image.png";
    link.href = image;
    console.log('image from getCanvasToDownload(): ', image);
  }

  // reset crop image
  public reset() {
    this.isCropImage = false;
    this.cropper.clear();
    this.cropper.destroy();
    document.querySelector('.popup-overlay')?.classList.toggle('show');
  }
}
