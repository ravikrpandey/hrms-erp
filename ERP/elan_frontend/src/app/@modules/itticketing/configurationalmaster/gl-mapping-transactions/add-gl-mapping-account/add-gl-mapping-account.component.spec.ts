import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGlMappingAccountComponent } from './add-gl-mapping-account.component';

describe('AddGlMappingAccountComponent', () => {
  let component: AddGlMappingAccountComponent;
  let fixture: ComponentFixture<AddGlMappingAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGlMappingAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGlMappingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
