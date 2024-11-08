import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  fullName: string = '';
  password: string = '';
  confirmPassword: string = '';
  isDarkMode: boolean = false;

  constructor(private router: Router) {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  async connectWallet() {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        const account = accounts[0];
        console.log('Cuenta conectada:', account);
      } catch (error) {
        console.error('Error conectando a la billetera:', error);
      }
    } else {
      alert(
        'MetaMask no está instalada. Por favor instala MetaMask para continuar.'
      );
    }
  }

  register() {
    if (
      !this.email ||
      !this.fullName ||
      !this.password ||
      !this.confirmPassword
    ) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    console.log('Registrando usuario:', {
      email: this.email,
      fullName: this.fullName,
      password: this.password,
    });

    this.router.navigate(['/login']);
  }

  cancel() {
    this.router.navigate(['/landing']);
  }
}
