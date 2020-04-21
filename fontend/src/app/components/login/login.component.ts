import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { IssueService } from '../../issue.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private issueService: IssueService, private formBuilder: FormBuilder, private router: Router) {

    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })

  }

  ngOnInit() {
  }

  login(username, password) {
    this.issueService.login(username, password).subscribe((respone: any) => {
      if (respone.status == 200) {
        this.router.navigate([`/list`]);
      }
      else if (respone.message === "User not found") {
        alert(respone.message)
      }
      else if (respone.message === "Incorrect password") {
        alert(respone.message)
      }
      else {
        alert(respone.message)
      }
    }), err =>{
      console.log(err);
    }
  }
}
