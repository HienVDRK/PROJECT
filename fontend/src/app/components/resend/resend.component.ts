import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.css']
})
export class ResendComponent implements OnInit {

  resendForm: FormGroup
  constructor(private userService: UserService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.resendForm = this.formBuilder.group({
      email: ["", Validators.required]
    })
   }

  ngOnInit() {
  }

  resend(email) {
    this.userService.resend(email).subscribe((respone: any)=>{
      if(respone.status == 200){
        this.snackBar.open(respone.message, 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
        this.router.navigate(['/login'])
      }
      if(respone.status == 400 || respone.status == 401){
        this.snackBar.open(respone.message, 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
      }
    }), err => {
      console.log('err resend ---', err)
    }
  }
}
