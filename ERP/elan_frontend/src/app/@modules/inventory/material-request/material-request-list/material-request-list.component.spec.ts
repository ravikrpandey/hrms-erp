import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRequestListComponent } from './material-request-list.component';

describe('MaterialRequestListComponent', () => {
  let component: MaterialRequestListComponent;
  let fixture: ComponentFixture<MaterialRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialRequestListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
