import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  accounts = [
    { username: "admin", password: "123456" },
    { username: "normal", password: "123456" }
  ]
  constructor(private formBuilder: FormBuilder, private router: Router) {

    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })

  }

  ngOnInit() {
  }

  login(username, password) {
    if(this.accounts.some(account => account.username === username &&  account.password === password)){
      this.router.navigate([`/list`]);
  } else{
      alert("login không thành công");
  }
    // console.log(this.accounts)
    // console.log('username', username);
    // console.log('password', password);
  }
}
