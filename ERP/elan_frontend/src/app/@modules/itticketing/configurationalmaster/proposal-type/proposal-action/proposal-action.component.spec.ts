import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalActionComponent } from './proposal-action.component';

describe('ProposalActionComponent', () => {
  let component: ProposalActionComponent;
  let fixture: ComponentFixture<ProposalActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
