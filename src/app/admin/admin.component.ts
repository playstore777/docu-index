import { Component } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { updateAdminData } from "../store/actions/app.action";
import { AdminService } from "../services/admin-services/admin.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent {
  dropdownList$: Observable<Array<any>> = new Observable();

  constructor(private store: Store, private service: AdminService) {}

  ngOnInit() {
    let headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.dropdownList$ = this.service.getAllDocumentList(headers);
  }

  currentPageNumber: number = 1;
  docType: number = 1;

  changeCurrentPageNumber(newPageNumber: number) {
    this.currentPageNumber = newPageNumber;
  }

  onDropdownChange(event: any) {
    this.docType = parseInt(event.target.value);
    this.currentPageNumber = 1;
    this.store.dispatch(
      updateAdminData({ adminData: { docId: parseInt(event.target.value) } })
    );
  }
}
