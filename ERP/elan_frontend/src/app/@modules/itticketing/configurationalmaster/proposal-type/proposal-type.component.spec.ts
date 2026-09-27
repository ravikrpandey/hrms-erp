import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalTypeComponent } from './proposal-type.component';

describe('ProposalTypeComponent', () => {
  let component: ProposalTypeComponent;
  let fixture: ComponentFixture<ProposalTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
