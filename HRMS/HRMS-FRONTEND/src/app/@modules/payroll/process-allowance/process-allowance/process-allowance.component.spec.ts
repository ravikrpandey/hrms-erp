import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessAllowanceComponent } from './process-allowance.component';

describe('ProcessAllowanceComponent', () => {
  let component: ProcessAllowanceComponent;
  let fixture: ComponentFixture<ProcessAllowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessAllowanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
