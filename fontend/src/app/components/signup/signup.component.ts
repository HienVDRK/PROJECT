import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material';
import { ConfirmPasswordValidator } from '../../confirm-password.validator';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  constructor(private userService: UserService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.signupForm = this.formBuilder.group({
      email: ["", Validators.required],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      role: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
    }, { validator: ConfirmPasswordValidator.MatchPassword });
  }

  ngOnInit() {
  }

  signup(email, firstname, lastname, password, role) {
    this.userService.signup(email, firstname, lastname, password, role).subscribe((respone: any) => {
      if (respone.status == 200) {
        this.snackBar.open(respone.message, 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
        this.router.navigate([`/login`]);
      }
      if(respone.status == 11000) {
        this.snackBar.open(respone.message, 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
      }
      if(respone.status == 400) {
        console.log(respone.message);
      }
    }), err => {
      console.log(err);
    }
  }
}
