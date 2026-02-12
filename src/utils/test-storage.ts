/**
 * Test Storage Service
 * Run this to verify saveProfile exists
 */

import { storageService } from '../services/storage-service';

export function testStorageService() {
  console.log('🧪 Testing StorageService...');
  
  // Check if saveProfile exists
  if (typeof storageService.saveProfile === 'function') {
    console.log('✅ saveProfile method EXISTS');
  } else {
    console.log('❌ saveProfile method MISSING');
    console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(storageService)));
  }
  
  // Check if getProfile exists
  if (typeof storageService.getProfile === 'function') {
    console.log('✅ getProfile method EXISTS');
  } else {
    console.log('❌ getProfile method MISSING');
  }
  
  // Test the method
  try {
    const profile = storageService.getProfile();
    console.log('✅ getProfile works:', profile.name);
    
    storageService.saveProfile(profile);
    console.log('✅ saveProfile works!');
  } catch (error) {
    console.log('❌ Error testing methods:', error);
  }
}

// Auto-run on import
if (typeof window !== 'undefined') {
  testStorageService();
}
