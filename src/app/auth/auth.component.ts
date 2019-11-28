import { Component, ComponentFactoryResolver, ViewChild, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy, OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alerHost: PlaceholderDirective;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
    ) {}

  ngOnInit() {    
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading=authState.loading;
      this.error=authState.authError;
      if(this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      //authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
    }

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy() {
    if(this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if(this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string) {
    // const alertComp = new AlertComponent();
    const alertCompFactory=this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewcontainerRef=this.alerHost.viewContainerRef;
    hostViewcontainerRef.clear();

    const componentRef=hostViewcontainerRef.createComponent(alertCompFactory);
    componentRef.instance.message=message;
    this.closeSub=componentRef.instance.closeModal.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewcontainerRef.clear();
    });
  }
}
