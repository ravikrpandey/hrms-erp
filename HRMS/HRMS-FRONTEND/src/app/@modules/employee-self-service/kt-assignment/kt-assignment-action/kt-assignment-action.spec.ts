import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KtAssignmentAction } from './kt-assignment-action';

describe('KtAssignmentAction', () => {
  let component: KtAssignmentAction;
  let fixture: ComponentFixture<KtAssignmentAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KtAssignmentAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KtAssignmentAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
