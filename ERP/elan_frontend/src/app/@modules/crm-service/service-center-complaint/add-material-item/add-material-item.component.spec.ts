import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialItemComponent } from './add-material-item.component';

describe('AddMaterialItemComponent', () => {
  let component: AddMaterialItemComponent;
  let fixture: ComponentFixture<AddMaterialItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMaterialItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
