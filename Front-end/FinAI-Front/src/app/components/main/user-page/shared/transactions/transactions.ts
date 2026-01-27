import { Component, effect, inject, OnInit, output, signal } from '@angular/core';
import { Transaction } from '../../../../../interfaces/data/transaction-data';
import { TransactionService } from '../../../../../services/transactions/transaction';
import { User } from '../../../../../services/user/user';
import { CommonModule } from '@angular/common';
import { Toast } from '../../../../../services/toast/toast';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})

export class Transactions  {
  private transactionService = inject(TransactionService);
  private userService = inject(User)
  private alertService = inject(Toast)
  public transactions = signal<Transaction[]>([]);
  public currentPage = signal<number>(1);
  public totalPages = signal<number>(1);
  public isLoading = signal<boolean>(false);
  public onOpen = output<void>()
  private id = signal<string>('')

  constructor() {
    effect(() => {
      const userId = this.userService.userId();
      const page = this.currentPage();
      const refresh = this.transactionService.refreshSignal();

      if (userId) {
        this.id.set(userId);
        this.loadData(userId);
      }
    });
  }

  
  loadData(userId: string) {
  this.isLoading.set(true);
  this.transactionService.getTransactions(userId, this.currentPage()).subscribe({
    next: (res) => {
      this.transactions.set(res.data);
      const total = Number(res.pagination.totalPages);
      this.totalPages.set(total > 0 ? total : 1); 
      this.isLoading.set(false);
    },
    error: () => {
      this.isLoading.set(false);
      this.totalPages.set(1);
    }
  });
}

  changePage(delta: number) {
    const newPage = this.currentPage() + delta;
    if (newPage > 0 && newPage <= this.totalPages()) {
      this.currentPage.set(newPage);
    }
  }

  onEdit(item: Transaction) {
    this.transactionService.setTransactionToEdit(item)
    this.onOpen.emit()
  }

  delete(item: Transaction) {
    const idToDelete = item.id;
    if (idToDelete) {
      this.transactionService.deleteTransaction(idToDelete).subscribe({
        next: (res) => {
          this.alertService.success(res.message)
          this.transactionService.notifyChanges();
        }
      });
    }
  }
}