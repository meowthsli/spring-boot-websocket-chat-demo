webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app.chat.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#chat-card {\n    width: 80%;\n    padding: 4em;\n    margin: auto;\n    margin-top: 5em;\n}\n\n#chat-card-actions {\n    text-align: right;\n}\n\n.chat-card-field {\n    padding: 1em;\n    width: 90%;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.chat.html":
/***/ (function(module, exports) {

module.exports = "<section class=\"mat-typography\">\n    <mat-card id=\"chat-card\">\n        <mat-card-header>\n            <mat-card-title><h1>ЧАТ</h1></mat-card-title>\n        </mat-card-header>\n        <mat-card-content>\n            <mat-form-field class=\"chat-card-field\">\n                <input matInput type=\"text\" placeholder=\"Укажите логин клиента\" />\n                <button mat-button *ngIf=\"value\" matSuffix mat-icon-button aria-label=\"Очистить\" (click)=\"username=''\">\n                <mat-icon>close</mat-icon>\n                </button>\n            </mat-form-field>              \n        </mat-card-content>\n        <mat-card-actions id=\"chat-card-actions\">\n            <button mat-raised-button color=\"primary\" id=\"login-button\" (click)='onClick()'>Войти</button>\n        </mat-card-actions>\n    </mat-card>\n</section>"

/***/ }),

/***/ "../../../../../src/app/app.chat.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_usercontext__ = __webpack_require__("../../../../../src/app/app.usercontext.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_stompjs__ = __webpack_require__("../../../../stompjs/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_stompjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_stompjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_sockjs_client__ = __webpack_require__("../../../../sockjs-client/lib/entry.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_sockjs_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_sockjs_client__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * @title Main app component
 */
var ChatComponent = (function () {
    function ChatComponent(router, uctx) {
        this.router = router;
        this.uctx = uctx;
        this.socket = new __WEBPACK_IMPORTED_MODULE_4_sockjs_client__('/ws');
        this.stompClient = __WEBPACK_IMPORTED_MODULE_3_stompjs__["over"](this.socket);
    }
    ChatComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.stompClient.connect({}, function () { return _this.onStompConnected(); }, function () { return _this.onStompError(); });
    };
    ChatComponent.prototype.onStompConnected = function () {
        var _this = this;
        console.log("Stomp connected");
        this.stompClient.subscribe('/channel/public', function (payload) { return _this.onStompReceived(payload); });
        this.stompClient.send("/app/chat.addUser", {}, JSON.stringify({ sender: this.uctx.username, type: 'JOIN' }));
    };
    ChatComponent.prototype.onStompError = function () {
        console.log("Stomp error");
    };
    ChatComponent.prototype.onStompReceived = function (payload) {
        var message = JSON.parse(payload.body);
        console.log('payload = ', payload.body);
    };
    ChatComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-chat',
            template: __webpack_require__("../../../../../src/app/app.chat.html"),
            styles: [__webpack_require__("../../../../../src/app/app.chat.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */], __WEBPACK_IMPORTED_MODULE_2__app_usercontext__["a" /* UsercontextService */]])
    ], ChatComponent);
    return ChatComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * @title Main app component
 */
var AppComponent = (function () {
    function AppComponent(router) {
        this.router = router;
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-root',
            template: "\n    <router-outlet></router-outlet>\n  "
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.login.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#login-card {\n    width: 40%;\n    padding: 4em;\n    margin: auto;\n    margin-top: 10em;\n}\n\n#login-card-actions {\n    text-align: center;\n}\n\n.login-card-field {\n    padding: 1em;\n    width: 90%;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.login.html":
/***/ (function(module, exports) {

module.exports = "<section class=\"mat-typography\">\n    <mat-card id=\"login-card\">\n        <mat-card-header>\n          <mat-card-title><h1>Тестовый доступ</h1></mat-card-title>\n        </mat-card-header>\n        <mat-card-content>\n            <mat-form-field class=\"login-card-field\">\n              <input matInput type=\"text\" placeholder=\"Укажите логин (email) клиента\" [(ngModel)]=\"$username\"\n                [formControl]=\"$emailFormControl\"/>\n              <button mat-button *ngIf=\"$username\" matSuffix mat-icon-button aria-label=\"Очистить\" (click)=\"$username=''\">\n                <mat-icon>close</mat-icon>\n              </button>\n              <mat-error *ngIf=\"$emailFormControl.hasError('required')\">\n                  Логин <strong>обязателен</strong>\n              </mat-error>\n            </mat-form-field>              \n        </mat-card-content>\n        <mat-card-actions id=\"login-card-actions\">\n          <button mat-raised-button color=\"primary\" (click)='$onLogonClick()'>Войти</button>\n        </mat-card-actions>\n    </mat-card>\n</section>"

/***/ }),

/***/ "../../../../../src/app/app.login.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_usercontext__ = __webpack_require__("../../../../../src/app/app.usercontext.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * @title Main app component
 */
var LoginComponent = (function () {
    function LoginComponent(router, uctx) {
        this.router = router;
        this.uctx = uctx;
        this.$emailFormControl = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormControl */]('', [
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["j" /* Validators */].required
        ]);
    }
    LoginComponent.prototype.$onLogonClick = function () {
        if (!this.$username) {
            return;
        }
        this.uctx.username = this.$username;
        this.router.navigateByUrl('/chat');
    };
    LoginComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-login',
            template: __webpack_require__("../../../../../src/app/app.login.html"),
            styles: [__webpack_require__("../../../../../src/app/app.login.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */], __WEBPACK_IMPORTED_MODULE_3__app_usercontext__["a" /* UsercontextService */]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__("../../../material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_material_card__ = __webpack_require__("../../../material/esm5/card.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_material_input__ = __webpack_require__("../../../material/esm5/input.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_material_icon__ = __webpack_require__("../../../material/esm5/icon.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_login__ = __webpack_require__("../../../../../src/app/app.login.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_chat__ = __webpack_require__("../../../../../src/app/app.chat.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__app_usercontext__ = __webpack_require__("../../../../../src/app/app.usercontext.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














var routes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_10__app_login__["a" /* LoginComponent */] },
    { path: 'chat', component: __WEBPACK_IMPORTED_MODULE_11__app_chat__["a" /* ChatComponent */] },
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["K" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_10__app_login__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_11__app_chat__["a" /* ChatComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_3__angular_router__["b" /* RouterModule */].forRoot(routes, {}),
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* FormsModule */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["i" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__["a" /* NoopAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["c" /* MatGridListModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["a" /* MatButtonModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["b" /* MatCheckboxModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_material_card__["a" /* MatCardModule */],
                __WEBPACK_IMPORTED_MODULE_7__angular_material_input__["b" /* MatInputModule */],
                __WEBPACK_IMPORTED_MODULE_8__angular_material_icon__["a" /* MatIconModule */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_12__app_usercontext__["a" /* UsercontextService */]
            ],
            bootstrap: [
                __WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* AppComponent */]
            ]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../src/app/app.usercontext.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsercontextService; });
var UsercontextService = (function () {
    function UsercontextService() {
    }
    return UsercontextService;
}());



/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_17" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map