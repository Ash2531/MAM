import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 1000;
    }

    .toast {
      padding: 1rem;
      border-radius: 8px;
      color: white;
      animation: slide-in 0.3s ease-out;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 300px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .toast.success {
      background: #059669;
    }

    .toast.error {
      background: #dc2626;
    }

    .toast.info {
      background: #3b82f6;
    }

    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `],
  template: `
    <div class="toast-container">
      @for (toast of toasts(); track toast.message) {
        <div class="toast" [class]="toast.type">
          <span>{{ getIcon(toast.type) }}</span>
          {{ toast.message }}
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toasts = signal<Toast[]>([]);

  getIcon(type: Toast['type']): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
    }
  }

  show(toast: Toast): void {
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => {
      this.toasts.update(t => t.filter(x => x !== toast));
    }, 3000);
  }
}
