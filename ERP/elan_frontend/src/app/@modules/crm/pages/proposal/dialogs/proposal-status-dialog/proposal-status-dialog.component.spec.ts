import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalStatusDialogComponent } from './proposal-status-dialog.component';

describe('ProposalStatusDialogComponent', () => {
  let component: ProposalStatusDialogComponent;
  let fixture: ComponentFixture<ProposalStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalStatusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
