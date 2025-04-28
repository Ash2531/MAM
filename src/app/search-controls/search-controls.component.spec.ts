import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchControlsComponent } from './search-controls.component';

describe('SearchControlsComponent', () => {
  let component: SearchControlsComponent;
  let fixture: ComponentFixture<SearchControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchControlsComponent]
    });
    fixture = TestBed.createComponent(SearchControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
