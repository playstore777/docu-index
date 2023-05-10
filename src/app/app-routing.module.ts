import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin/admin.component";
import { SuperAdminComponent } from "./super-admin/super-admin.component";
import { AnalysisComponent } from "./analysis-page/analysis/analysis.component";
import { ReportsPageComponent } from "./reports/reports-page/reports-page.component";
import { ReportsFormComponent } from "./reports/reports-form/reports-form.component";
import { ReportsDownloadComponent } from "./reports/reports-download/reports-download.component";
import { AnalysisTableComponent } from "./analysis-page/analysis-table/analysis-table.component";

const routes: Routes = [
  { path: "analysis", component: AnalysisTableComponent },
  { path: "analysis-details", component: AnalysisComponent },
  { path: "admin", component: AdminComponent },
  { path: "super-admin", component: SuperAdminComponent },
  { path: "reports", component: ReportsPageComponent },
  { path: "reports-form", component: ReportsFormComponent },
  { path: "reports-download", component: ReportsDownloadComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
