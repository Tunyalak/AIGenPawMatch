export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  size: 'toy' | 'small' | 'medium' | 'large' | 'giant';
  energy: 'low' | 'moderate' | 'high' | 'very-high';
  activities: string[];
  bio: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  ownerId: string;
  ownerName: string;
}

export interface DogProfile extends Dog {
  createdAt: Date;
  updatedAt: Date;
}

export interface SwipeAction {
  dogId: string;
  action: 'pass' | 'like' | 'favorite';
  timestamp: Date;
}

export interface Match {
  id: string;
  dog: Dog;
  matchedAt: Date;
  chatId?: string;
}

export interface DogFilters {
  radiusKm: number;
  breeds: string[];
  ageRange: { min: number; max: number };
  sizes: ('toy' | 'small' | 'medium' | 'large' | 'giant')[];
  energyLevels: ('low' | 'moderate' | 'high' | 'very-high')[];
  activities: string[];
}

export const DEFAULT_FILTERS: DogFilters = {
  radiusKm: 50,
  breeds: [],
  ageRange: { min: 0, max: 15 },
  sizes: [],
  energyLevels: [],
  activities: []
};

export const ACTIVITY_OPTIONS = [
  'Walking',
  'Running',
  'Hiking',
  'Swimming',
  'Fetch',
  'Agility',
  'Dog Parks',
  'Beach',
  'Camping',
  'Training'
];

export const BREED_OPTIONS = [
  'Australian Shepherd',
  'Beagle',
  'Border Collie',
  'Boston Terrier',
  'Boxer',
  'Bulldog',
  'Cavalier King Charles Spaniel',
  'Dachshund',
  'Doberman Pinscher',
  'French Bulldog',
  'German Shepherd',
  'German Shorthaired Pointer',
  'Golden Retriever',
  'Great Dane',
  'Labrador Retriever',
  'Miniature Schnauzer',
  'Mixed Breed',
  'Pembroke Welsh Corgi',
  'Pomeranian',
  'Poodle',
  'Rottweiler',
  'Shih Tzu',
  'Siberian Husky',
  'Yorkshire Terrier'
];
