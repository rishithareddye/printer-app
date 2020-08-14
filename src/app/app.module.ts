import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';

import { AngularFireModule } from '@angular/fire';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';


import { FirebaseService } from './service/firebase.service';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ServicesComponent } from './components/services/services.component';
import { OptionsComponent } from './components/options/options.component';
import { AdminPortalComponent } from './components/admin-portal/admin-portal.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SlotsComponent } from './components/slots/slots.component';
import { ServiceHandleComponent } from './components/service-handle/service-handle.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { UikitTableComponent } from './components/uikit-table/uikit-table.component';
import { AdminSlotInfoComponent } from './components/admin-slot-info/admin-slot-info.component';
import { AdminServicesInfoComponent } from './components/admin-services-info/admin-services-info.component';
import { AdminOptionInfoComponent } from './components/admin-option-info/admin-option-info.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomePageComponent,
    FooterComponent,
    PlaceOrderComponent,
    ContactUsComponent,
    ServicesComponent,
    OptionsComponent,
    AdminPortalComponent,
    OrdersComponent,
    SlotsComponent,
    ServiceHandleComponent,
    AdminOrdersComponent,
    UikitTableComponent,
    AdminSlotInfoComponent,
    AdminServicesInfoComponent,
    AdminOptionInfoComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StorageServiceModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
