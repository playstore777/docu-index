import { Component } from "@angular/core";
import { LoaderService } from "./loader.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "docu-index";
  showLoader: boolean = false;

  constructor(public loaderService: LoaderService) {}

  toggleLoader(show: boolean) {
    console.log("this.toggleLoader: ", show);
    this.showLoader = show;
  }

  highlightNavLink(e: any) {
    const navLink = e.target.parentElement;
    const navLinks = Array.from(navLink.parentElement.children);
    for (let element of navLinks) {
      const temp = element as HTMLElement;
      temp.classList.remove("selected");
    }
    navLink.classList.add("selected");
  }
}
