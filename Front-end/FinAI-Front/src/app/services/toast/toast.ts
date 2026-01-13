import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class Toast {

  /** Base SweetAlert2 toast configuration */
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  /**
   * Displays a success toast message.
   * @param message Message to be shown
   */
  success(message: string): void {
    this.toast.fire({
      icon: 'success',
      title: message,
      background: '#daf7e2ff',
      iconColor: '#38a169',
    });
  }

  /**
   * Displays an error toast message.
   * @param message Message to be shown
   */
  error(message: string): void {
    this.toast.fire({
      icon: 'error',
      title: message,
      background: '#fff5f5',
      iconColor: '#e53e3e',
    });
  }
}
