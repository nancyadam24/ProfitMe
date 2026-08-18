import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppUXService {

  /* ---------- HAPTICS ---------- */
  haptic(ms = 15) {
    if ('vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  }

  /* ---------- SCROLL ---------- */
  lockScroll() {
    document.body.style.overflow = 'hidden';
  }

  unlockScroll() {
    document.body.style.overflow = '';
  }

  scrollTop(smooth = false) {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  /* ---------- KEYBOARD ---------- */
  blurActiveInput() {
    const el = document.activeElement as HTMLElement | null;
    el?.blur();
  }

  /* ---------- APP FEEDBACK ---------- */
  success() {
    this.haptic(20);
  }

  error() {
    this.haptic(40);
  }
}
