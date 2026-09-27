import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceCreateComponent } from './grievance-create.component';

describe('GrievanceCreateComponent', () => {
  let component: GrievanceCreateComponent;
  let fixture: ComponentFixture<GrievanceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
