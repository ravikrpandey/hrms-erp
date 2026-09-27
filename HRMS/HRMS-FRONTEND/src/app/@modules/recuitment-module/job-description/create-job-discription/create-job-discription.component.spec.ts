import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobDiscriptionComponent } from './create-job-discription.component';

describe('CreateJobDiscriptionComponent', () => {
  let component: CreateJobDiscriptionComponent;
  let fixture: ComponentFixture<CreateJobDiscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJobDiscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateJobDiscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
