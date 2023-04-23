import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateAdminData } from '../store/actions/app.action';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  dropdownList$: Observable<Array<any>> = new Observable();

  constructor(private http: HttpClient, private store: Store) {}

  ngOnInit() {
    let headers = new HttpHeaders({
      'Accept': '*/*'
    });
    this.dropdownList$ = this.http
			.get<any>('https://pdfanalysis.azurewebsites.net/api/Analysis/GetAllDocumentList', {
        headers: headers
      })
  }

  currentPageNumber: number = 1;
  docType: number = 1;

  changeCurrentPageNumber(newPageNumber: number) {
    this.currentPageNumber = newPageNumber;
  }

  onDropdownChange(event: any) {
    console.log('event form dropdownChange(): ', event.target.value);
    this.docType = parseInt(event.target.value);
    this.currentPageNumber = 1;
    this.store.dispatch(
      updateAdminData({ adminData: { docId: parseInt(event.target.value)} })
    );
  }
}
