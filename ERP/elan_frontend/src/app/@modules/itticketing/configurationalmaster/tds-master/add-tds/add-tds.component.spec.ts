import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTdsComponent } from './add-tds.component';

describe('AddTdsComponent', () => {
  let component: AddTdsComponent;
  let fixture: ComponentFixture<AddTdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTdsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
