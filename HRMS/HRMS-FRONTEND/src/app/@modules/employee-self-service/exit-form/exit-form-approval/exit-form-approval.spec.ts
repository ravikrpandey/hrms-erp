import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitFormApproval } from './exit-form-approval';

describe('ExitFormApproval', () => {
  let component: ExitFormApproval;
  let fixture: ComponentFixture<ExitFormApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitFormApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitFormApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
