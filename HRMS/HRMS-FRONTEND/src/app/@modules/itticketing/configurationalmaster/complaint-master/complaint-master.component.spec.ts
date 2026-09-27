import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintMasterComponent } from './complaint-master.component';

describe('ComplaintMasterComponent', () => {
  let component: ComplaintMasterComponent;
  let fixture: ComponentFixture<ComplaintMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
