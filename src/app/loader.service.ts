// loader.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  private loaderSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public loader$ = this.loaderSubject.asObservable();
  private loading: boolean = false;

  // showLoader() {
  //   this.loaderSubject.next(true);
  // }

  // hideLoader() {
  //   this.loaderSubject.next(false);
  // }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  getLoading(): boolean {
    return this.loading;
  }
}
