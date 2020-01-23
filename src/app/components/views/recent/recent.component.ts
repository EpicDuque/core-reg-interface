import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Observable, of, interval, Subject } from 'rxjs';
import { first, last, debounceTime, throttleTime, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firestore } from 'firebase';
import { HostBinding } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css'],
  animations: [
    trigger('inout', [
      state('in', style({
        opacity: '1',
      })),
      state('out', style({
        opacity: '0',
      })),
      
      transition('in => out', [
        animate(150)
      ]),
      transition('out => in', [
        animate(400)
      ]),
    ])
  ]
})
export class RecentComponent implements OnInit {

  checks$: Observable<any[]>;

  debugSnapshot: firestore.QuerySnapshot;
  users = []
  db: DatabaseService;

  filterForm: FormGroup;

  isOpen = false;

  constructor(db: DatabaseService, private formBuilder: FormBuilder) {
    this.db = db;

    this.filterForm = this.formBuilder.group({
      limit: 10,
      name: '',
      date: Date.now(),
      dateTo: Date.now(),
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
    const observable = this.db.getAllUsers();

    const userSubs = observable.subscribe( users => {
      this.users = users;
      
      this.refreshAllChecks(10);
      userSubs.unsubscribe();
    });
  }

  onSubmit(data){
    console.log(data.date, data.dateTo);
    var dateFrom = new Date(data.date);
    var dateTo = new Date(data.dateTo);

    this.toggle();
    setTimeout(() => {

      this.refreshAllChecks(data.limit, data.name, dateFrom, dateTo);
    }, 150)
  }

  refreshAllChecks(lim: number = 10, name: string = null, dateFrom: Date = null, dateTo: Date = null){
    if(lim < 1 || lim > 200){
      return;
    }

    // Defaults to checks from the current day if no date is specified.
    if(dateFrom == null || dateTo == null){
      dateFrom = new Date(Date.now());
      dateTo = new Date(Date.now());

      // Start of day
      dateFrom.setHours(0);
      dateFrom.setMinutes(0);
      dateFrom.setMilliseconds(0);

      // End of Day
      dateTo.setHours(23);
      dateTo.setMinutes(59);
      dateTo.setMilliseconds(0);
    }

    const db = this.db;
    const observable = db.getChecksCol().valueChanges();

    observable.pipe(
      throttleTime(400),
      
    ).subscribe( () => {
      // After detecting a change in checks collection...

      db.getChecksByDate(dateFrom, dateTo, lim).then(snapshot => {
          var checks = [];
          
          // Get all check info then add it to the custom check array
          snapshot.forEach(checkSnapshot => {
            const check = checkSnapshot.data()

            db.getUser('uid', check.uid).get().then(querySnapshot => {
              const user = querySnapshot.docs[0].data();
              var inout: string;
              
              if(check.in){
                inout = 'Check IN'
              } else {
                inout = 'Check OUT'
              }

              var options = { timeZone: 'UTC', timeZoneName: 'short' };

              if(user.name.includes(name) || user.lastname.includes(name) || name === null){
                checks.push({
                  snum: user.snum,
                  uid: user.uid,
                  name: user.name + ' ' + user.lastname,
                  time: check.time.toDate().toLocaleTimeString('en-US', options),
                  date: check.time.toDate().toDateString(),
                  in: inout,
                })
              }

            }).catch(reason => {
              console.error(reason, 'User not found');
            })
          });

          return checks;
          }).then(checks => {
            // Pass out newly created checks to the observable to iterate in the page
            this.checks$ = Observable.create(obs => {
              obs.next(checks);
            });
          }).finally(() => {
            if(!this.isOpen){
              this.toggle()
            }
          }).catch(() => {
          if(!this.isOpen){
            this.toggle()
          }
        })
    });
  }


}
