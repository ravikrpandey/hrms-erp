import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubtypeComponent } from './add-subtype.component';

describe('AddSubtypeComponent', () => {
  let component: AddSubtypeComponent;
  let fixture: ComponentFixture<AddSubtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubtypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
