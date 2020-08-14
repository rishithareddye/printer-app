import { Inject, Injectable } from '@angular/core';
import { Service } from '../model/service.model';
import { SlotInfo } from '../model/slot-info.model';
import { Order } from '../model/order.model';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  userData: any;
  task: AngularFireUploadTask;
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private firestore: AngularFirestore, private firestorage: AngularFireStorage) {
    this.getOrderCounter();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }
  SERVICE_KEY = 'local_service';
  LOG_KEY = 'local_log_service';
  orderCount: number = 0;
  firestoreCollection = this.firestore.collection('slots');

  async getServiceInfo(): Promise<Service[]> {
    // let res = this.storage.get(this.SERVICE_KEY);
    // let log = this.storage.get(this.LOG_KEY);
    // let maxDate = new Date();
    // maxDate.setDate(maxDate.getDate() - 1);
    // console.log(res);
    // console.log(log);
    // if (!res || !log || new Date(log) < maxDate) {
    //   this.storage.set(this.SERVICE_KEY, await this.getService());
    //   this.storage.set(this.LOG_KEY, new Date());
    // }
    // return this.storage.get(this.SERVICE_KEY) as Service[];
    return await this.getService();
    }
  async addService(service: Service): Promise<boolean> {
    try {
      if (!service.pushid) {
        service.pushid = this.db.createPushId();
      }
      await this.db.object('services/' + service.pushid).set(service);
      return true;
    } catch (err) {
      return false;
    }
  }
  async getService(): Promise<Service[]> {
    console.log("retrieving from firebase");
    var result: Service[] = [];
    var res = await this.db.object('services').query.once('value');
    res.forEach(value => {
      var res = value.val();
      res.pushid = value.key;
      result.push(res as Service);
    });
    return result;
  }
  //admin service observable
  getServices(): Observable<any> {
    return this.db.object('services').valueChanges();
  }
  async deleteService(pushid: string): Promise<boolean> {
    try {

      await this.db.object('services/' + pushid).remove();
      return true;
    } catch (err) {
      return false;
    }
  }
  getOrderInfo(): Observable<any> {
    return this.db.object('orders').valueChanges();
  }
  addOrder(order: Order): string {
    var add: boolean = false;
    if (!order.pushid) {
      order.pushid = 'VS' + this.orderCount;
      add = true;
    }
    this.db.object('orders/' + order.pushid).set(order).then(() => {
      return true;
    }).catch(() => {
      return false;
    });
    if (add == true) {
      this.setOrderCounter();
    }
    return order.pushid;
  }
  async deleteOrder(pushid: string): Promise<boolean> {
    try {

      await this.db.object('orders/' + pushid).remove();
      return true;
    } catch (err) {
      return false;
    }
  }
  getOrderCounter() {
    this.db.object('ordercounter').valueChanges().subscribe((res) => {
      if (res != null) {
        this.orderCount = res as number;
      }
    });
  }
  setOrderCounter() {
    this.db.object('ordercounter').set(this.orderCount + 1);
  }
  async addSlot(data: SlotInfo): Promise<boolean> {
    try {
      data.date = Date.parse(data.date);
      await this.firestoreCollection.add(data);
      return true;
    } catch (err) {
      return false;
    }
  }
  async updateSlot(data: SlotInfo, docid: string): Promise<boolean> {
    try {
      if(isNaN(data.date)){
        data.date = Date.parse(data.date);
      }
      await this.firestoreCollection.doc(docid).update(data);
      return true;
    } catch (err) {
      return false;
    }
  }
  async getSlot(date: any, templateid: string, count: number): Promise<any> {
    try {
      var slot: any = null;
      var result = {
        "count": 0,
        "slot": null
      }
      var snapshot = await this.firestoreCollection.ref.where('date', '==', Date.parse(date)).limit(1).get();
      if (snapshot.empty) {
        return result;
      }
      
      snapshot.forEach(doc => {
        slot = doc.data() as SlotInfo;
        result.count = result.count+1;
        if (!slot.availableslots[templateid] || slot.availableslots[templateid] >= count) {
          slot.pushid = doc.id;
          result.slot = slot;
        }
      });
      return result;
    } catch (err) {
      return result;
    }
  }
  async getSpecificSlot(date: any): Promise<any[]> {
    try {
      var slot: any = null;
      var service: Service[] = [];
      var snapshot = await this.firestoreCollection.ref.where('date', '==', Date.parse(date)).get();
      if (snapshot.empty) {
        return [];
      }
      
      snapshot.forEach(doc => {
        slot = doc.data() as SlotInfo;
          slot.pushid = doc.id;
          service.push(slot);
      });
      return service;
    } catch (err) {
      return service;
    }
  }
  async deleteSlot(docid: string): Promise<boolean> {
    try {
      await this.firestoreCollection.doc(docid).delete();
      return true;
    } catch (err) {
      return false;
    }
  }
  async SignIn(email, password):Promise<boolean> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        return true;
      }).catch((error) => {
        return false;
      });
  }
  async SignUp(email, password):Promise<boolean> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        return true;
      }).catch((error) => {
        return false;
      });
  }
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
    });
  }
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      });
  }
  ResetPassword(email) {
    return this.afAuth.sendPasswordResetEmail(email).then(() => { }).catch((error) => {
      window.alert(error.message)
    });
  }
  async UploadDocument(file: File, bucket: string, filename: string): Promise<string> {
    let path = `${bucket}/${filename}`;
    console.log(path);
    const ref = this.firestorage.ref(path);
    const metaData = { 'contentType': file.type };
    let task = await ref.put(file, metaData);
    let url = await task.ref.getDownloadURL();
    return url;
  }
  async DeleteDocument(fileUrl: string) : Promise<boolean> {
    try {
      await this.firestorage.storage.refFromURL(fileUrl).delete();
      return true;
    }
    catch(e) {
      return false;
    }
  }
}
