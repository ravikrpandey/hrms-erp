import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuantityCheckComponent } from './update-quantity-check.component';

describe('UpdateQuantityCheckComponent', () => {
  let component: UpdateQuantityCheckComponent;
  let fixture: ComponentFixture<UpdateQuantityCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateQuantityCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQuantityCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
