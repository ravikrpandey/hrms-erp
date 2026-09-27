import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVouherTypeComponent } from './add-vouher-type.component';

describe('AddVouherTypeComponent', () => {
  let component: AddVouherTypeComponent;
  let fixture: ComponentFixture<AddVouherTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVouherTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVouherTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
