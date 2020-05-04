import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'fontend';

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    if (confirm("Are you sure you want to log out?")) {
      this.router.navigate(['/']);
      localStorage.removeItem('auth');
    }
  }
}
