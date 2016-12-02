// 默认配置ajax跨域项
$.ajaxSettings = $.extend($.ajaxSettings, {
    'contentType': 'application/json; charset=UTF-8',
    'xhrFields': {
        'withCredentials': true
    }
});
// 自定义vue验证器

//匹配6-20位的任何字类字符，包括下划线。与“[A-Za-z0-9_]”等效。
Vue.validator('passw', function(val) {
    return /^(\w){6,16}$/.test(val)
});
//匹配手机号
Vue.validator('phone', function(val) {
    return /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^(([0\+]\d{2,3})?(0\d{2,3}))(\d{7,8})((\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/.test(val)
});
// 匹配身份证号
Vue.validator('idnum', function(val) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)
});
// 6位数字交易密码
Vue.validator('tradepassw', function(val) {
    return /^\d{6}$/.test(val)
});

// AES加密
var AesUtil = function(keySize, iterationCount) {
    this.keySize = keySize / 32;
    this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function(salt, passPhrase) {
    var key = CryptoJS.PBKDF2(
        passPhrase,
        CryptoJS.enc.Hex.parse(salt), { keySize: this.keySize, iterations: this.iterationCount });
    return key;
};

AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
    var key = this.generateKey(salt, passPhrase);
    var encrypted = CryptoJS.AES.encrypt(
        plainText,
        key, { iv: CryptoJS.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

AesUtil.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
    var key = this.generateKey(salt, passPhrase);
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    var decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        key, { iv: CryptoJS.enc.Hex.parse(iv) });
    return decrypted.toString(CryptoJS.enc.Utf8);
};



var base = (function($) {
    return {
        // rsa加密
        rsaEncrypt: function(val, publickey) {
            var crypt = new JSEncrypt();
            crypt.setKey(publickey);
            var encryptPwd = crypt.encrypt(val);
            return encryptPwd;
        },
        // md5+rsa加密
        // encrypt: function(val, publickey) {
        //     var hash = hex_md5(val);
        //     var crypt = new JSEncrypt();
        //     crypt.setKey(publickey);
        //     var encryptPwd = crypt.encrypt(hash);
        //     return encryptPwd;
        // },
        encrypt: function(val, publickey) {
            var deBase64 = CryptoJS.enc.Base64.parse(val);
            var hash = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(deBase64));
            console.log(hash);
            var crypt = new JSEncrypt();
            crypt.setKey(publickey);
            var encryptPwd = crypt.encrypt(hash);
            return encryptPwd;
        },
        // 60s倒计时
        countDown: function(target) {
            var source = target.val();
            var time = 60;
            subStract();
            var timer = setInterval(subStract, 1000);

            function subStract() {
                target.attr('disabled', 'disabled');
                if (time < 1) {
                    target.val(source);
                    clearInterval(timer);
                    target.removeAttr('disabled');
                    time = 60;
                } else {
                    target.val(time + "秒");
                    time--;
                }
            }
        },
        getQueryString: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }



        // 自定义键盘
        // KeyBoard: function(input, options) {
        //     var body = document.getElementsByTagName('body')[0];
        //     var DIV_ID = options && options.divId || '__w_l_h_v_c_z_e_r_o_divid';

        //     if (document.getElementById(DIV_ID)) {
        //         body.removeChild(document.getElementById(DIV_ID));
        //     }

        //     this.input = input;
        //     this.el = document.createElement('div');

        //     var self = this;
        //     var zIndex = options && options.zIndex || 20000;
        //     var width = options && options.width || '100%';
        //     var height = options && options.height || '9.75rem';
        //     var fontSize = options && options.fontSize || '15px';
        //     var backgroundColor = options && options.backgroundColor || '#fff';
        //     var TABLE_ID = options && options.table_id || 'table_keyboard';
        //     var mobile = typeof orientation !== 'undefined';

        //     this.el.id = DIV_ID;
        //     this.el.style.position = 'fixed';
        //     this.el.style.left = 0;
        //     this.el.style.right = 0;
        //     this.el.style.bottom = '-9.75rem';
        //     this.el.style.zIndex = zIndex;
        //     this.el.style.width = width;
        //     this.el.style.height = height;
        //     this.el.style.backgroundColor = backgroundColor;
        //     //样式

        //     //table
        //     var tableStr = '<table id="' + TABLE_ID + '" border="0" cellspacing="0" cellpadding="0">';
        //     tableStr += '<tr><td>1<img src="../../img/blank.png"/></td><td>2<img src="../../img/abc.png"/></td><td>3<img src="../../img/def.png"/></td></tr>';
        //     tableStr += '<tr><td>4<img src="../../img/ghi.png"/></td><td>5<img src="../../img/jkl.png"/></td><td>6<img src="../../img/mno.png"/></td></tr>';
        //     tableStr += '<tr><td>7<img src="../../img/pqrs.png"/></td><td>8<img src="../../img/tuv.png"/></td><td>9<img src="../../img/wxyz.png"/></td></tr>';
        //     tableStr += '<tr><td style="background-color:#d4d8db;">.</td><td>0</td>';
        //     tableStr += '<td style="background-color:#d4d8db;"><span class="icon icon-keyboard-delete" style="font-size:0;" >删除</span></td></tr>';
        //     tableStr += '</table>';
        //     this.el.innerHTML = tableStr;

        //     // 6个表单输入框
        //     var inputDiv = document.getElementsByClassName("inner-box");

        //     function addEvent(e) {
        //         var ev = e || window.event;
        //         var clickEl = ev.element || ev.target;
        //         var value = clickEl.textContent || clickEl.innerText;
        //         if (clickEl.tagName.toLocaleLowerCase() === 'td' && value !== "删除") {
        //             if (self.input) {
        //                 self.input.value += value;
        //             }
        //         } else if (clickEl.tagName.toLocaleLowerCase() === 'span' && value === "删除") {
        //             var num = self.input.value;
        //             if (num) {
        //                 var newNum = num.substr(0, num.length - 1);
        //                 self.input.value = newNum;
        //             }
        //         }
        //         // // 点亮充值按钮
        //         if (this.textContent == '') {
        //             $('.jbutn-recharge').attr('disabled', 'disabled');
        //         } else {
        //             $('.jbutn-recharge').removeAttr('disabled');
        //         }
        //         // 方格显示输入数字
        //         if (self.input.id == 'pwd_input' || self.input.id == 'pwd_input1') {
        //             var pwdValue = self.input.value;
        //             var len = pwdValue.length;
        //             if (value == '删除') {
        //                 inputDiv[len].childNodes[0].value = '';
        //             }
        //             for (var i = 0; i < len; i++) {
        //                 inputDiv[i].childNodes[0].value = pwdValue[i];
        //             }
        //             if (len >= 6) {
        //                 $('#table_keyboard').removeClass('active');
        //                 $('.modal').removeClass('moveUp');
        //                 if (self.input.id == 'pwd_input') {
        //                     $.closeModal(vm.pwdModal);
        //                     // 绑定实名付弹窗
        //                     var realnameModal = $.modal({
        //                         text: '<div class="realname-alert-content">' + '<div class="jclose">' + '<div class="left-line line"></div>' + '<div class="right-line line"></div>' + '</div>' + '<img src="../../img/card_icon@2x.png" class="">' + '<p>尊敬的用户，您正在通过通联支付开通银行卡代扣支付功能。</p>' + '<div class="phoneNum-row">' + '<label>预留手机号:</label>' + '<label>18511745835</label>' + '</div>' + '<div class="verifiyCode-row">' + '<label>短信验证码:</label>' + '<div class="input-box">' + '<div class="inner-box"><input type="password" readonly="readonly" /></div>' + '<div class="inner-box"><input type="password" readonly="readonly" /></div>' + '<div class="inner-box"><input type="password" readonly="readonly" /></div>' + '<div class="inner-box"><input type="password" readonly="readonly" /></div>' + '<div class="inner-box"><input type="password" readonly="readonly" /></div>' + '<div class="inner-box"><input type="password" readonly="readonly" /></div>' + '<input type="tel" id="pwd_input1" readonly="readonly"/>' + '</div>' + '</div>' + '<p class="secondSend-tips">' + '没收到验证码？<a href="">再次发送</a>' + '</p>' + '</div>',
        //                         buttons: [{
        //                             text: '确定',
        //                             onClick: function() {}
        //                         }]

        //                     });
        //                 } else if (self.input.id == 'pwd_input1') {
        //                     $.closeModal(realnameModal);
        //                 }
        //                 var pwdInput1 = document.getElementById('pwd_input1');
        //                 pwdInput1.onclick = function() {
        //                     $('.modal').addClass('moveUp');
        //                     new KeyBoard(pwdInput1);
        //                     setTimeout(function() {
        //                         $('#table_keyboard').addClass('active');
        //                     }, 200)

        //                 };
        //                 $('body').on('tap', '.jclose', function() {
        //                     $.closeModal(realnameModal);
        //                 });


        //             }
        //         }

        //     }

        //     if (mobile) {
        //         this.el.ontouchstart = addEvent;
        //     } else {
        //         this.el.onclick = addEvent;
        //     }
        //     body.appendChild(this.el);
        // }


    }


})(Zepto);

//事件绑定
var eventsBind = (function() {
    $(document).on('tap', '#icon_eye', function() {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $(this).parents().find('.pwd').attr('type', 'password');
        } else {
            $(this).addClass('open');
            $(this).parents().find('.pwd').attr('type', 'text');
        }
    })

})();
