import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUsesComponent } from './add-uses.component';

describe('AddUsesComponent', () => {
  let component: AddUsesComponent;
  let fixture: ComponentFixture<AddUsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUsesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
