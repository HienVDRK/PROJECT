import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private userService: UserService, private snackBar: MatSnackBar, private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit() {
  }

  login(email, password) {
    this.userService.login(email, password).subscribe((respone: any) => {
      if (respone.status == 200) {
        localStorage.setItem('auth', JSON.stringify({
          'accessToken': respone.accessToken,
          'email': respone.userDb.email,
          'id': respone.userDb._id,
          'role': respone.userDb.role
        }))
        this.router.navigate([`/list`])
      }
      else if (respone.status == 400 || respone.status == 401 || respone.status == 403) {
        this.snackBar.open(respone.message, 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
      } else {
        this.snackBar.open("Something went wrong", 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
      }
    }), err => {
      console.log(err);
    }
  }
}
