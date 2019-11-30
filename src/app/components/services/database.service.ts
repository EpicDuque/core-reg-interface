import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private af: AngularFirestore;
  private checksCol: AngularFirestoreCollection;
  private userCol: AngularFirestoreCollection;

  constructor(af: AngularFirestore) {
    this.af = af;
    this.checksCol = af.collection('checks');
    this.userCol = af.collection('users');
  }

  // Checks Collection
  getChecksCol(): AngularFirestoreCollection {
    return this.checksCol;
  }
  getAllChecks(): Observable<any[]> {
    return this.checksCol.valueChanges();
  }
  getLatestChecks(lim: number): Promise<firestore.QuerySnapshot> {
    return this.checksCol.ref.orderBy('time', 'desc').limit(lim).get();
  }

  // User Collection
  getUser(param: string, arg: string): firebase.firestore.Query {
    return this.userCol.ref.where(param, '==', arg);
  }
  getAllUsers(): Observable<any[]> {
    return this.userCol.valueChanges();
  }
  getAllUsersSortedAdmin() {
    return this.userCol.ref.orderBy('admin', 'desc').get();
  }
  getUsersCol() {
    return this.userCol.ref;
  }

  // Debug Functions
}
