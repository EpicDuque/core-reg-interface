import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private users: Observable<any[]>;

  constructor(af: AngularFirestore) { 
    this.users = af.collection('users').valueChanges();
  }

  getUsers() {
    return this.users;
  }
}
