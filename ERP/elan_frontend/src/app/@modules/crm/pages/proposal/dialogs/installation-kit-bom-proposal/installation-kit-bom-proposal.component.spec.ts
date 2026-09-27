import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationKitBomProposalComponent } from './installation-kit-bom-proposal.component';

describe('InstallationKitBomProposalComponent', () => {
  let component: InstallationKitBomProposalComponent;
  let fixture: ComponentFixture<InstallationKitBomProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallationKitBomProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallationKitBomProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
