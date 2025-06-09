import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ProcedureTilesComponent } from './procedure-tiles.component';

describe('ProcedureTilesComponent', () => {
  let component: ProcedureTilesComponent;
  let fixture: ComponentFixture<ProcedureTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProcedureTilesComponent,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcedureTilesComponent);
    component = fixture.componentInstance;
    
    // Initialize the required input
    component.procedure = {
      id: 1,
      name: 'Test Procedure',
      date: new Date(),
      mediaType: 'image',
      mediaCount: 1,
      procedure: 'test',
      progress: 50,
      status: 'Active',
      showOptions: false,
      thumbnail: 'test.jpg',
      mediaUrl: 'test.jpg',
      thumbnails: ['test.jpg'],
      isPrivate: false,
      isActive: true,
      title: 'Test Title',
      code: 'TEST001',
      type: 'Test Type',
      itemCount: 1
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
