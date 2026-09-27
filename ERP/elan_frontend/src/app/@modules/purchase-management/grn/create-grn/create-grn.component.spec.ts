import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGrnComponent } from './create-grn.component';

describe('CreateGrnComponent', () => {
  let component: CreateGrnComponent;
  let fixture: ComponentFixture<CreateGrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
