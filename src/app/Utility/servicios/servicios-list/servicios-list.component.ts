import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import contractABI from 'src/app/abi/UtilityPay.json';  // Asegúrate de que el path sea correcto

@Component({
  selector: 'app-servicios-list',
  templateUrl: './servicios-list.component.html',
  styleUrls: ['./servicios-list.component.css'],
})
export class ServiciosListComponent implements OnInit {
  selectedService: string = '';
  paymentAmount: number = 0;
  isConnecting: boolean = false;
  isConnected: boolean = false;
  web3: Web3 | undefined;
  contractAddress: string = '0x7b96aF9Bd211cBf6BA5b0dd53aa61Dc5806b6AcE';
  contract: any;
  accounts: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.checkMetaMaskConnection();
  }

  async checkMetaMaskConnection() {
    const { ethereum } = window as any;

    if (ethereum && ethereum.isMetaMask) {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          this.accounts = accounts;
          this.isConnected = true;
          this.web3 = new Web3(ethereum);

          // Verificar que el ABI sea un array antes de pasarla al contrato
          if (Array.isArray(contractABI)) {
            this.contract = new this.web3.eth.Contract(contractABI, this.contractAddress);
            console.log('MetaMask ya está conectada:', this.accounts[0]);
          } else {
            console.error('El ABI no es un array válido.');
          }
        }
      } catch (error) {
        console.error('Error al verificar conexión MetaMask', error);
      }
    }
  }

  async connectMetaMask() {
    const { ethereum } = window as any;

    if (!ethereum) {
      alert('MetaMask no está instalada. Por favor, instálala para continuar.');
      return;
    }

    if (this.isConnecting) {
      alert('MetaMask ya está procesando una solicitud. Espera un momento.');
      return;
    }

    this.isConnecting = true;

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length > 0) {
        this.accounts = accounts;
        this.isConnected = true;
        this.web3 = new Web3(ethereum);

        if (Array.isArray(contractABI)) {
          this.contract = new this.web3.eth.Contract(contractABI, this.contractAddress);
          console.log('MetaMask conectado con cuenta:', this.accounts[0]);
        } else {
          console.error('El ABI no es un array válido.');
        }
      }
    } catch (error: any) {
      if (error.code === -32002) {
        alert('MetaMask ya está procesando una solicitud. Espera un momento.');
      } else {
        alert('Error desconocido al conectar MetaMask.');
      }
      console.error('Error al conectar MetaMask', error);
    } finally {
      this.isConnecting = false;
    }
  }

  async addFunds() {
    if (!this.isConnected) {
      alert('Conecta MetaMask antes de agregar fondos.');
      return;
    }

    if (!this.contract) {
      console.error('Contrato no inicializado.');
      alert('Hubo un problema al inicializar el contrato. Inténtalo nuevamente.');
      return;
    }

    try {
      const account = this.accounts[0];
      const amountToAdd = prompt('Ingresa la cantidad de fondos a agregar (en Ether):');

      if (amountToAdd) {
        const weiAmount = this.web3?.utils.toWei(amountToAdd, 'ether');

        await this.contract.methods.addFunds().send({
          from: account,
          value: weiAmount,
        });

        alert('Fondos agregados con éxito.');
      }
    } catch (error: any) {
      console.error('Error al agregar fondos:', error);
      alert('Hubo un error al agregar fondos. Revisa la consola para más detalles.');
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    if (!this.isConnected) {
      alert('Conecta MetaMask antes de realizar un pago.');
      return;
    }

    if (!this.selectedService || !this.paymentAmount) {
      alert('Por favor, selecciona un servicio y un monto válido.');
      return;
    }

    this.isConnecting = true;

    try {
      const account = this.accounts[0];
      if (!account) {
        throw new Error('No se encontró ninguna cuenta conectada');
      }

      const paymentValue = this.web3?.utils.toWei(this.paymentAmount.toString(), 'ether');

      await this.contract.methods
        .payService(paymentValue, this.selectedService)
        .send({
          from: account,
          value: paymentValue,
        });

      alert('Pago realizado con éxito');
    } catch (error: any) {
      console.error('Error durante el pago:', error);
      alert('Hubo un error al realizar el pago. Revisa la consola para más detalles.');
    } finally {
      this.isConnecting = false;
    }
  }
}
