import { Component, OnInit } from '@angular/core';
import { User } from '../../user.model';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  users: User[];
  auth = JSON.parse(localStorage.getItem('auth')) || '';
  displayedColumns = ['email', 'firstname', 'lastname', 'role', 'active', 'actions'];
  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar, ) {
  }

  ngOnInit() {
    if (this.auth == '') {
      this.router.navigate(['/login']);
    }
    this.getUsers()
  }

  getUsers() {
    this.userService.getUsers().subscribe((response: User[]) => {
      this.users = response
    }), err => {
      console.log('err getUsers--', err)
    }
  }
  editUser(id) {
    if (this.auth.role == 'admin') {
      if (this.auth.id == id) {
        this.snackBar.open("The account is logged in, not edit.", 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
      } else {
        this.router.navigate([`/edit-user/${id}`])
      }
    } else {
      this.snackBar.open("Not allow permission.", 'OK', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'end'
      })
    }
  }

  deleteUser(id) {
    if (this.auth.role == 'admin') {
      if (this.auth.id == id) {
        this.snackBar.open("The account is logged in., not deleted", 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
      } else {
        this.userService.deleteUser(id).subscribe((respone: any) => {
          this.snackBar.open(respone.message, 'OK', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'end'
          })
          this.getUsers()
        }), err => {
          console.log('err deleteUser--', err)
        }
      }
    } else {
      this.snackBar.open("Not allow permission.", 'OK', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'end'
      })
    }
  }
}
