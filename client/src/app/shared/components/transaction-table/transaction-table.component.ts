import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Transaction, TransactionType, TransactionStatus } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html'
})
export class TransactionTableComponent implements OnInit {
  @Input() transactions: Transaction[] = [];
  @Input() showAccountInfo: boolean = false;
  @Input() showPaginator: boolean = true;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'balance'];
  dataSource = new MatTableDataSource<Transaction>();
  
  TransactionType = TransactionType;
  
  ngOnInit() {
    this.updateTable();
    
    if (this.showAccountInfo) {
      this.displayedColumns = ['date', 'account', 'description', 'category', 'amount', 'balance'];
    }
  }
  
  ngOnChanges() {
    this.updateTable();
  }
  
  ngAfterViewInit() {
    if (this.showPaginator && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  
  private updateTable() {
    this.dataSource.data = this.transactions;
  }
  
  getCategoryClass(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT:
        return 'bg-success/10 text-success';
      case TransactionType.WITHDRAWAL:
        return 'bg-error/10 text-error';
      case TransactionType.TRANSFER:
        return 'bg-primary/10 text-primary';
      case TransactionType.LOAN_PAYMENT:
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-neutral-200 text-neutral-700';
    }
  }
  
  getAmountClass(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT:
        return 'text-success';
      case TransactionType.WITHDRAWAL:
      case TransactionType.TRANSFER:
        return 'text-error';
      default:
        return '';
    }
  }
  
  getAmountPrefix(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT:
        return '+';
      case TransactionType.WITHDRAWAL:
      case TransactionType.TRANSFER:
        return '-';
      default:
        return '';
    }
  }
}
