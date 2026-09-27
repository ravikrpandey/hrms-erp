import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransporterComponent } from './create-transporter.component';

describe('CreateTransporterComponent', () => {
  let component: CreateTransporterComponent;
  let fixture: ComponentFixture<CreateTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTransporterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
