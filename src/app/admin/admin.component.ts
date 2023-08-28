import { Component } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import { Store } from "@ngrx/store";
import { Observable, map, of, take } from "rxjs";

import {
  clearSUAdminData,
  updateAdminData,
  updateSUAdminData,
} from "../store/actions/app.action";
import { AdminService } from "../services/admin-services/admin.service";
import { LoaderService } from "../loader.service";
import { SuperAdminService } from "../services/super-admin-services/super-admin.service";
import { Router } from "@angular/router";

enum FieldConfigENUM {
  NOTSAVED = "Not Saved",
  SAVED = "Saved",
}

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent {
  dropdownList$: Observable<Array<any>> = new Observable();
  formsList$: Observable<Array<any>> = new Observable();
  currentPageNumber: number = 1;
  docType: number = 1;
  form: string = "0";
  fieldConfig: string = FieldConfigENUM.NOTSAVED;
  facility: string = "Select any Facility";
  facilitiesList: any = [];
  selectedForm: any = { name: "", value: "" };
  totalPages: any;
  formsList: any;
  pdfSrc: string = "";
  postRes: any;
  isSaveBtnClicked: boolean = false;

  constructor(
    private store: Store,
    private adminService: AdminService,
    private superAdminService: SuperAdminService,
    // private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.loaderService.showLoader();
    this.checkConfigStatus();
  }

  openPopupModal() {
    document.querySelector(".popup-overlay")?.classList.toggle("show");
  }

  closePopupModal() {
    document.querySelector(".popup-overlay")?.classList.toggle("show");
  }
  
  saveHandler() {
    this.closePopupModal();
    this.router.navigate(["analysis"]);
  }

  checkConfigStatus() {
    let headers = new HttpHeaders({
      Accept: "*/*",
    });
    this.dropdownList$ =
      this.fieldConfig === FieldConfigENUM.NOTSAVED
        ? this.superAdminService.getMasterForms(headers)
        : this.adminService.getAllDocumentList(headers);
    this.dropdownList$.subscribe((e) => {
      if (e.length > 0) {
        this.formsList = e;
        this.facilitiesList = [];
        e.forEach((element) => {
          if (!this.facilitiesList.includes(element.facility))
            this.facilitiesList.push(element.facility);
        });
        console.log("e for facilities: ", e);
        this.filterResponse();
        // this.loaderService.hideLoader();
      }
    });
  }

  changeCurrentPageNumber(newPageNumber: number) {
    this.currentPageNumber = newPageNumber;
  }

  onFieldConfigChange(e: any) {
    // if the selected value is not same as before. eg: Not Saved, then again Not Saved is not clicked!
    if (e.target.value !== this.fieldConfig) {
      this.fieldConfig = e.target.value;
      this.checkConfigStatus();
    }
  }

  onFacilityChange() {
    this.filterResponse();
  }

  filterResponse() {
    this.formsList$ = of([]);
    this.dropdownList$
      .pipe(
        map((list: any) => {
          // Apply your transformation logic here
          this.formsList$ = of(
            list.map((element: any) => {
              if (element.facility === this.facility) {
                if (this.fieldConfig === FieldConfigENUM.NOTSAVED) {
                  return { id: element.form_Id, name: element.from_Name };
                } else {
                  console.log("element for Admin: ", element);
                  return { id: element.doc_id, name: element.doc_name };
                }
              }
              return;
            })
          );
          return list;
        })
      )
      .subscribe(); // subscribe is madatory to fetch the data, else it will just by pass this pipe.
  }

  onFormsDropdownChange() {
    if (this.form !== "0") {
      if (this.fieldConfig === "Saved") {
        this.docType = parseInt(this.form);
        this.currentPageNumber = 1;
        this.store.dispatch(
          updateAdminData({ adminData: { docId: parseInt(this.form) } })
        );
      } else {
        this.selectedForm.name = "";
        this.selectedForm.value = "";
        this.setDocNameAndValue();
        // this.loaderService.showLoader();
        let bin = atob(this.selectedForm.value as string);
        this.totalPages = bin.match(/\/Type\s*\/Page\b/g)?.length;
        this.UploadMasterDocument(this.totalPages as number);
      }
    }
  }

  // Super Admin (for my reference - Adil)
  setDocNameAndValue() {
    this.formsList.forEach((form: any) => {
      if (form.form_Id === this.form) {
        this.selectedForm = {
          name: form.from_Name,
          value: form.from_value,
        };
      }
    });
  }

  // Super Admin (for my reference - Adil)
  async UploadMasterDocument(totalPages: number) {
    let headers = new HttpHeaders({
      Accept: "*/*",
    });
    const obj = {
      doc_id: this.form,
      doc_value: this.selectedForm.value,
      doc_name: this.selectedForm.name,
      pages: totalPages,
      facility: this.facility,
    };
    await this.superAdminService
      .uploadMasterDocument(headers, obj)
      .forEach((res: any) => {
        console.log(res);
        this.postRes = res;
      });

    this.docType = this.postRes.doc_id;
    this.store.dispatch(clearSUAdminData());
    this.store.dispatch(
      updateSUAdminData({
        suAdminData: { docId: this.docType, pdfSRC: this.selectedForm.value },
      })
    );
  }
}
