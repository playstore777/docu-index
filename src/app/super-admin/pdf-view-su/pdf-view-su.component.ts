import { Component, OnInit, Input } from "@angular/core";

import { Store } from "@ngrx/store";
import { Subscription, catchError, of } from "rxjs";

import {
  clearSUAdminData,
  updateSUAdminData,
} from "src/app/store/actions/app.action";

@Component({
  selector: "app-pdf-view-su",
  templateUrl: "./pdf-view-su.component.html",
  styleUrls: ["./pdf-view-su.component.css"],
})
export class PdfViewSuComponent implements OnInit {
  @Input() currentPageNumber: number = 0;
  base64String: string = "";
  subscription: Subscription = new Subscription();

  constructor(private store: Store) {}

  ngOnInit() {
    this.pdfAPI();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // Unsubscribe from the subscription when the component is destroyed
    this.store.dispatch(clearSUAdminData());
  }

  pdfAPI() {
    this.subscription = this.store
      .select((state) => state)
      .pipe(
        catchError((error) => {
          // Handle errors and return an empty observable to prevent breaking the chain
          console.error("Error in pdfAPI():", error);
          return of(null);
        })
      )
      .subscribe((data: any) => {
        this.base64String = data.app.suAdminData.pdfSRC;
      });
  }

  pageChange(event: any) {
    this.store.dispatch(
      updateSUAdminData({ suAdminData: { currPage: event } })
    );
  }
}
