import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedSaleryProcessListComponent } from './approved-salery-process-list.component';

describe('ApprovedSaleryProcessListComponent', () => {
  let component: ApprovedSaleryProcessListComponent;
  let fixture: ComponentFixture<ApprovedSaleryProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedSaleryProcessListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedSaleryProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
