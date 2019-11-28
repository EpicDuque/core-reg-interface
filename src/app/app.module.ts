import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { TopbarComponent } from './components/views/topbar/topbar.component';
import { SidepanelComponent } from './components/views/sidepanel/sidepanel.component';
import { UserlistComponent } from './components/views/userlist/userlist.component';
import { AboutComponent } from './components/pages/about/about.component';
import { RecentComponent } from './components/views/recent/recent.component';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    SidepanelComponent,
    UserlistComponent,
    AboutComponent,
    RecentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
  ],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule { }
