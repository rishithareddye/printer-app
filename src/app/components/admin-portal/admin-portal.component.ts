import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { Orderinfo } from 'src/app/model/orderinfo.model';
import { Service } from 'src/app/model/service.model';
import { SlotInfo } from 'src/app/model/slot-info.model';
import { AdminServicesInfoComponent } from '../admin-services-info/admin-services-info.component';
declare var UIkit: any;

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {
  @ViewChild(AdminServicesInfoComponent) service: AdminServicesInfoComponent;
  isLoggedIn: boolean = false;
  registerUser: boolean = false;
  emailValid:boolean = true;
  passwordValid:boolean = true;
  signedIn:boolean = true;
  dashboardState: number = 0;
  constructor(public fireBaseService: FirebaseService) { }
  public orders: Record<string, Orderinfo> = {};
  ngOnInit(): void {
    this.isLoggedIn = this.fireBaseService.isLoggedIn;
    this.dashboardState = this.isLoggedIn ? 1 : 0;
  }
  public async LogIn() {
    var email = (document.getElementById("email") as HTMLInputElement).value;
    this.emailValid = this.validateEmail(email);
    var password = (document.getElementById("password") as HTMLInputElement).value;
    this.passwordValid = (password.length <1) ? false : true;
    if(this.emailValid && this.passwordValid)
    {
      this.signedIn = await this.fireBaseService.SignIn(email, password);
      this.isLoggedIn = this.signedIn;
      if(this.signedIn)
      {
        this.dashboardState = 1;
        (document.getElementById("email") as HTMLInputElement).value = "";
        (document.getElementById("password") as HTMLInputElement).value = "";
        document.getElementById("close-modal").click();
      }
    }
    else
    {
      this.isLoggedIn = false;
    }
  }
  public getOrders() {
     this.isLoggedIn = this.fireBaseService.isLoggedIn;
    this.fireBaseService.getOrderInfo().subscribe((res) => {
      if (res) {
        this.orders = res as Record<string, Orderinfo>;
      }
    });
  }
  public onFileSelected(event) {
    console.log(this.fireBaseService.isLoggedIn);
    if (event.target.files.length > 0) {
      var file: File = event.target.files[0] as File;
      this.fireBaseService.UploadDocument(file,"services",file.name);
    }
  }
  public LogOut(){
    this.fireBaseService.SignOut();
    this.isLoggedIn = false;
  }
  public validateEmail(email):boolean
  {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email || email == "") {
      return false;
    }
    else if (!re.test(String(email).toLowerCase())) {
      return false;
    }
    return true;
  }
  public opendashBoard(state: number) {
    this.dashboardState = state;
  }
  public SignUpUser() {
    this.registerUser = true;
    UIkit.modal('#login-modal').show();
  }
  public async SignUp() {
    var email = (document.getElementById("email") as HTMLInputElement).value;
    this.emailValid = this.validateEmail(email);
    var password = (document.getElementById("password") as HTMLInputElement).value;
    this.passwordValid = (password.length <1) ? false : true;
    if(this.emailValid && this.passwordValid)
    {
      this.signedIn = await this.fireBaseService.SignUp(email, password);
      document.getElementById("close-modal").click();
      this.registerUser = false;
    }
  }
}
