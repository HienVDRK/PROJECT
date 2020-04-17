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


  // issues: Issue[];
  issues;
  displayedColumns = ['title', 'responsible', 'severity', 'status', 'actions'];

  constructor(private issueService: IssueService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.fetchIssues()
  }

  fetchIssues() {
    this.issues = this.issueService.getIssues()
    // this.issueService.getIssues().subscribe((response: Issue[]) => {
    //   this.issues = response;
    //   console.log('response---', response);
    // })
  }
  editIssue(id) {
    this.router.navigate([`/edit/${id}`])
  }

  deleteIssue(id) {
    this.issueService.deleteIssue(id).subscribe(() => {
      this.fetchIssues()
    })
  }
}
