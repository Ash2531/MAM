import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SearchControlsComponent } from './search-controls.component';

describe('SearchControlsComponent', () => {
  let component: SearchControlsComponent;
  let fixture: ComponentFixture<SearchControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchControlsComponent,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
