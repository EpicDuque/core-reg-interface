import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserlistComponent } from './components/views/userlist/userlist.component';

const routes: Routes = [
  {path: 'users', component: UserlistComponent},
  {path: '', redirectTo: '/users', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
