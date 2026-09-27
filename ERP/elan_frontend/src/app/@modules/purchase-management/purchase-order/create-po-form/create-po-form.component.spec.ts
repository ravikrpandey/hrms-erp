import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePoFormComponent } from './create-po-form.component';

describe('CreatePoFormComponent', () => {
  let component: CreatePoFormComponent;
  let fixture: ComponentFixture<CreatePoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
