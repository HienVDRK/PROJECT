import { Component, OnInit } from '@angular/core';
import { IssueService } from '../../issue.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  createForm: FormGroup;
  auth = JSON.parse(localStorage.getItem('auth')) || '';
  constructor(private issueService: IssueService, private router: Router, private snackBar: MatSnackBar, private formBuilder: FormBuilder) {
    this.createForm = this.formBuilder.group({
      title: ["", Validators.required],
      responsible: "",
      description: "",
      severity: ""
    })
  }

  ngOnInit() {
    if (this.auth == '') {
      this.router.navigate(['/login']);
    }
  }

  addIssue(title, responsible, description, severity) {
    const objIssue = {
      title: title,
      responsible: responsible,
      description: description,
      severity: severity
    }
    this.issueService.addIssues(objIssue).subscribe((respone: any) => {
      if (respone.status == 200) {
        this.snackBar.open(respone.message, 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
        this.router.navigate([`/list`])
      }
    }), err => {
      console.log('err addIssue--', err)
    }
  }
}
