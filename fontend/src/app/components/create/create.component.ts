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

  constructor(private issueService: IssueService, private router: Router, private snackBar: MatSnackBar, private formBuilder: FormBuilder) {
    this.createForm = this.formBuilder.group({
      title: ["", Validators.required],
      responsible: "",
      description: "",
      severity: ""
    })
  }

  ngOnInit() {
  }

  addIssue(title, responsible, description, severity) {
    this.issueService.addIssues(title, responsible, description, severity).subscribe(() => {
      this.router.navigate([`/list`]);
    })
  }
}
