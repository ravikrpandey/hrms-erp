import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRequestApprovalComponent } from './material-request-approval.component';

describe('MaterialRequestApprovalComponent', () => {
  let component: MaterialRequestApprovalComponent;
  let fixture: ComponentFixture<MaterialRequestApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialRequestApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialRequestApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
