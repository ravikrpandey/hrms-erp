import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionReportsComponent } from './collection-reports.component';

describe('CollectionReportsComponent', () => {
  let component: CollectionReportsComponent;
  let fixture: ComponentFixture<CollectionReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
