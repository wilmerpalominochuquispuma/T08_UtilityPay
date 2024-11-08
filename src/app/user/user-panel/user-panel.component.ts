import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
})
export class UserPanelComponent implements OnInit {
  selectedSection: string = 'inicio';
  isDarkMode: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadDarkModePreference();
  }

  checkAuthentication() {
    const account = localStorage.getItem('metamaskAccount');
    if (!account) {
      alert('No has iniciado sesión. Redirigiendo al login.');
      this.router.navigate(['/login']);
    }
  }

  selectSection(section: string) {
    this.selectedSection = section;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  loadDarkModePreference() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
  }
}
