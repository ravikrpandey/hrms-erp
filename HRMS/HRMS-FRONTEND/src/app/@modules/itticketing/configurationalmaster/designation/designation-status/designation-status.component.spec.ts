import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationStatusComponent } from './designation-status.component';

describe('DesignationStatusComponent', () => {
  let component: DesignationStatusComponent;
  let fixture: ComponentFixture<DesignationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
