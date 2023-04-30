import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { AnalysisComponent } from './analysis-page/analysis/analysis.component';

const routes: Routes = [
  { path: 'analysis', component: AnalysisComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'super-admin', component: SuperAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
