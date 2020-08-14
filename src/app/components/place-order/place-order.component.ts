import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { Service } from '../../model/service.model';
import { SlotInfo } from '../../model/slot-info.model';
import TinyDatePicker from 'tiny-date-picker';
import { Orderinfo } from 'src/app/model/orderinfo.model';
import { Order } from 'src/app/model/order.model';
declare var UIkit: any;
@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  public orderid: any;
  public orderresult = 0;
  public selectedService: any = [];
  public formValidation: any = {
    "deliverydate": {
      "valid": true,
      "error": ""
    },
    "count": {
      "valid": true,
      "error": ""
    },
    "name": {
      "valid": true,
      "error": ""
    },
    "phone": {
      "valid": true,
      "error": ""
    },
    "email": {
      "valid": true,
      "error": ""
    }
  };
  public hasSlot: boolean = false;
  public orderinfo: Orderinfo = {
    "deliverydate": null,
    "name": "",
    "email": "",
    "company": "",
    "phone": "",
    "status": -1,
    "orders": [],
    "comments": "",
    "total": 0,
    "tax": 0,
    "promotion": "",
    "promotionamount": 0,
    "amountpaid": 0
  };
  public accordFlag = [true, true, false, false];
  public orderSlot: SlotInfo;
  public selectedOption: any = {
    'maxcount': 0,
    'mincount': 0
  };
  public orderState: number = 0;
  public services: Service[];
  public slotInfos: SlotInfo[] = [];

  //Order Object Mappings start
  public count: number = 0;
  public deliverydate: any = "";
  //Order Object Mappings end
  constructor(public fireBaseService: FirebaseService) { }
  ngOnInit(): void {
    this.retrieveServiceInfo();
  }
  public async retrieveServiceInfo() {
    this.services = await this.fireBaseService.getServiceInfo();
    if (this.services && this.services.length > 0) {
      this.selectedService = this.services[0];
    }
  }
  public async retrieveSlotInfo(date: any, templateid: string, count: number) {
    var response = await this.fireBaseService.getSlot(date,templateid,count);
    this.orderresult = response.count;
    this.slotInfos = [];
    if(response && response.slot)
    {
      this.slotInfos.push(response.slot as SlotInfo);
    }
  }
  public async updateSlotInfo(): Promise<boolean> {
    if(this.orderSlot.pushid)
    {
      return this.fireBaseService.updateSlot(this.orderSlot,this.orderSlot.pushid);
    }
    else{
      return this.fireBaseService.addSlot(this.orderSlot);
    }
  }
  public addOrderInfo(): any {
    var order:Order = {
      orderinfo: this.orderinfo,
      created: new Date().toString(),
      createdby: this.orderinfo.name,
      modified: new Date().toString(),
      modifiedby: this.orderinfo.name
    }
    return this.fireBaseService.addOrder(order);
  }
  public checkNonEmptySlots(): boolean {
    return this.orderresult == 0;
  }
  public onOptionSelected(option: any): void {
    this.orderState = 2;
    this.selectedOption = option;
    this.toggleAccord(2, true);
    this.toggleAccord(1, false);
    this.toggleAccord(0, false);
    this.count = option.mincount;
    TinyDatePicker('#date-pick', {
      mode: 'dp-below', format(date) {
        return date.toLocaleDateString();
      }
    });
  }
  public onServiceSelected(): void {

    this.orderState = 2;
    this.toggleAccord(1, true);
  }
  public accordClicked(accordIndex: number) {
    this.accordFlag[accordIndex] = !this.accordFlag[accordIndex];
  }
  public toggleAccord(accordIndex: number, active: boolean) {
    if (this.accordFlag[accordIndex] != active) {
      var ele = this.getAccordElement(accordIndex);
      if (ele) {
        ele.click();
      }
    }
  }
  public getAccordElement(accordIndex: number): HTMLElement {
    switch (accordIndex) {
      case 0:
        return document.getElementById('select-header');
      case 1:
        return document.getElementById('design-header');
      case 2:
        return document.getElementById('order-details-header');
      case 3:
        return document.getElementById('personal-details-header');
      default:
        return null;
    }
  }
  public async checkAvaliablity() {
    var deliverydate = (document.getElementById("date-pick") as HTMLInputElement).value;
    var delivery = Date.parse(deliverydate);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!deliverydate || deliverydate == "" || this.count == 0) {
      return;
    }
    if (this.count < this.selectedOption.mincount || this.count > this.selectedOption.maxcount) {
      this.formValidation.count.valid = false;
      this.formValidation.count.error = "order count should be in the range of (" + this.selectedOption.mincount + "-" + this.selectedOption.maxcount + ").";
    }
    else {
      this.formValidation.count.valid = true;
      this.formValidation.count.error = "";
    }
    if (isNaN(delivery)) {
      this.formValidation.deliverydate.valid = false;
      this.formValidation.deliverydate.error = "Invalid Date Format";
    }
    else if (new Date(delivery) <= today) {
      this.formValidation.deliverydate.valid = false;
      this.formValidation.deliverydate.error = "Only Future orders are allowed.";
    }
    else {
      this.formValidation.deliverydate.valid = true;
      this.formValidation.deliverydate.error = "";
      this.deliverydate = deliverydate;
    }
    if (this.formValidation.deliverydate.valid && this.formValidation.count.valid) {
      var slotid = this.selectedOption.serviceid+"."+this.selectedOption.optionid;
      //TODO: add loader
      await this.retrieveSlotInfo(deliverydate,this.selectedOption.serviceid+"."+this.selectedOption.optionid,this.count);
      if (this.slotInfos && this.slotInfos.length > 0) {
        this.orderSlot = this.slotInfos[0];
        if(this.orderSlot.maxslots[slotid] != this.selectedOption.maxcount)
        {
          //If the admin update the maxcount, we want to update the avaialbe slots accordingly.
          var count = this.orderSlot.maxslots[slotid] ? (this.orderSlot.maxslots[slotid] - (this.orderSlot.availableslots[slotid] ? this.orderSlot.availableslots[slotid] : 0 )) : 0;
          this.orderSlot.maxslots[slotid] = this.selectedOption.maxcount;
          this.orderSlot.availableslots[slotid] = this.selectedOption.maxcount < count ? 0 : this.selectedOption.maxcount - count;
        }
        if(this.orderSlot.availableslots[slotid] < this.count)
        {
          this.formValidation.deliverydate.valid = false;
          this.formValidation.deliverydate.error = "Selected Date is Full.";
          this.formValidation.count.valid = false;
          this.formValidation.count.error = "";
          this.hasSlot = false;
        }
        else
        {
          this.orderSlot.availableslots[slotid] = this.orderSlot.availableslots[slotid] - this.count;
          this.orderSlot.date = deliverydate;
          this.orderState = 3;
          this.hasSlot = true;
          this.toggleAccord(2, false);
          this.toggleAccord(3, true);
        }
      }
      else if (this.checkNonEmptySlots()) {
        this.orderSlot = {
          "date": deliverydate,
          "availableslots": {},
          "maxslots":{}
        }
        this.orderSlot.availableslots[slotid] = this.selectedOption.maxcount - this.count;
        this.orderSlot.maxslots[slotid] = this.selectedOption.maxcount;
        this.orderState = 3;
        this.hasSlot = true;
        this.toggleAccord(2, false);
        this.toggleAccord(3, true);
      }
      else {
        this.formValidation.deliverydate.valid = false;
        this.formValidation.deliverydate.error = "Selected Date is Full.";
        this.formValidation.count.valid = false;
        this.formValidation.count.error = "";
        this.hasSlot = false;
      }
    }
  }
  public validateDetails() {
    var name = this.validateName();
    var company = (document.getElementById("company") as HTMLInputElement).value;
    var email = this.validateEmail();
    var phone = this.validatePhone();
    var comments = (document.getElementById("comments") as HTMLInputElement).value;
    if (this.formValidation.deliverydate.valid && this.formValidation.count.valid && this.formValidation.email.valid && this.formValidation.phone.valid && this.formValidation.name.valid) {
      this.orderinfo.name = name;
      this.orderinfo.deliverydate = this.orderSlot.date;
      this.orderinfo.company = company;
      this.orderinfo.email = email;
      this.orderinfo.phone = phone;
      this.orderinfo.comments = comments;
      this.orderinfo.phone = phone;
      this.orderinfo.comments = comments;
      this.orderinfo.total = this.count * this.selectedOption.cost;
      this.orderinfo.status = 0;
      this.orderinfo.tax = 0;
      this.orderinfo.orders.push(
        {
          "optionid": this.selectedOption.optionid,
          "serviceid": this.selectedOption.serviceid,
          "count": this.count,
          "cost": this.selectedOption.cost
        }
      );
      this.orderState = 4;
      this.toggleAccord(3, false);
    }
  }
  public validateEmail() {
    var email = (document.getElementById("email") as HTMLInputElement).value;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email || email == "") {
      this.formValidation.email.valid = false;
      this.formValidation.email.error = "Email is Required.";
    }
    else if (!re.test(String(email).toLowerCase())) {
      this.formValidation.email.valid = false;
      this.formValidation.email.error = "Invalid Email.";
    }
    else {
      this.formValidation.email.valid = true;
      this.formValidation.email.error = "";
    }
    return email;
  }
  public validatePhone() {
    var phone = (document.getElementById("phone") as HTMLInputElement).value;
    phone = phone.replace(/\D/g, '');
    if (!phone || phone == "") {
      this.formValidation.phone.valid = false;
      this.formValidation.phone.error = "Phone Number is Required.";
    }
    else if (phone.length != 10) {
      this.formValidation.phone.valid = false;
      this.formValidation.phone.error = "Invalid Phone Number.";
    }
    else {
      this.formValidation.phone.valid = true;
      this.formValidation.phone.error = "";
    }
    return phone;
  }
  public validateName() {
    var name = (document.getElementById("name") as HTMLInputElement).value;

    if (!name || name == "") {
      this.formValidation.name.valid = false;
      this.formValidation.name.error = "Name is Required.";
    }
    else {
      this.formValidation.name.valid = true;
      this.formValidation.name.error = "";
    }
    return name;
  }
  public updateOrder() {
    this.orderState = 1;
    this.accordFlag = [true, true, false, false];
  }
  public async placeOrder() {
    this.orderid = this.addOrderInfo();
    await this.updateSlotInfo();
    UIkit.notification({ message: 'order placed successfully. <br/>OrderId: <strong>' + this.orderid + '<strong><br/>', status: 'success' });
    this.orderState = 5;
    this.clear();
    document.getElementById("close-place-order").click();
  }
  public clear() {
    this.formValidation = {
      "deliverydate": {
        "valid": true,
        "error": ""
      },
      "count": {
        "valid": true,
        "error": ""
      },
      "name": {
        "valid": true,
        "error": ""
      },
      "phone": {
        "valid": true,
        "error": ""
      },
      "email": {
        "valid": true,
        "error": ""
      }
    };
    this.hasSlot = false;
    this.orderinfo = {
      "deliverydate": null,
      "name": "",
      "email": "",
      "company": "",
      "phone": "",
      "status": -1,
      "orders": [],
      "comments": "",
      "total": 0,
      "tax": 0,
      "promotion": "",
      "promotionamount": 0,
      "amountpaid": 0
    };
    this.accordFlag = [true, true, false, false];
    this.selectedOption = {
      'maxcount': 0,
      'mincount': 0
    };
    this.orderState = 0;
    this.slotInfos = [];
    this.count = 0;
    this.deliverydate = "";
    this.orderresult = 0;
  }
}

