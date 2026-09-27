import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSourceActionComponent } from './lead-source-action.component';

describe('LeadSourceActionComponent', () => {
  let component: LeadSourceActionComponent;
  let fixture: ComponentFixture<LeadSourceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadSourceActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadSourceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
