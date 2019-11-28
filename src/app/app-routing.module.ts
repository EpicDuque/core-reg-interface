import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserlistComponent } from './components/views/userlist/userlist.component';
import { RecentComponent } from './components/views/recent/recent.component';

const routes: Routes = [
  {path: 'users', component: UserlistComponent},
  {path: 'recent', component: RecentComponent},
  {path: '', redirectTo: '/recent', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
