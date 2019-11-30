import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  users$: Observable<any[]>;
  db: DatabaseService;
  
  constructor(db: DatabaseService) {
    this.db = db;

    db.getAllUsers().subscribe(data => {
      console.log(data);
      this.getSortedUsers();
    });
  }

  ngOnInit() {
  }

  getSortedUsers() {
    this.db.getAllUsersSortedAdmin().then(snapshot => {
      var documents = [];
      
      snapshot.forEach(doc => {
        documents.push(doc.data());
      });

      this.users$ = Observable.create(obs => {
        obs.next(documents);
      });
    });
  }

}
