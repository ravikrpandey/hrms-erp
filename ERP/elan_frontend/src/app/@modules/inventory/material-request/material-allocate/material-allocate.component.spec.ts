import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAllocateComponent } from './material-allocate.component';

describe('MaterialAllocateComponent', () => {
  let component: MaterialAllocateComponent;
  let fixture: ComponentFixture<MaterialAllocateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialAllocateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialAllocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
