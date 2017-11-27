import { TestBed, inject } from '@angular/core/testing';

import { FolderStoreService } from './folder-store.service';

describe('FolderStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FolderStoreService]
    });
  });

  it('should be created', inject([FolderStoreService], (service: FolderStoreService) => {
    expect(service).toBeTruthy();
  }));
});
