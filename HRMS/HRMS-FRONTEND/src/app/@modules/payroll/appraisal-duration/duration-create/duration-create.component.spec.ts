import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationCreateComponent } from './duration-create.component';

describe('DurationCreateComponent', () => {
  let component: DurationCreateComponent;
  let fixture: ComponentFixture<DurationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DurationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
