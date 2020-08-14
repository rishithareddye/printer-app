import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { Service } from '../../model/service.model';
import { Order } from 'src/app/model/order.model';
import { SlotInfo } from 'src/app/model/slot-info.model';
import { Orderinfo } from 'src/app/model/orderinfo.model';
import { Option } from 'src/app/model/option.model';
declare var UIkit: any;

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  selectedOrder: any = {
  };
  order: Order;
  processing: boolean = false;
  selectedService: Service;
  selectedOption: Option;
  constructor(public fireBaseService: FirebaseService) { }
  orders: any[] = [];
  services: Service[] = [];
  ngOnInit(): void {
    this.getServices();
  }
  getServices() {
    this.fireBaseService.getServices().subscribe(snap => {
      this.services = this.snapshotToArray(snap);
      //console.log(this.services);
    });
  }
  snapshotToArray(snapshot): Service[] {
    var returnArr = [];
    for (let key in snapshot) {
      var item = snapshot[key];
      item.pushid = key;
      returnArr.push(snapshot[key] as Service);
    }
    return returnArr;
  }
  openOrder(order: any) {
    //console.log(order);
    this.selectedOrder = this.flattenOrder(order);
    this.services.forEach((s)=>{
      if(this.selectedOrder.serviceid == s.id) {
        this.selectedService = s;
        s.options.forEach((o)=>{
          if(o.optionid == this.selectedOrder.optionid) {
            this.selectedOption = o;
          }
        })
      }
    });
    this.order = order as Order;
    //console.log(this.selectedOption);
    //console.log(this.selectedService);
    UIkit.modal('#order-details').show();
  }
  changed(type: number) {
    //console.log(type);
  }
  flattenOrder(order: Order) {
    return {
      name: order.orderinfo.name,
      email: order.orderinfo.email,
      phone: order.orderinfo.phone,
      status: order.orderinfo.status,
      deliverydate: order.orderinfo.deliverydate,
      serviceid: order.orderinfo.orders[0].serviceid,
      optionid: order.orderinfo.orders[0].optionid,
      cost: order.orderinfo.orders[0].cost,
      count: order.orderinfo.orders[0].count,
      total: order.orderinfo.total,
      pushid: order.pushid,
      amountpaid: order.orderinfo.amountpaid,
      promotion: order.orderinfo.promotion,
      promotionamount: order.orderinfo.promotionamount,
      comments: order.orderinfo.comments
    }
  }
  unflattenOrder(flatorder: any) {
    this.order.orderinfo.name = flatorder.name;
    this.order.orderinfo.email = flatorder.email;
    this.order.orderinfo.phone = flatorder.phone;
    this.order.orderinfo.status = flatorder.status;
    this.order.orderinfo.deliverydate = flatorder.deliverydate;
    this.order.orderinfo.orders[0].serviceid = flatorder.serviceid;
    this.order.orderinfo.orders[0].optionid = flatorder.optionid;
    this.order.orderinfo.orders[0].cost = flatorder.cost;
    this.order.orderinfo.orders[0].count = flatorder.count;
    this.order.orderinfo.total = flatorder.total;
    this.order.orderinfo.amountpaid = flatorder.amountpaid;
    this.order.orderinfo.promotion = flatorder.promotion;
    this.order.orderinfo.promotionamount = flatorder.promotionamount;
    this.order.orderinfo.comments = flatorder.comments;
  }
  needSlotUpdate(): boolean {
    return this.order.orderinfo.orders[0].count != this.selectedOrder.count
      || this.order.orderinfo.orders[0].serviceid != this.selectedOrder.serviceid
      || this.order.orderinfo.orders[0].optionid != this.selectedOrder.optionid
  }
  async updateOrder() {
    try {
      this.processing = true;
      var slotUpdated = true;
      if (this.needSlotUpdate()) {
        //console.log("needs update");
        var templateid = this.order.orderinfo.orders[0].serviceid + "." + this.order.orderinfo.orders[0].optionid;
        var newtemplateid = this.selectedOrder.serviceid + "." + this.selectedOrder.optionid;
        var slot = (await this.fireBaseService.getSlot(this.selectedOrder.deliverydate, templateid, this.order.orderinfo.orders[0].count)).slot as SlotInfo;
        //console.log(slot);
        slotUpdated = false;
        if (templateid != newtemplateid) {
          slot.availableslots[templateid] = Number(slot.availableslots[templateid]) + Number(this.order.orderinfo.orders[0].count);
          //console.log("slots: "+slot.availableslots[newtemplateid]);
          if ( slot.availableslots[newtemplateid]) {
            slot.availableslots[newtemplateid] = Number(slot.availableslots[newtemplateid]) - Number(this.selectedOrder.count);
          }
          else {
            slot.availableslots[newtemplateid] = Number(this.getTemplateCount(this.selectedOrder.serviceid, this.selectedOrder.optionid)) - Number(this.selectedOrder.count);
            slot.maxslots[newtemplateid] = Number(this.getTemplateCount(this.selectedOrder.serviceid, this.selectedOrder.optionid));
          }
        }
        else if (this.selectedOrder.count != this.order.orderinfo.orders[0].count) {
          //console.log("count change");
          slot.availableslots[templateid] = Number(slot.availableslots[templateid]) + (Number(this.order.orderinfo.orders[0].count) - Number(this.selectedOrder.count));
        }
        slotUpdated = await this.fireBaseService.updateSlot(slot, slot.pushid);
      }
      this.unflattenOrder(this.selectedOrder);
      //console.log(this.order);
      if (slotUpdated) {
        this.fireBaseService.addOrder(this.order);
        UIkit.notification({ message: 'order updated successfully. <br/>OrderId: <strong>' + this.order.pushid + '<strong><br/>', status: 'success' });
        this.processing = false;
      }
      else {
        UIkit.notification({ message: 'order update failed. <br/>OrderId: <strong>' + this.order.pushid + '<strong><br/>', status: 'danger' });
      }
    }
    catch (e) {
      UIkit.notification({ message: 'order update failed. <br/>OrderId: <strong>' + this.order.pushid + '<strong><br/>', status: 'danger' });
    }
  }
  getTemplateCount(serviceid, optionid) {
    var count = 0;
    this.services.forEach((service) => {
      if (service.id == serviceid) {
        service.options.forEach((option) => {
          if (option.optionid == optionid) {
            count = option.maxcount;
          }
        })
      }
    });
    return count;
  }
  async deleteOrder() {
    this.processing = true;
    (document.getElementById("delete-order") as HTMLButtonElement).disabled = true;
    var templateid = this.order.orderinfo.orders[0].serviceid + "." + this.order.orderinfo.orders[0].optionid;
    var slot = (await this.fireBaseService.getSlot(this.selectedOrder.deliverydate, templateid, this.order.orderinfo.orders[0].count)).slot as SlotInfo;
    var success = true;
    slot.availableslots[templateid] = Number(slot.availableslots[templateid]) + Number(this.order.orderinfo.orders[0].count);
    success  = await this.fireBaseService.updateSlot(slot,slot.pushid);
    if(success) {
       success = await this.fireBaseService.deleteOrder(this.order.pushid);
    }
    if (success) {
      UIkit.notification({ message: 'order deleted.<br/>', status: 'success' });
    }
    else {
      UIkit.notification({ message: 'order delete failed.<br/>', status: 'danger' });
    }
    UIkit.modal('#order-details').hide();
    this.processing = false;
    (document.getElementById("delete-order") as HTMLButtonElement).disabled = false;
    window.location.reload();
  }
  calculateTotal(){
    this.selectedOrder.total = (this.selectedOrder.cost*this.selectedOrder.count) - (this.selectedOrder.promotionamount);
  }
  serviceChange(){
    this.services.forEach((s)=>{
      if(this.selectedOrder.serviceid == s.id) {
        this.selectedService = s;
        this.selectedOrder.optionid = "";
      }
    });
  }
}
