import { Issue } from './../../issue.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { IssueService } from '../../issue.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  issues: Issue[];
  displayedColumns = ['title', 'responsible', 'description', 'severity', 'status', 'actions'];
  auth = JSON.parse(localStorage.getItem('auth')) || '';
  constructor(private issueService: IssueService, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
    if (this.auth == '') {
      this.router.navigate(['/login']);
    }
    this.getIssues()
  }

  getIssues() {
    this.issueService.getIssues().subscribe((response: Issue[]) => {
      this.issues = response;
    }), err => {
      console.log('err getIssues --', err)
    }
  }
  editIssue(id) {
    if (this.auth.role == 'admin') {
      this.router.navigate([`/edit/${id}`])
    } else {
      this.snackBar.open("Not allow permission.", 'OK', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'end'
      })
    }
  }

  deleteIssue(id) {
    if (this.auth.role == 'admin') {
      if (confirm("Are you sure you want delete?")) {
        this.issueService.deleteIssue(id).subscribe((respone: any) => {
          if (respone.status == 200) {
            this.snackBar.open(respone.message, 'OK', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'end'
            })
            this.getIssues()
          }
        }), err => {
          console.log('err delete --', err)
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
