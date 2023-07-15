import { Component } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { updateAdminData } from "../store/actions/app.action";
import { AdminService } from "../services/admin-services/admin.service";
import { LoaderService } from "../loader.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent {
  dropdownList$: Observable<Array<any>> = new Observable();
  currentPageNumber: number = 1;
  docType: number = 1;
  facility: String = "";
  facilitiesList: any = [
    { id: "SSMS", name: "SSMS" },
    { id: "SJHMC", name: "SJHMC" },
    { id: "BJH", name: "BJH" },
    { id: "STNH", name: "STNH" },
    { id: "KUMS", name: "KUMS" },
    { id: "HYCC", name: "HYCC" },
  ];

  constructor(
    private store: Store,
    private service: AdminService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loaderService.showLoader();
    let headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.dropdownList$ = this.service.getAllDocumentList(headers);
    this.dropdownList$.subscribe((e) => {
      if (e.length > 0) {
        this.loaderService.hideLoader();
      }
    });
  }

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
