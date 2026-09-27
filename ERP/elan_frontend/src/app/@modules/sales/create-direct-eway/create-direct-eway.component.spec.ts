import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectEwayComponent } from './create-direct-eway.component';

describe('CreateDirectEwayComponent', () => {
  let component: CreateDirectEwayComponent;
  let fixture: ComponentFixture<CreateDirectEwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDirectEwayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDirectEwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
