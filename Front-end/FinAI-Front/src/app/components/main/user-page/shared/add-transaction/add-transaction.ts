import { Component, inject, Input, OnInit, output, signal } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CategoryPicker } from "../category-picker/category-picker";
import { TransactionData } from '../../../../../interfaces/data/transaction-data';
import { User } from '../../../../../services/user/user';
import { TransactionService } from '../../../../../services/transactions/transaction';
import { Toast } from '../../../../../services/toast/toast';


@Component({
  selector: 'app-add-transaction',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    CategoryPicker,
    ReactiveFormsModule,
  ],
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.css',
})

export class AddTransaction implements OnInit {
  selectedType = signal<String>('income')
  today = new Date()
  private userService = inject(User)
  private transactionService = inject(TransactionService)
  private alertService = inject(Toast)
  minDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate())
  maxDate = new Date(this.today.getFullYear() + 10, this.today.getMonth(), this.today.getDate())
  amountControl = new FormControl<number | null>(null, [Validators.required])
  dateControl = new FormControl(new Date(), [Validators.required])
  descriptionControl = new FormControl(null, [Validators.required])
  categoryId = signal<number>(0)
  onClose = output<void>()
  onOpen = output<void>()
  isEditing = signal<boolean>(false)

  closeComponent() {
    this.onClose.emit()
  }

  ngOnDestroy(): void {
    this.transactionService.transactionToEdit.set(null);
  }

  ngOnInit(): void {
    const editData = this.transactionService.transactionToEdit()

    if (editData) {
      this.isEditing.set(true)

      this.amountControl.setValue(editData.amount)
      this.selectedType.set(editData.type.toLowerCase())
      this.descriptionControl.setValue(editData.description as any)
      this.handleCategorySelection(editData.category_id)

      
      if (editData.date) {
        this.dateControl.setValue(new Date(editData.date));
      }
    }
  }

  onAmountBlur() {
    const value = this.amountControl.value
    if (value !== null) {
      const formatted = parseFloat(value.toFixed(2))
      this.amountControl.setValue(formatted, { emitEvent: false })
    }
  }

  private formatToMySQLDate(date: Date): string {
    if (!date) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  openForm() {
    this.onOpen.emit()
  }

  selectType(selectedType: string) {
    this.selectedType.set(selectedType)
  }

  handleCategorySelection(id: number) {
    this.categoryId.set(id)
  }

  private handleSuccess (message: string) {
    this.alertService.success(message);
    this.transactionService.notifyChanges();
    this.closeAndReset();
  }

  private closeAndReset() {
    this.isEditing.set(false);
    this.transactionService.transactionToEdit.set(null);
    this.closeComponent();
  }

  saveTransaction() {
    if (this.amountControl.invalid || this.dateControl.invalid) {
      this.alertService.error('Please complete all required fields')
      return
    }

    const editData = this.transactionService.transactionToEdit()

    const rawDate = this.dateControl.value
    const rawAmount = this.amountControl.value

    const transaction: TransactionData = {
      user_id: this.userService.userId(),
      category_id: this.categoryId(),
      amount: rawAmount!,
      type: this.selectedType().toUpperCase(),
      description: this.descriptionControl.value || '',
      transaction_date: this.formatToMySQLDate(rawDate!)
    }

    if (this.isEditing() && editData) {
      this.transactionService.updateTransaction(editData.id as any, transaction).subscribe({
        next: () => this.handleSuccess('Transaction updated successfully!'),
        error: (err) => console.log(err.err.err)
      })
    } else {

      this.transactionService.createTransaction(transaction).subscribe({
        next: () => this.handleSuccess('Your transaction has been saved!'),
        error: (err => {
          this.alertService.error('An error occurred')
          console.error(err.error.error)
        })
      })
    }
  }

}
