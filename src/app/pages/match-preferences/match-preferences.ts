import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ACTIVITY_OPTIONS, BREED_OPTIONS } from '../../models/dog.model';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-match-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ],
  templateUrl: './match-preferences.html',
  styleUrl: './match-preferences.scss'
})
export class MatchPreferences implements OnInit {
  preferencesForm!: FormGroup;

  breeds = BREED_OPTIONS;
  activities = ACTIVITY_OPTIONS;

  sizes = [
    { value: 'toy', label: 'Toy', desc: 'up to 4 kg' },
    { value: 'small', label: 'Small', desc: '5-10 kg' },
    { value: 'medium', label: 'Medium', desc: '11-25 kg' },
    { value: 'large', label: 'Large', desc: '26-44 kg' },
    { value: 'giant', label: 'Giant', desc: 'over 45 kg' }
  ];

  energyLevels = [
    { value: 'low', label: 'Low', icon: '🐌' },
    { value: 'moderate', label: 'Moderate', icon: '🐕' },
    { value: 'high', label: 'High', icon: '⚡' },
    { value: 'very-high', label: 'Very High', icon: '🚀' }
  ];

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedPreferences = this.storage.getItem<any>('match_preferences');

    this.preferencesForm = this.fb.group({
      ageMin: [savedPreferences?.ageRange?.min || 0],
      ageMax: [savedPreferences?.ageRange?.max || 15],
      radiusKm: [savedPreferences?.radiusKm || 50],
      sizes: [savedPreferences?.sizes || []],
      energyLevels: [savedPreferences?.energyLevels || []],
      breeds: [savedPreferences?.breeds || []],
      activities: [savedPreferences?.activities || []]
    });
  }

  toggleSize(size: string): void {
    const sizes = this.preferencesForm.get('sizes')?.value || [];
    const index = sizes.indexOf(size);

    // Create a new array instead of mutating to ensure change detection
    const updatedSizes = index >= 0
      ? sizes.filter((s: string) => s !== size)
      : [...sizes, size];

    this.preferencesForm.patchValue({ sizes: updatedSizes });
  }

  isSizeSelected(size: string): boolean {
    const sizes = this.preferencesForm.get('sizes')?.value || [];
    return sizes.includes(size);
  }

  toggleEnergy(energy: string): void {
    const energyLevels = this.preferencesForm.get('energyLevels')?.value || [];
    const index = energyLevels.indexOf(energy);

    // Create a new array instead of mutating to ensure change detection
    const updatedLevels = index >= 0
      ? energyLevels.filter((e: string) => e !== energy)
      : [...energyLevels, energy];

    this.preferencesForm.patchValue({ energyLevels: updatedLevels });
  }

  isEnergySelected(energy: string): boolean {
    const energyLevels = this.preferencesForm.get('energyLevels')?.value || [];
    return energyLevels.includes(energy);
  }

  toggleBreed(breed: string): void {
    const breeds = this.preferencesForm.get('breeds')?.value || [];
    const index = breeds.indexOf(breed);

    // Create a new array instead of mutating to ensure change detection
    const updatedBreeds = index >= 0
      ? breeds.filter((b: string) => b !== breed)
      : [...breeds, breed];

    this.preferencesForm.patchValue({ breeds: updatedBreeds });
  }

  isBreedSelected(breed: string): boolean {
    const breeds = this.preferencesForm.get('breeds')?.value || [];
    return breeds.includes(breed);
  }

  toggleActivity(activity: string): void {
    const activities = this.preferencesForm.get('activities')?.value || [];
    const index = activities.indexOf(activity);

    // Create a new array instead of mutating to ensure change detection
    const updatedActivities = index >= 0
      ? activities.filter((a: string) => a !== activity)
      : [...activities, activity];

    this.preferencesForm.patchValue({ activities: updatedActivities });
  }

  isActivitySelected(activity: string): boolean {
    const activities = this.preferencesForm.get('activities')?.value || [];
    return activities.includes(activity);
  }

  savePreferences(): void {
    const formValue = this.preferencesForm.value;

    const preferences = {
      radiusKm: formValue.radiusKm,
      breeds: formValue.breeds,
      ageRange: {
        min: formValue.ageMin,
        max: formValue.ageMax
      },
      sizes: formValue.sizes,
      energyLevels: formValue.energyLevels,
      activities: formValue.activities
    };

    console.log('Saving preferences:', preferences);

    // บันทึกเป็น match_preferences และ dog_filters (ใช้ร่วมกัน)
    this.storage.setItem('match_preferences', preferences);
    this.storage.setItem('dog_filters', preferences);

    // กลับไปหน้า match เพื่อให้กรองทันที
    this.router.navigate(['/match']);
  }

  resetPreferences(): void {
    this.preferencesForm.patchValue({
      ageMin: 0,
      ageMax: 15,
      radiusKm: 50,
      sizes: [],
      energyLevels: [],
      breeds: [],
      activities: []
    });
  }

  goBack(): void {
    this.router.navigate(['/match']);
  }
}
