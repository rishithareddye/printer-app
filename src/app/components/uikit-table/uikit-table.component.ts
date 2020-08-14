import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import TinyDatePicker from 'tiny-date-picker';
import * as _ from 'lodash';

@Component({
  selector: 'app-uikit-table',
  templateUrl: './uikit-table.component.html',
  styleUrls: ['./uikit-table.component.css']
})
export class UikitTableComponent implements OnInit {
  totalPages: number = 0;
  currentPage: number = 0;
  needsPages: boolean = false;
  filteredrows: any[] = [];
  @Input()
  limit: number = 1;
  columns: any[] = [{ name: 'Name', id: 'col-name', type: "text", path: 'orderinfo.name' },{
    name: "Status", id: 'col-status', type: "custom", options: [
      {
        key: 0,
        value: "New"
      },
      {
        key: 1,
        value: "Accepted"
      },
      {
        key: 2,
        value: "Completed"
      },
      {
        key: 3,
        value: "Rejected"
      }
    ], path: "orderinfo.status"
  }, { name: 'Delivery Date', id: 'date', type: "date", path: "orderinfo.deliverydate" }, { name: 'Count', id: 'col.count', type: "number", path: "orderinfo.orders[0].count" }, { name: 'Total', id: 'col.total', type: "none", path: "orderinfo.total" }];
  rows: any[] = [];
  @Input()
  pagination: boolean = false;
  @Input()
  customColumns: any[] = [];
  @Output() callback = new EventEmitter<any>();
  displayrows: any[] = [];
  constructor(public fireBaseService: FirebaseService) {
  }
  ngOnInit(): void {
    this.getOrders();
    console.log(this.rows);
    if (this.rows.length > 0 && this.limit > 0) {
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.rows.length / this.limit);
      console.log("res");
      this.needsPages = this.pagination && this.totalPages > 1;
      if (this.needsPages) {
        this.displayrows = this.rows.slice(0, this.limit);
      }
      else {
        this.displayrows = this.rows;
      }
    }
  }
  sliceArray(input: any[], from: number, to: number): any[] {
    from = from - 1;
    to = to - 1;
    return input.slice(from, to);
  }
  nextPage() {
    if (this.currentPage == this.totalPages) {
      return;
    }
    var start = this.currentPage * this.limit;
    this.currentPage = this.currentPage + 1;
    var end = this.currentPage * this.limit;
    this.displayrows = this.filteredrows.slice(start, end);
  }
  previousPage() {
    if (this.currentPage == 1) {
      return;
    }
    var cp = this.currentPage - 1;
    var end = cp * this.limit;
    this.currentPage = this.currentPage - 1;
    cp = cp - 1;
    var start = cp * this.limit;
    this.displayrows = this.filteredrows.slice(start, end);
  }
  public getOrders() {
    this.fireBaseService.getOrderInfo().subscribe((res) => {
      if (res) {
        var result = res as Record<string, any>
        this.rows = this.snapshotToArray(result);
        this.clearTable();
        TinyDatePicker('.date-pick', {
          mode: 'dp-below', format(date) {
            return date.toLocaleDateString();
          }
        });
      }
    });
  }
  snapshotToArray(snapshot): any[] {
    var returnArr = [];
    for (let key in snapshot) {
      var item = snapshot[key];
      item.pushid = key;
      returnArr.push(snapshot[key]);
    }
    return returnArr;
  };
  reloadTable() {
    console.log(this.filteredrows);
    if (this.filteredrows.length > 0 && this.limit > 0) {
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.filteredrows.length / this.limit);
      console.log("res");
      this.needsPages = this.pagination && this.totalPages > 1;
      if (this.needsPages) {
        this.displayrows = this.filteredrows.slice(0, this.limit);
      }
      else {
        this.displayrows = this.filteredrows;
      }
    }
    else {
      this.displayrows = [];
      this.clearSearch();
    }
  }
  getValue(row, col) {
    if(col.type == "custom")
    {
      var key = _.get(row, col.path);
      var value = "N/A";
      col.options.forEach(option => {
          if(option.key == key)
          {
            value = option.value;
            return;
          }
      });
      return value;
    }
    return _.get(row, col.path);
  }
  callParent(order: any) {
    this.callback.emit(order)
  }
  detechChange(id: any, col: any) {
    console.log(id, col);
    let search = (document.getElementById(col.id) as HTMLInputElement).value;
    if(col.type == "text")
    {
      this.filteredrows = _.filter(this.rows, (obj) =>{
        return _.get(obj,col.path).indexOf(search) !== -1;
      });

      this.reloadTable();
    }
    else {
      this.filteredrows = _.filter(this.rows, (obj) =>{
        return _.get(obj,col.path) == search;
      });

      this.reloadTable();
    }
  }
  clearSearch() {
    this.columns.forEach(col => {
      if (col.type != "none") {
        var res = (document.getElementById(col.id) as HTMLInputElement)
        if (col.type == "custom") {
          res.value = "-1";
        }
        else {
          res.value = "";
        }
      }
    });
  }
  clearTable() {
    this.columns.forEach(col => {
      if (col.type != "none") {
        var res = (document.getElementById(col.id) as HTMLInputElement)
        if (col.type == "custom") {
          res.value = "-1";
        }
        else {
          res.value = "";
        }
      }
    });
    this.filteredrows = this.rows;
    this.reloadTable();
  }
  filterContains(obj,searchpath,search) {
    return _.get(obj,searchpath).indexOf(search) !== -1;
  }
}
