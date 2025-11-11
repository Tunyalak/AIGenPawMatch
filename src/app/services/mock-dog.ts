import { Injectable, signal } from '@angular/core';
import { Dog, DogFilters, SwipeAction, Match } from '../models/dog.model';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class MockDogService {
  private readonly SWIPES_KEY = 'swipes';
  private readonly MATCHES_KEY = 'matches';

  // Mock dog database
  private mockDogs: Dog[] = [
    {
      id: '1',
      name: 'Max',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male',
      size: 'large',
      energy: 'high',
      activities: ['Walking', 'Fetch', 'Swimming', 'Dog Parks'],
      bio: 'Friendly and energetic! Love meeting new friends at the park.',
      imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
      location: { lat: 13.7563, lng: 100.5018, city: 'Bangkok' },
      ownerId: 'owner1',
      ownerName: 'Sarah Johnson'
    },
    {
      id: '2',
      name: 'Bella',
      breed: 'Labrador Retriever',
      age: 2,
      gender: 'female',
      size: 'large',
      energy: 'very-high',
      activities: ['Running', 'Hiking', 'Swimming', 'Fetch'],
      bio: 'Always ready for an adventure! Let\'s explore trails together.',
      imageUrl: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=800',
      location: { lat: 18.7883, lng: 98.9853, city: 'Chiang Mai' },
      ownerId: 'owner2',
      ownerName: 'Michael Chen'
    },
    {
      id: '3',
      name: 'Charlie',
      breed: 'French Bulldog',
      age: 1,
      gender: 'male',
      size: 'small',
      energy: 'moderate',
      activities: ['Walking', 'Dog Parks', 'Training'],
      bio: 'Playful pup who loves to snuggle. Great with other dogs!',
      imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
      location: { lat: 13.7563, lng: 100.5018, city: 'Bangkok' },
      ownerId: 'owner3',
      ownerName: 'Emma Davis'
    },
    {
      id: '4',
      name: 'Luna',
      breed: 'Border Collie',
      age: 4,
      gender: 'female',
      size: 'medium',
      energy: 'very-high',
      activities: ['Agility', 'Running', 'Training', 'Fetch'],
      bio: 'Smart and athletic! Looking for active playmates.',
      imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
      location: { lat: 7.8804, lng: 98.3923, city: 'Phuket' },
      ownerId: 'owner4',
      ownerName: 'James Wilson'
    },
    {
      id: '5',
      name: 'Cooper',
      breed: 'Australian Shepherd',
      age: 3,
      gender: 'male',
      size: 'medium',
      energy: 'high',
      activities: ['Hiking', 'Running', 'Agility', 'Beach'],
      bio: 'Adventurous and loyal companion. Love outdoor activities!',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
      location: { lat: 13.3611, lng: 100.9847, city: 'Chon Buri' },
      ownerId: 'owner5',
      ownerName: 'Olivia Martinez'
    },
    {
      id: '6',
      name: 'Daisy',
      breed: 'Beagle',
      age: 5,
      gender: 'female',
      size: 'small',
      energy: 'moderate',
      activities: ['Walking', 'Dog Parks', 'Fetch'],
      bio: 'Sweet and curious! Always following my nose.',
      imageUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800',
      location: { lat: 13.7563, lng: 100.5018, city: 'Bangkok' },
      ownerId: 'owner6',
      ownerName: 'William Brown'
    },
    {
      id: '7',
      name: 'Rocky',
      breed: 'German Shepherd',
      age: 4,
      gender: 'male',
      size: 'large',
      energy: 'high',
      activities: ['Running', 'Training', 'Hiking', 'Agility'],
      bio: 'Protective and smart. Love learning new tricks!',
      imageUrl: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800',
      location: { lat: 18.7883, lng: 98.9853, city: 'Chiang Mai' },
      ownerId: 'owner7',
      ownerName: 'Sophia Anderson'
    },
    {
      id: '8',
      name: 'Molly',
      breed: 'Poodle',
      age: 2,
      gender: 'female',
      size: 'medium',
      energy: 'moderate',
      activities: ['Walking', 'Training', 'Dog Parks'],
      bio: 'Elegant and friendly. Enjoy meeting new friends!',
      imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800',
      location: { lat: 14.0208, lng: 100.5230, city: 'Nonthaburi' },
      ownerId: 'owner8',
      ownerName: 'Daniel Lee'
    },
    {
      id: '9',
      name: 'Buddy',
      breed: 'Boxer',
      age: 3,
      gender: 'male',
      size: 'large',
      energy: 'high',
      activities: ['Running', 'Fetch', 'Dog Parks', 'Beach'],
      bio: 'Energetic and fun-loving! Always up for playtime.',
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
      location: { lat: 13.7563, lng: 100.5018, city: 'Bangkok' },
      ownerId: 'owner9',
      ownerName: 'Ava Taylor'
    },
    {
      id: '10',
      name: 'Sadie',
      breed: 'Pembroke Welsh Corgi',
      age: 2,
      gender: 'female',
      size: 'small',
      energy: 'moderate',
      activities: ['Walking', 'Fetch', 'Dog Parks'],
      bio: 'Short legs, big personality! Love making new friends.',
      imageUrl: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800',
      location: { lat: 13.5282, lng: 100.2638, city: 'Samut Sakhon' },
      ownerId: 'owner10',
      ownerName: 'Noah White'
    },
    {
      id: '11',
      name: 'Duke',
      breed: 'Rottweiler',
      age: 5,
      gender: 'male',
      size: 'giant',
      energy: 'moderate',
      activities: ['Walking', 'Training', 'Hiking'],
      bio: 'Gentle giant with a big heart. Protective but friendly.',
      imageUrl: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=800',
      location: { lat: 19.9071, lng: 99.8325, city: 'Chiang Rai' },
      ownerId: 'owner11',
      ownerName: 'Isabella Harris'
    },
    {
      id: '12',
      name: 'Rosie',
      breed: 'Cavalier King Charles Spaniel',
      age: 1,
      gender: 'female',
      size: 'small',
      energy: 'low',
      activities: ['Walking', 'Training'],
      bio: 'Gentle and affectionate. Perfect cuddle buddy!',
      imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
      location: { lat: 13.7563, lng: 100.5018, city: 'Bangkok' },
      ownerId: 'owner12',
      ownerName: 'Liam Clark'
    },
    {
      id: '13',
      name: 'Zeus',
      breed: 'Siberian Husky',
      age: 3,
      gender: 'male',
      size: 'large',
      energy: 'very-high',
      activities: ['Running', 'Hiking', 'Swimming', 'Agility'],
      bio: 'Adventurous spirit! Love exploring and outdoor fun.',
      imageUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800',
      location: { lat: 7.8804, lng: 98.3923, city: 'Phuket' },
      ownerId: 'owner13',
      ownerName: 'Mia Rodriguez'
    },
    {
      id: '14',
      name: 'Coco',
      breed: 'Yorkshire Terrier',
      age: 4,
      gender: 'female',
      size: 'small',
      energy: 'low',
      activities: ['Walking', 'Dog Parks'],
      bio: 'Small but mighty! Love being the center of attention.',
      imageUrl: 'https://images.unsplash.com/photo-1516598540642-e8f40a09d939?w=800',
      location: { lat: 13.5906, lng: 100.6018, city: 'Samut Prakan' },
      ownerId: 'owner14',
      ownerName: 'Ethan Martinez'
    },
    {
      id: '15',
      name: 'Jack',
      breed: 'Boston Terrier',
      age: 2,
      gender: 'male',
      size: 'small',
      energy: 'high',
      activities: ['Fetch', 'Dog Parks', 'Training'],
      bio: 'Playful and intelligent. Always ready for fun!',
      imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
      location: { lat: 18.7883, lng: 98.9853, city: 'Chiang Mai' },
      ownerId: 'owner15',
      ownerName: 'Charlotte Garcia'
    },
    {
      id: '16',
      name: 'Ruby',
      breed: 'Dachshund',
      age: 3,
      gender: 'female',
      size: 'small',
      energy: 'moderate',
      activities: ['Walking', 'Fetch', 'Dog Parks'],
      bio: 'Curious and brave! Love exploring new places.',
      imageUrl: 'https://images.unsplash.com/photo-1612536616623-ef7e5660edbc?w=800',
      location: { lat: 14.9930, lng: 102.0977, city: 'Khon Kaen' },
      ownerId: 'owner16',
      ownerName: 'Mason Thompson'
    },
    {
      id: '17',
      name: 'Bear',
      breed: 'Great Dane',
      age: 4,
      gender: 'male',
      size: 'giant',
      energy: 'moderate',
      activities: ['Walking', 'Beach', 'Dog Parks'],
      bio: 'Big softie who loves everyone. Gentle with all dogs!',
      imageUrl: 'https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=800',
      location: { lat: 9.1382, lng: 99.3336, city: 'Surat Thani' },
      ownerId: 'owner17',
      ownerName: 'Amelia Wilson'
    },
    {
      id: '18',
      name: 'Penny',
      breed: 'Shih Tzu',
      age: 5,
      gender: 'female',
      size: 'small',
      energy: 'low',
      activities: ['Walking', 'Training'],
      bio: 'Sweet and calm. Looking for gentle playmates.',
      imageUrl: 'https://images.unsplash.com/photo-1612774412231-1c4b5c3c836b?w=800',
      location: { lat: 13.7563, lng: 100.5018, city: 'Bangkok' },
      ownerId: 'owner18',
      ownerName: 'Lucas Moore'
    },
    {
      id: '19',
      name: 'Oliver',
      breed: 'Miniature Schnauzer',
      age: 2,
      gender: 'male',
      size: 'small',
      energy: 'moderate',
      activities: ['Walking', 'Training', 'Dog Parks', 'Fetch'],
      bio: 'Alert and friendly! Love playing with other small dogs.',
      imageUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800',
      location: { lat: 14.3532, lng: 100.5699, city: 'Pathum Thani' },
      ownerId: 'owner19',
      ownerName: 'Harper Jackson'
    },
    {
      id: '20',
      name: 'Zoey',
      breed: 'Mixed Breed',
      age: 3,
      gender: 'female',
      size: 'medium',
      energy: 'high',
      activities: ['Running', 'Hiking', 'Dog Parks', 'Swimming'],
      bio: 'Unique and lovable! Best of many breeds in one.',
      imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800',
      location: { lat: 13.3611, lng: 100.9847, city: 'Chon Buri' },
      ownerId: 'owner20',
      ownerName: 'Benjamin Davis'
    },
    {
      id: '21',
      name: 'Milo',
      breed: 'Pomeranian',
      age: 2,
      gender: 'male',
      size: 'small',
      energy: 'high',
      activities: ['Walking', 'Dog Parks', 'Training', 'Fetch'],
      bio: 'Fluffy ball of energy! Love to play and show off tricks.',
      imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800',
      location: { lat: 13.7563, lng: 100.5018, city: 'Bangkok' },
      ownerId: 'owner21',
      ownerName: 'Evelyn Martinez'
    },
    {
      id: '22',
      name: 'Lola',
      breed: 'Doberman Pinscher',
      age: 4,
      gender: 'female',
      size: 'large',
      energy: 'high',
      activities: ['Running', 'Training', 'Agility', 'Hiking'],
      bio: 'Athletic and loyal. Looking for active companions!',
      imageUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800',
      location: { lat: 18.2932, lng: 99.4902, city: 'Lamphun' },
      ownerId: 'owner22',
      ownerName: 'Sebastian Lee'
    },
    {
      id: '23',
      name: 'Teddy',
      breed: 'Bulldog',
      age: 5,
      gender: 'male',
      size: 'medium',
      energy: 'low',
      activities: ['Walking', 'Dog Parks'],
      bio: 'Laid-back and lovable. Prefer short walks and lots of naps.',
      imageUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800',
      location: { lat: 7.0055, lng: 100.4737, city: 'Songkhla' },
      ownerId: 'owner23',
      ownerName: 'Victoria Chen'
    },
    {
      id: '24',
      name: 'Nala',
      breed: 'German Shorthaired Pointer',
      age: 3,
      gender: 'female',
      size: 'large',
      energy: 'very-high',
      activities: ['Running', 'Hiking', 'Swimming', 'Fetch', 'Camping'],
      bio: 'Born to run! Need active friends who love adventures.',
      imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800',
      location: { lat: 12.6111, lng: 99.9576, city: 'Prachuap Khiri Khan' },
      ownerId: 'owner24',
      ownerName: 'Jackson White'
    },
    {
      id: '25',
      name: 'Finn',
      breed: 'Mixed Breed',
      age: 1,
      gender: 'male',
      size: 'medium',
      energy: 'high',
      activities: ['Fetch', 'Dog Parks', 'Running', 'Beach'],
      bio: 'Young and playful! Still learning but love making friends.',
      imageUrl: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?w=800',
      location: { lat: 12.9236, lng: 100.8825, city: 'Rayong' },
      ownerId: 'owner25',
      ownerName: 'Scarlett Brown'
    },
    {
      id: '26',
      name: 'Sophie',
      breed: 'Cocker Spaniel',
      age: 4,
      gender: 'female',
      size: 'medium',
      energy: 'moderate',
      activities: ['Walking', 'Swimming', 'Fetch', 'Dog Parks'],
      bio: 'Sweet and gentle soul. Love water and cuddles!',
      imageUrl: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800',
      location: { lat: 15.2286, lng: 104.8517, city: 'Ubon Ratchathani' },
      ownerId: 'owner26',
      ownerName: 'Henry Garcia'
    },
    {
      id: '27',
      name: 'Thor',
      breed: 'Boxer',
      age: 2,
      gender: 'male',
      size: 'large',
      energy: 'very-high',
      activities: ['Running', 'Fetch', 'Dog Parks', 'Agility', 'Training'],
      bio: 'Strong and energetic! Always ready for action.',
      imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
      location: { lat: 14.8818, lng: 100.9133, city: 'Saraburi' },
      ownerId: 'owner27',
      ownerName: 'Grace Wilson'
    },
    {
      id: '28',
      name: 'Lily',
      breed: 'Maltese',
      age: 3,
      gender: 'female',
      size: 'small',
      energy: 'low',
      activities: ['Walking', 'Training'],
      bio: 'Delicate and affectionate. Perfect lap dog companion!',
      imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
      location: { lat: 8.0863, lng: 98.9063, city: 'Krabi' },
      ownerId: 'owner28',
      ownerName: 'Matthew Taylor'
    },
    {
      id: '29',
      name: 'Ace',
      breed: 'Weimaraner',
      age: 3,
      gender: 'male',
      size: 'large',
      energy: 'very-high',
      activities: ['Running', 'Hiking', 'Fetch', 'Camping', 'Beach'],
      bio: 'Sleek and athletic! Love long runs and outdoor fun.',
      imageUrl: 'https://images.unsplash.com/photo-1600804931749-2da4ce26c869?w=800',
      location: { lat: 15.8700, lng: 100.9925, city: 'Nakhon Sawan' },
      ownerId: 'owner29',
      ownerName: 'Chloe Martinez'
    },
    {
      id: '30',
      name: 'Pepper',
      breed: 'Border Terrier',
      age: 4,
      gender: 'female',
      size: 'small',
      energy: 'moderate',
      activities: ['Walking', 'Fetch', 'Dog Parks', 'Training'],
      bio: 'Spunky and smart! Love learning new tricks.',
      imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
      location: { lat: 17.4138, lng: 102.7875, city: 'Udon Thani' },
      ownerId: 'owner30',
      ownerName: 'Alexander Harris'
    }
  ];

  private swipes = signal<SwipeAction[]>([]);
  private matches = signal<Match[]>([]);

  constructor(private storage: StorageService) {
    this.loadSwipesAndMatches();
  }

  private loadSwipesAndMatches(): void {
    const savedSwipes = this.storage.getItem<SwipeAction[]>(this.SWIPES_KEY);
    const savedMatches = this.storage.getItem<Match[]>(this.MATCHES_KEY);

    if (savedSwipes) {
      this.swipes.set(savedSwipes);
    }
    if (savedMatches) {
      this.matches.set(savedMatches);
    }
  }

  /**
   * Get dogs based on filters
   */
  getDogs(filters: DogFilters): Promise<Dog[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const swipedIds = new Set(this.swipes().map(s => s.dogId));

        let filtered = this.mockDogs.filter(dog => !swipedIds.has(dog.id));
        console.log('Before filtering:', filtered.length, 'dogs');
        console.log('Filters:', filters);

        // Apply filters
        if (filters.breeds.length > 0) {
          filtered = filtered.filter(dog => filters.breeds.includes(dog.breed));
          console.log('After breed filter:', filtered.length, 'dogs');
        }

        if (filters.sizes.length > 0) {
          filtered = filtered.filter(dog => filters.sizes.includes(dog.size));
          console.log('After size filter:', filtered.length, 'dogs');
        }

        if (filters.energyLevels.length > 0) {
          filtered = filtered.filter(dog => filters.energyLevels.includes(dog.energy));
          console.log('After energy filter:', filtered.length, 'dogs');
        }

        if (filters.activities.length > 0) {
          filtered = filtered.filter(dog =>
            filters.activities.some(activity => dog.activities.includes(activity))
          );
          console.log('After activities filter:', filtered.length, 'dogs');
        }

        // Age filter
        filtered = filtered.filter(dog =>
          dog.age >= filters.ageRange.min && dog.age <= filters.ageRange.max
        );
        console.log('After age filter:', filtered.length, 'dogs');

        // Simple location filter (in real app, would use distance calculation)
        // For now, just return filtered results

        console.log('Final filtered dogs:', filtered.length);
        resolve(filtered);
      }, 300);
    });
  }

  /**
   * Submit a swipe action
   */
  submitSwipe(dogId: string, action: 'pass' | 'like' | 'favorite'): Promise<{ isMatch: boolean; match?: Match }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const swipeAction: SwipeAction = {
          dogId,
          action,
          timestamp: new Date()
        };

        const updatedSwipes = [...this.swipes(), swipeAction];
        this.swipes.set(updatedSwipes);
        this.storage.setItem(this.SWIPES_KEY, updatedSwipes);

        // Tinder-style matching: simulate if the other dog liked us back
        // Only 'like' and 'favorite' can match
        let isMatch = false;

        if (action === 'like' || action === 'favorite') {
          // Simulate 30% chance that the other dog also liked us
          const mutualLikeChance = 0.3;
          isMatch = Math.random() < mutualLikeChance;
        }

        if (isMatch) {
          const dog = this.mockDogs.find(d => d.id === dogId);
          if (dog) {
            const match: Match = {
              id: Date.now().toString(),
              dog,
              matchedAt: new Date()
            };

            const updatedMatches = [...this.matches(), match];
            this.matches.set(updatedMatches);
            this.storage.setItem(this.MATCHES_KEY, updatedMatches);

            resolve({ isMatch: true, match });
            return;
          }
        }

        resolve({ isMatch: false });
      }, 300);
    });
  }

  /**
   * Get all matches
   */
  getMatches(): Promise<Match[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.matches());
      }, 200);
    });
  }

  /**
   * Undo last swipe
   */
  undoLastSwipe(): Promise<Dog | null> {
    return new Promise((resolve) => {
      const currentSwipes = this.swipes();
      if (currentSwipes.length === 0) {
        resolve(null);
        return;
      }

      const lastSwipe = currentSwipes[currentSwipes.length - 1];
      const updatedSwipes = currentSwipes.slice(0, -1);

      this.swipes.set(updatedSwipes);
      this.storage.setItem(this.SWIPES_KEY, updatedSwipes);

      const dog = this.mockDogs.find(d => d.id === lastSwipe.dogId);
      resolve(dog || null);
    });
  }

  /**
   * Get dog by ID
   */
  getDogById(id: string): Dog | undefined {
    return this.mockDogs.find(d => d.id === id);
  }

  /**
   * Clear all matches
   */
  clearMatches(): Promise<void> {
    return new Promise((resolve) => {
      this.matches.set([]);
      this.storage.removeItem(this.MATCHES_KEY);
      resolve();
    });
  }

  /**
   * Clear all swipes and matches
   */
  clearAll(): Promise<void> {
    return new Promise((resolve) => {
      this.swipes.set([]);
      this.matches.set([]);
      this.storage.removeItem(this.SWIPES_KEY);
      this.storage.removeItem(this.MATCHES_KEY);
      resolve();
    });
  }

  /**
   * Get statistics
   * - Swipes: count pass + like
   * - Matches: count like that matched
   * - Favorites: count favorite
   */
  getStats(): { totalSwipes: number; matches: number; favorites: number } {
    const allSwipes = this.swipes();
    const allMatches = this.matches();

    // Swipes: นับ pass และ like (ไม่นับ favorite)
    const totalSwipes = allSwipes.filter(s => s.action === 'pass' || s.action === 'like').length;

    // Matches: นับ like ที่ match สำเร็จ
    const matches = allMatches.length;

    // Favorites: นับ favorite
    const favorites = allSwipes.filter(s => s.action === 'favorite').length;

    return {
      totalSwipes,
      matches,
      favorites
    };
  }
}
