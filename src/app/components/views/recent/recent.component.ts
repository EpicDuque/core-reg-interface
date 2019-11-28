import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Observable, of, interval, Subject } from 'rxjs';
import { QuerySnapshot } from '@angular/fire/firestore';
import { firestore } from 'firebase';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css']
})
export class RecentComponent implements OnInit {

  checks$: Observable<any[]>;

  debugSnapshot: firestore.QuerySnapshot;
  users = []
  db: DatabaseService;

  public limit = 10;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  ngOnInit() {
    const observable = this.db.getAllUsers();
    const promise = observable.toPromise();

    const userSubs = observable.subscribe( users => {
      this.users = users;
      console.log(this.users);
      
      this.refreshAllChecks(this.limit);
      userSubs.unsubscribe();
    });
  }

  refreshAllChecks(lim: number){
    const db = this.db;

    db.getChecksCol().valueChanges().subscribe( () => {
      // After getting all checks collection...
      db.getLatestChecks(lim).then(snapshot => {
        var checks = [];
        
        // Get all check info then add it to the custom check array
        snapshot.forEach(checkSnapshot => {
          const check = checkSnapshot.data()
          console.log(check);

          db.getUser('uid', check.uid).get().then(querySnapshot => {
            const user = querySnapshot.docs[0].data();
            var inout: string;
            
            if(check.in){
              inout = 'Check IN'
            } else {
              inout = 'Check OUT'
            }

            checks.push({
              uid: user.uid,
              name: user.name + ' ' + user.lastname,
              time: check.time.toDate().toLocaleTimeString(),
              date: check.time.toDate().toDateString(),
              in: inout,
            })

          }).catch(reason => {
            console.error(reason, 'User not found');
            checks.push({
              name: '[NotFound]',
              time: '',
              date: '',
            })
          })
        });

        return checks;
      }).then(checks => {
        // Pass out newly created checks to the observable to iterate in the page
        this.checks$ = Observable.create(obs => {
          obs.next(checks);
        });
      });
    });
  }

}
