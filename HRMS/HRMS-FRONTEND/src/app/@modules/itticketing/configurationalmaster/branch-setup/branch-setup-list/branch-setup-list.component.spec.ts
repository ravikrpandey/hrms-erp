import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSetupListComponent } from './branch-setup-list.component';

describe('BranchSetupListComponent', () => {
  let component: BranchSetupListComponent;
  let fixture: ComponentFixture<BranchSetupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchSetupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
