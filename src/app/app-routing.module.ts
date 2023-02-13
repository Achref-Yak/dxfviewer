import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';

const routes: Routes = [
  { path: '', redirectTo: '/viewer', pathMatch: 'full' },
  { path: 'viewer', component: ViewerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
