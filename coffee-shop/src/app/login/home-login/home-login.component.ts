import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CookieService} from "../service/cookie.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {LoginService} from "../service/login.service";
import {AuthService} from "../service/auth.service";
import {ForgotService} from "../service/forgot.service";
import {CommonService} from "../service/common.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home-login',
  templateUrl: './home-login.component.html',
  styleUrls: ['./home-login.component.css']
})
export class HomeLoginComponent implements OnInit {

  loginForm: FormGroup;
  forgotForm: FormGroup;
  messageReceived: any;
  private subscriptionName: Subscription;

  constructor(private cookieService: CookieService,
              private router: Router,
              private toastrService: ToastrService,
              private loginService: LoginService,
              private authService: AuthService,
              private forgotService: ForgotService,
              private commonService: CommonService) {
    this.subscriptionName = this.commonService.getUpdate().subscribe(message => {
      this.messageReceived = message;
    });
  }

  ngOnInit(): void {
    const username = this.cookieService.getCookie("usernameRemember");
    const password = this.cookieService.getCookie("passwordRemember");
    if (username != '' && password != '') {
      this.createLoginForm(username, password);
    } else {
      this.createLoginForm("", "");
    }
    this.createForgotForm();
  }

  createLoginForm(username: string, password: string) {
    this.loginForm = new FormGroup({
      username: new FormControl(username, [Validators.required, Validators.pattern('^[A-Za-z][A-Za-z0-9_]{3,50}$')]),
      password: new FormControl(password, [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]),
      rememberMe: new FormControl()
    })
  }

  createForgotForm() {
    this.forgotForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z][A-Za-z0-9_]{3,50}$')])
    })
  }

  onLogin() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      if (this.loginForm.value.rememberMe) {
        this.cookieService.setCookie("usernameRemember", username, 100);
        this.cookieService.setCookie("passwordRemember", password, 100);
      }
      this.loginService.onLogin(username, password).subscribe(value => {
        this.authService.isLogin(value);
      }, error => {
        switch (error.error) {
          case "isLogin":
            this.toastrService.warning("Bạn đã đăng nhập rồi!");
            break;
          case "PasswordExpired":
            this.toastrService.warning("Mật khẩu bạn đã quá hạn vui lòng đổi mật khẩu mới!");
            break;
          default:
            this.toastrService.warning("Tên đăng nhập hoặc mật khẩu không chính xác!")
            break;
        }
      }, () => {
        this.router.navigateByUrl('/home').then(() => {
          this.toastrService.success("Đăng nhập thành công!")
          this.sendMessage();
        });
      });
    } else {
      this.toastrService.error("Thông tin bạn nhập không chính xác!");
    }
  }

  onForgot() {
    if (this.forgotForm.valid) {
      this.router.navigateByUrl("/loading").then(() => {
        //@ts-ignore
        $("#staticBackdropForgot").modal('hide');
      })
      this.forgotService.onForgot(this.forgotForm.value.username).subscribe(value => {
      }, error => {
        //@ts-ignore
        $("#staticBackdropForgot").modal('hide');
        this.router.navigateByUrl("/login").then(() => {
          this.toastrService.warning("Tên tài khoản không tồn tại!");
          //@ts-ignore
          $("#staticBackdropForgot").modal('show');
        })
      }, () => {
        this.router.navigateByUrl("/login").then(() => {
          //@ts-ignore
          $("#staticBackdropForgot").modal('hide');
          this.toastrService.success("Gửi yêu cầu thành công. Vui lòng kiểm tra email của bạn!")
          this.forgotForm.reset();
        })
      });
    } else {
      this.toastrService.warning("Thông tin bạn nhập chưa chính xác!")
    }
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.commonService.sendUpdate('Đăng Nhập thành công!');
  }

  closeForgot() {
    this.forgotForm.reset();
  }
}
