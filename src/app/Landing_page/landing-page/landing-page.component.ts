import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  isDarkMode = false;

  ngOnInit(): void {
    // Leer la preferencia de tema desde el localStorage
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();
  }

  toggleDarkMode() {
    // Alternar el estado del modo oscuro
    this.isDarkMode = !this.isDarkMode;
    // Guardar la preferencia en el localStorage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  updateTheme() {
    // Agregar o quitar la clase 'dark' en el elemento <html>
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
