import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Event, EventType, EventStatus } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-feed',
  templateUrl: './event-feed.component.html'
})
export class EventFeedComponent implements OnInit {
  @Input() events: Event[] = [];
  @Input() showPaginator: boolean = true;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['timestamp', 'eventType', 'account', 'details', 'status', 'optioEventId'];
  dataSource = new MatTableDataSource<Event>();
  
  EventType = EventType;
  EventStatus = EventStatus;
  
  ngOnInit() {
    this.updateTable();
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
    this.dataSource.data = this.events;
  }
  
  getEventTypeClass(type: EventType): string {
    switch (type) {
      case EventType.ACCOUNT_CREATED:
      case EventType.DEPOSIT_MADE:
        return 'bg-success/10 text-success';
      case EventType.ACCOUNT_CLOSED:
      case EventType.WITHDRAWAL_MADE:
        return 'bg-error/10 text-error';
      case EventType.TRANSFER_SENT:
      case EventType.TRANSFER_RECEIVED:
      case EventType.EXTERNAL_TRANSFER_SENT:
        return 'bg-primary/10 text-primary';
      case EventType.LOAN_APPLIED:
      case EventType.LOAN_APPROVED:
      case EventType.LOAN_PAYMENT_MADE:
      case EventType.LOAN_COMPLETED:
        return 'bg-warning/10 text-warning';
      case EventType.LOAN_REJECTED:
      case EventType.LOAN_PAYMENT_MISSED:
        return 'bg-error/10 text-error';
      default:
        return 'bg-neutral-200 text-neutral-700';
    }
  }
  
  getStatusClass(status: EventStatus): string {
    switch (status) {
      case EventStatus.SENT:
        return 'bg-success/10 text-success';
      case EventStatus.FAILED:
        return 'bg-error/10 text-error';
      case EventStatus.PENDING:
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-neutral-200 text-neutral-700';
    }
  }
  
  getDetails(event: Event): string {
    try {
      const payload = JSON.parse(event.payload);
      if (payload.amount && payload.currency) {
        return `${payload.amount} ${payload.currency}`;
      }
      return '';
    } catch (e) {
      return '';
    }
  }
  
  getAccountId(event: Event): string {
    try {
      const payload = JSON.parse(event.payload);
      return payload.accountId || '';
    } catch (e) {
      return '';
    }
  }
}
