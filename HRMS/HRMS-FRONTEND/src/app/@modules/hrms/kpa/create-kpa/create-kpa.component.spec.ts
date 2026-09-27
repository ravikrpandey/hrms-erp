import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKpaComponent } from './create-kpa.component';

describe('CreateKpaComponent', () => {
  let component: CreateKpaComponent;
  let fixture: ComponentFixture<CreateKpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateKpaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateKpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
