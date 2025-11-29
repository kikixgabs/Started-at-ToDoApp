import { inject, Injectable, Injector, signal } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import gsap from 'gsap';

@Injectable({ providedIn: 'root' })
export class ModalService {
  overlay = inject(Overlay);
  injector = inject(Injector);
  overlayRef: OverlayRef | null = null;

  isOpen = signal(false);
  data = signal<any>(null);

  async open(component: any, data?: any) {
    this.data.set(data ?? null);

    if (this.overlayRef) this.overlayRef.dispose();

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());

    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: 'MODAL_DATA', useValue: data ?? null }],
    });

    const portal = new ComponentPortal(component, null, injector);
    this.overlayRef.attach(portal);

    this.isOpen.set(true);
  }

  async close() {
    if (!this.overlayRef) return;

    const element = this.overlayRef.overlayElement.querySelector('app-create-todo-component, [app-create-todo-component], div');

    if (element) {
      // Animación de salida
      await gsap.to(element, {
        duration: 0.35,
        opacity: 0,
        y: 50,
        scale: 0.9,
        ease: 'power2.inOut'
      });
    }

    this.overlayRef.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
  }
}
