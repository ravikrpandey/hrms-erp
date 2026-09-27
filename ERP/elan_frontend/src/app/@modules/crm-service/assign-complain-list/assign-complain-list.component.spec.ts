import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignComplainListComponent } from './assign-complain-list.component';

describe('AssignComplainListComponent', () => {
  let component: AssignComplainListComponent;
  let fixture: ComponentFixture<AssignComplainListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignComplainListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignComplainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
