import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  id;
  selectedRole: String;
  updateFormUser: FormGroup;
  auth = JSON.parse(localStorage.getItem('auth')) || '';
  user: any = {};
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
    this.updateFormUser = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      role: ["", Validators.required]
    })
  }


  ngOnInit() {
    if (this.auth == '') {
      this.router.navigate(['/login']);
    }
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.userService.getUserById(this.id).subscribe(respone => {
        this.user = respone;
        this.updateFormUser.get('firstname').setValue(this.user.firstname);
        this.updateFormUser.get('lastname').setValue(this.user.lastname);
        this.updateFormUser.get('role').setValue(this.user.role);
      })
    })
  }

  updateUser(firstname, lastname, role){
    const objUser = {
      firstname: firstname,
      lastname: lastname,
      role: role
    }
    this.userService.updateUser(this.id, objUser).subscribe((respone: any) => {
      if (respone.status == 200) {
        this.snackBar.open(respone.message, 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
        this.router.navigate(['/list-user']);
      }
    }), err => {
      console.log('err updateUser --', err);
    }
  }
}
