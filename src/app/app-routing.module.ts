import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './analysis-page/table/table.component';
import { AdminComponent } from './admin/admin.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';

const routes: Routes = [
  { path: 'analysis', component: TableComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'super-admin', component: SuperAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
