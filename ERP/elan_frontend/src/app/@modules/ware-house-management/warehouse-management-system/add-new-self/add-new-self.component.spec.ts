import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSelfComponent } from './add-new-self.component';

describe('AddNewSelfComponent', () => {
  let component: AddNewSelfComponent;
  let fixture: ComponentFixture<AddNewSelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewSelfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
