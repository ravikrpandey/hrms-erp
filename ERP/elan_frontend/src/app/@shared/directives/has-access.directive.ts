import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AccessControlService } from '../services/access-control.service';

/**
 * Structural directive to show/hide elements based on module access
 * 
 * Usage:
 * <div *hasAccess="moduleId">Content</div>
 * <button *hasAccess="{ moduleId: 5, permission: 'write' }">Edit</button>
 */
@Directive({
  selector: '[hasAccess]',
})
export class HasAccessDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private moduleId: number | null = null;
  private permission: 'read' | 'write' | 'remove' | null = null;
  private hasView = false;

  @Input() set hasAccess(value: number | { moduleId: number; permission?: 'read' | 'write' | 'remove' }) {
    if (typeof value === 'number') {
      this.moduleId = value;
      this.permission = null;
    } else if (value && typeof value === 'object') {
      this.moduleId = value.moduleId;
      this.permission = value.permission || null;
    }
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private accessControl: AccessControlService
  ) {}

  ngOnInit() {
    // Subscribe to access data changes
    this.accessControl.accessData$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView() {
    if (this.moduleId === null) {
      this.showView();
      return;
    }

    const hasAccess = this.permission
      ? this.accessControl.hasPermission(this.moduleId, this.permission)
      : this.accessControl.hasModuleAccess(this.moduleId);

    if (hasAccess && !this.hasView) {
      this.showView();
    } else if (!hasAccess && this.hasView) {
      this.hideView();
    }
  }

  private showView() {
    this.viewContainer.createEmbeddedView(this.templateRef);
    this.hasView = true;
  }

  private hideView() {
    this.viewContainer.clear();
    this.hasView = false;
  }
}
