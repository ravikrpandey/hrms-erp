import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMappingComponent } from './create-mapping.component';

describe('CreateMappingComponent', () => {
  let component: CreateMappingComponent;
  let fixture: ComponentFixture<CreateMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
