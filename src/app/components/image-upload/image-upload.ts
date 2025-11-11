import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageCompressionService } from '../../services/image-compression';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss'
})
export class ImageUploadComponent {
  @Input() initialImage?: string;
  @Input() buttonText = 'Upload Photo';
  @Input() aspectRatio: 'square' | 'wide' = 'square';
  @Output() imageSelected = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  previewUrl = signal<string | null>(null);
  isDragging = signal(false);
  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private imageCompression: ImageCompressionService) {}

  ngOnInit() {
    if (this.initialImage) {
      this.previewUrl.set(this.initialImage);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      await this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  async processFile(file: File) {
    this.errorMessage.set(null);
    this.isProcessing.set(true);

    try {
      // Validate image
      const validation = await this.imageCompression.validateImage(file);
      if (!validation.valid) {
        this.errorMessage.set(validation.error || 'Invalid image');
        this.isProcessing.set(false);
        return;
      }

      // Compress and convert to WebP
      const compressedDataUrl = await this.imageCompression.compressImage(file, {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
        format: 'webp'
      });

      this.previewUrl.set(compressedDataUrl);
      this.imageSelected.emit(compressedDataUrl);
    } catch (error) {
      this.errorMessage.set('Failed to process image. Please try another file.');
      console.error('Image processing error:', error);
    } finally {
      this.isProcessing.set(false);
    }
  }

  removeImage() {
    const currentUrl = this.previewUrl();
    if (currentUrl && currentUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentUrl);
    }
    this.previewUrl.set(null);
    this.errorMessage.set(null);
    this.imageRemoved.emit();
  }

  triggerFileInput() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput?.click();
  }
}
