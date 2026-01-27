import { Component, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../../services/categories/category';
import { CategoryData } from '../../../../../interfaces/data/category-data';
import { User } from '../../../../../services/user/user';

@Component({
  selector: 'app-category-picker',
  imports: [CommonModule],
  templateUrl: './category-picker.html',
  styleUrl: './category-picker.css',
})

export class CategoryPicker implements OnInit {
  selectedCategoryId = signal<number | null>(null)
  categoryId = output<number>()
  onOpen = output<void>()
  private categoryService = inject(Category)
  private userService = inject(User)
  categories = this.categoryService.categories
  isAddCategoryVisible = output<void>()

  ngOnInit(): void {
    this.loadCategories()
  }

  openCardCategory() {
    this.onOpen.emit()
  }

  //Loading categorias with get http request service
  loadCategories() {
    this.categoryService.getCategories(this.userService.userId()).subscribe()
  }

  //Select selected icon
  selectCategory(item: CategoryData) {
    if (item && item.id !== undefined) {
      this.selectedCategoryId.set(item.id);
      this.categoryId.emit(item.id);
    } else {
      console.warn("La categoría no tiene un ID válido:", item);
    }
  }

}
