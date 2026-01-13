import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { Category } from '../../../../../services/categories/category';
import { Toast } from '../../../../../services/toast/toast';
import { CategoryData } from '../../../../../interfaces/data/category-data';
import { User } from '../../../../../services/user/user';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})

export class AddCategory implements OnInit {
  selectedIcon = signal<string>('bi-house-door-fill')
  private categoryService = inject(Category)
  private alertService = inject(Toast)
  private userService = inject(User)
  nameForm !: FormGroup
  onClose = output<void>()
  selectedColor = signal<string>('#708090ff')
  selectedColorObj = computed(() => this.AVAILABLE_COLORS.find(c => c.color === this.selectedColor()))
  currentBgColor = computed(() => this.selectedColorObj()?.backgroundColor || '#eee')


  ngOnInit(): void {
    this.initializeForm()
  }

  readonly AVAILABLE_COLORS =  [
    { name: 'red', color: '#ff3737ff', backgroundColor: '#ffe7e7ff' },
    { name: 'orange', color: '#ffa11cff', backgroundColor: '#fdecd5ff' },
    { name: 'amber', color: '#ffbf00ff', backgroundColor: '#fff4d6ff' },
    { name: 'pink', color: '#ff6ba4ff', backgroundColor: '#ffddeaff' },
    { name: 'purple', color: '#925cfdff', backgroundColor: '#e7dbffff' },
    { name: 'indigo', color: '#6610f2ff', backgroundColor: '#ebe0ffff' },
    { name: 'green', color: '#04d60eff', backgroundColor: '#d3ffd9ff' },
    { name: 'lime', color: '#a3cf0dff', backgroundColor: '#f4ffd1ff' },
    { name: 'aquamarine', color: '#00c0a6ff', backgroundColor: '#d7ffefff' },
    { name: 'blue', color: '#00b1e7ff', backgroundColor: '#cdf7ffff' },
    { name: 'blue-dark', color: '#5d75ffff', backgroundColor: '#e2e2ffff' },
    { name: 'slate', color: '#708090ff', backgroundColor: '#e2e8f0ff' }
  ];

  readonly AVAILABLE_ICONS: string[] = [
    'bi-activity',
    'bi-house-door-fill',
    'bi-lightbulb-fill',
    'bi-droplet-fill',
    'bi-telephone-fill',
    'bi-trash-fill',
    'bi-cart-fill',
    'bi-cup-hot-fill',
    'bi-egg-fried',
    'bi-bag-heart-fill',
    'bi-cake2-fill',
    'bi-car-front-fill',
    'bi-bus-front-fill',
    'bi-bicycle',
    'bi-airplane-fill',
    'bi-fuel-pump-fill',
    'bi-heart-pulse-fill',
    'bi-capsule',
    'bi-bandaid-fill',
    'bi-gem',
    'bi-gift-fill',
    'bi-controller',
    'bi-tv-fill',
    'bi-camera-fill',
    'bi-cash-stack',
    'bi-credit-card-fill',
    'bi-piggy-bank-fill',
    'bi-briefcase-fill',
    'bi-mortarboard-fill',
    'bi-bank',
    'bi-tools',
    'bi-palette-fill',
    'bi-suit-heart-fill',
    'bi-stars',
    'bi-laptop-fill',
    'bi-umbrella-fill',
    'bi-shop',
    'bi-tags-fill',
    'bi-wallet2',
    'bi-book-fill',
    'bi-camera-reels-fill',
    'bi-chat-dots-fill',
    'bi-cloud-sun-fill',
    'bi-compass-fill',
    'bi-cpu-fill',
    'bi-display-fill',
    'bi-envelope-fill',
    'bi-fire',
    'bi-gear-fill',
    'bi-geo-alt-fill',
    'bi-globe',
    'bi-hammer',
    'bi-headphones',
    'bi-hourglass-split',
    'bi-image-fill',
    'bi-infinity',
    'bi-key-fill',
    'bi-magic',
    'bi-mic-fill',
    'bi-music-note-beamed',
    'bi-newspaper',
    'bi-paperclip',
    'bi-peace-fill',
    'bi-phone-fill',
    'bi-printer-fill',
    'bi-puzzle-fill',
    'bi-scissors',
    'bi-speaker-fill',
    'bi-speedometer2',
    'bi-stickies-fill',
    'bi-sun-fill',
    'bi-thermometer-half',
    'bi-trophy-fill',
    'bi-truck',
    'bi-watch',
    'bi-wrench-adjustable',
    'bi-zoom-in'
  ];

  initializeForm() {
    this.nameForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.minLength(3)])
    })
  }

  createCategory() {
    if (this.nameForm.invalid) {
      this.alertService.error('Please, complete all required fields')
      this.nameForm.markAllAsTouched()
      return
    }
        const categoryData: CategoryData = {
          name: this.nameForm.get('name')?.value,
          icon: this.selectedIcon(),
          color: this.selectedColor(),
          background_color: this.currentBgColor(),
          user_id: this.userService.userId()
        }
        
        this.categoryService.createCategory(categoryData).subscribe({
          next: () => {
            this.alertService.success('Your category has been succesfully created')
          },
          error: err => {
            this.alertService.error(err.error.error)
          }
        })
      
    
  }

  selectIcon(icon: string) {
    this.selectedIcon.set(icon)
  }

  selectColor(color: string) {
    this.selectedColor.set(color)
  }

  closeComponent() {
    this.onClose.emit()
  }
}
