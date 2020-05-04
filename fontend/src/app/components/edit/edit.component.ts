import { Component, OnInit } from '@angular/core';
import { IssueService } from '../../issue.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Issue } from '../../issue.model'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id: String;
  selectedStatus: String;
  selectedSeverity: String;
  issue: any = {};
  updateForm: FormGroup;
  auth = JSON.parse(localStorage.getItem('auth')) || '';
  constructor(private issueService: IssueService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
    this.updateForm = this.formBuilder.group({
      title: ["", Validators.required],
      responsible: "",
      description: "",
      severity: "",
      status: ""
    })
  }


  ngOnInit() {
    if (this.auth == '') {
      this.router.navigate(['/login']);
    }

    this.route.params.subscribe(params => {
      this.id = params.id;
      this.issueService.getIssueById(this.id).subscribe(respone => {
        this.issue = respone;
        this.updateForm.get('title').setValue(this.issue.title);
        this.updateForm.get('responsible').setValue(this.issue.responsible);
        this.updateForm.get('description').setValue(this.issue.description);
        this.updateForm.get('severity').setValue(this.issue.severity);
        this.updateForm.get('status').setValue(this.issue.status);
      })
    })
  }

  updateIssue(title, responsible, description, severity, status) {
    const objIssue = {
      title: title,
      responsible: responsible,
      description: description,
      severity: severity,
      status: status
    }
    this.issueService.updateIssues(this.id, objIssue).subscribe((respone: any) => {
      if (respone.status == 200) {
        this.snackBar.open(respone.message, 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'end'
        })
        this.router.navigate(['/list']);
      }
    }), err => {
      console.log('err updateIssue --', err);
    }
  }
}
