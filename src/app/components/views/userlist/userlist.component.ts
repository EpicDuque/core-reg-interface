import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  users$: Observable<any[]>;
  
  constructor(private db: DatabaseService) {
    this.users$ = db.getAllUsers();
  }

  ngOnInit() {
  }

}
