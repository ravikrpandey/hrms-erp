import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {
  private shortcuts: { [key: string]: () => void } = {}; // Store shortcuts
  private altPressed = false; // Track Alt key state
  private showShortcuts = false; // Control shortcut visibility

  constructor(private router: Router) {
    this.listenForShortcuts();
  }

  // Register a shortcut key with its action
  registerShortcut(key: string, action: () => void) {
    this.shortcuts[key.toLowerCase()] = action;
  }

  // Remove a shortcut
  unregisterShortcut(key: string) {
    delete this.shortcuts[key.toLowerCase()];
  }

  // Listen for key events
  private listenForShortcuts() {
    // window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    // window.addEventListener('keyup', (event) => this.handleKeyUp(event));
  }

  private handleKeyDown(event: KeyboardEvent) {
    // if (event.altKey) {
    //   this.altPressed = true;
    //   this.showShortcuts = true;
    // }

    // if (this.altPressed && this.shortcuts[event.key.toLowerCase()]) {
    //   event.preventDefault(); // Prevent default browser behavior
    //   this.shortcuts[event.key.toLowerCase()]();
    //   this.showShortcuts = false;
    // }
  }

  private handleKeyUp(event: KeyboardEvent) {
    // if (event.key === 'Alt') {
    //   this.altPressed = false;
    //   this.showShortcuts = false;
    // }
  }

  // Get the state of shortcut visibility
  isShortcutVisible() {
    return this.showShortcuts;
  }
}
