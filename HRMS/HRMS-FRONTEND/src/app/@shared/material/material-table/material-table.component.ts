import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-material-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.scss']
})
export class MaterialTableComponent<T> implements AfterViewInit, OnChanges {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: T[] = [];
  @Input() totalCount = 0; // Total records from API
  @Input() pageSize = 10;  // Page size
  @Input() pageNumber = 0; // Current page index

  @Output() view = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() pageChange = new EventEmitter<{ page: number; size: number }>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.setupTable();
  }

  ngOnChanges() {
    this.setupTable();
  }

  setupTable() {
    this.displayedColumns = this.columns.map(c => c.key);
    this.displayedColumns.push('action'); // Add action column
    this.dataSource = new MatTableDataSource<T>(this.data);

    setTimeout(() => {
      if (this.paginator) {
        this.paginator.length = this.totalCount;
        this.paginator.pageSize = this.pageSize;
        this.paginator.pageIndex = this.pageNumber;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit({ page: event.pageIndex, size: event.pageSize });
  }

  trackByFn(index: number, item: T): any {
    return (item as any).id || index;
  }
}