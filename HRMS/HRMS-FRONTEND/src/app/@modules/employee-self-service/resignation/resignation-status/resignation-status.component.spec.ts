import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationStatusComponent } from './resignation-status.component';

describe('ResignationStatusComponent', () => {
  let component: ResignationStatusComponent;
  let fixture: ComponentFixture<ResignationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResignationStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResignationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
