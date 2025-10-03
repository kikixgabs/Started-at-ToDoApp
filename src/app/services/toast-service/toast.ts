import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  duration: number;
  shrinking: boolean;
  visible: boolean; // 👈 fade in/out
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  showToast(msg: string, duration = 3000) {
    const id = this.counter++;
    const toast: Toast = { id, message: msg, duration, shrinking: false, visible: false };

    this.toasts.update(arr => [...arr, toast]);

    setTimeout(() => {
      this.toasts.update(arr =>
        arr.map(t => t.id === id ? { ...t, visible: true, shrinking: true } : t)
      );
    }, 50);

    setTimeout(() => {
      this.toasts.update(arr =>
        arr.map(t => t.id === id ? { ...t, visible: false } : t)
      );

      setTimeout(() => {
        this.toasts.update(arr => arr.filter(t => t.id !== id));
      }, 700);
    }, duration);
  }
}
