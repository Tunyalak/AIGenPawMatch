import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { ACTIVITY_OPTIONS, BREED_OPTIONS } from '../../models/dog.model';
import { StorageService } from '../../services/storage';
import { ImageUploadComponent } from '../../components/image-upload/image-upload';

@Component({
  selector: 'app-register-dog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSliderModule,
    ImageUploadComponent
  ],
  templateUrl: './register-dog.html',
  styleUrl: './register-dog.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegisterDog implements OnInit {
  dogForm!: FormGroup;
  currentStep = signal(1);
  totalSteps = 3;
  dogImageUrl = signal<string | null>(null);

  breeds = BREED_OPTIONS;
  filteredBreeds = signal<string[]>(BREED_OPTIONS);
  activities = ACTIVITY_OPTIONS;

  // Thai Provinces in English
  provinces = [
    'Amnat Charoen', 'Ang Thong', 'Bangkok', 'Bueng Kan', 'Buri Ram',
    'Chachoengsao', 'Chai Nat', 'Chaiyaphum', 'Chanthaburi', 'Chiang Mai',
    'Chiang Rai', 'Chon Buri', 'Chumphon', 'Kalasin', 'Kamphaeng Phet',
    'Kanchanaburi', 'Khon Kaen', 'Krabi', 'Lampang', 'Lamphun',
    'Loei', 'Lop Buri', 'Mae Hong Son', 'Maha Sarakham', 'Mukdahan',
    'Nakhon Nayok', 'Nakhon Pathom', 'Nakhon Phanom', 'Nakhon Ratchasima', 'Nakhon Sawan',
    'Nakhon Si Thammarat', 'Nan', 'Narathiwat', 'Nong Bua Lam Phu', 'Nong Khai',
    'Nonthaburi', 'Pathum Thani', 'Pattani', 'Phang Nga', 'Phatthalung',
    'Phayao', 'Phetchabun', 'Phetchaburi', 'Phichit', 'Phitsanulok',
    'Phra Nakhon Si Ayutthaya', 'Phrae', 'Phuket', 'Prachin Buri', 'Prachuap Khiri Khan',
    'Ranong', 'Ratchaburi', 'Rayong', 'Roi Et', 'Sa Kaeo',
    'Sakon Nakhon', 'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram', 'Saraburi',
    'Satun', 'Sing Buri', 'Si Sa Ket', 'Songkhla', 'Sukhothai',
    'Suphan Buri', 'Surat Thani', 'Surin', 'Tak', 'Trang',
    'Trat', 'Ubon Ratchathani', 'Udon Thani', 'Uthai Thani', 'Uttaradit',
    'Yala', 'Yasothon'
  ];
  filteredProvinces = signal<string[]>(this.provinces);

  energyLevels = [
    { value: 'low', label: 'Low', icon: '🐌' },
    { value: 'moderate', label: 'Moderate', icon: '🐕' },
    { value: 'high', label: 'High', icon: '⚡' },
    { value: 'very-high', label: 'Very High', icon: '🚀' }
  ];

  sizes = [
    { value: 'toy', label: 'Toy', desc: 'up to 4 kg' },
    { value: 'small', label: 'Small', desc: '5-10 kg' },
    { value: 'medium', label: 'Medium', desc: '11-25 kg' },
    { value: 'large', label: 'Large', desc: '26-44 kg' },
    { value: 'giant', label: 'Giant', desc: 'over 45 kg' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.dogForm = this.fb.group({
      // Step 1: Basic Info
      name: ['', [Validators.required, Validators.minLength(2)]],
      breed: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0), Validators.max(25)]],
      gender: ['male', Validators.required],

      // Step 2: Physical & Energy
      size: ['', Validators.required],
      energy: ['', Validators.required],

      // Step 3: Activities & Bio
      activities: [[], [Validators.required, Validators.minLength(1)]],
      bio: ['', [Validators.maxLength(300)]],

      // Location (auto-filled or user input)
      city: ['Bangkok', Validators.required]
    });
  }

  get progressPercentage(): number {
    return (this.currentStep() / this.totalSteps) * 100;
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep() < this.totalSteps) {
        this.currentStep.set(this.currentStep() + 1);
      }
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  validateCurrentStep(): boolean {
    const step = this.currentStep();

    if (step === 1) {
      const controls = ['name', 'breed', 'age', 'gender'];
      return controls.every(control => this.dogForm.get(control)?.valid);
    } else if (step === 2) {
      const controls = ['size', 'energy'];
      return controls.every(control => this.dogForm.get(control)?.valid);
    } else if (step === 3) {
      const controls = ['activities', 'bio'];
      return controls.every(control => this.dogForm.get(control)?.valid);
    }

    return false;
  }

  toggleActivity(activity: string): void {
    const activities = this.dogForm.get('activities')?.value || [];
    const index = activities.indexOf(activity);

    if (index >= 0) {
      activities.splice(index, 1);
    } else {
      activities.push(activity);
    }

    this.dogForm.patchValue({ activities });
  }

  isActivitySelected(activity: string): boolean {
    const activities = this.dogForm.get('activities')?.value || [];
    return activities.includes(activity);
  }

  filterBreeds(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredBreeds.set(
      this.breeds.filter(breed => breed.toLowerCase().includes(filterValue))
    );
  }

  onBreedInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterBreeds(input.value);
  }

  filterProvinces(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredProvinces.set(
      this.provinces.filter(province => province.toLowerCase().includes(filterValue))
    );
  }

  onProvinceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterProvinces(input.value);
  }

  async submitForm(): Promise<void> {
    if (this.dogForm.valid) {
      const dogProfile = {
        ...this.dogForm.value,
        id: Date.now().toString(),
        imageUrl: this.dogImageUrl() || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          city: this.dogForm.value.city
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.storage.setItem('user_dog_profile', dogProfile);
      this.router.navigate(['/match']);
    }
  }

  onImageSelected(dataUrl: string): void {
    this.dogImageUrl.set(dataUrl);
  }

  onImageRemoved(): void {
    this.dogImageUrl.set(null);
  }

  get canProceed(): boolean {
    return this.validateCurrentStep();
  }
}
