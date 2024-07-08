// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Monarch Tweaks
// @author       Robert
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// @grant        GM_addStyle
// ==/UserScript==

let r_Init = false;
let r_Display = false;
let SaveLocationPathName = "";

function Init() {

    let remove_list = [];
    if (getCookie('MT_Ads') == true) { remove_list.push("[href~='/settings/referrals']"); };
    if (getCookie('MT_Advice') == true) { remove_list.push("[href~='/advice']"); };
    if (getCookie('MT_Investments') == true) { remove_list.push("[href~='/investments']"); };
    if (getCookie('MT_Goals') == true) { remove_list.push("[href~='/objectives']"); };
    if (getCookie('MT_Recurring') == true) { remove_list.push("[href~='/recurring']"); };
    if (getCookie('MT_Budget') == true) { remove_list.push("[href~='/plan']"); };
    MM_removeElements(remove_list);

}

function MM_removeElements(InList) {

    for (const selector of InList) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            el.style.display = "none"
        }
    };
}

function MenuReports(OnFocus) {

    if (SaveLocationPathName.substring(0,9) == '/reports/') {
        if(OnFocus == true) {
            
        }
    }
}

function MenuDisplay(OnFocus) {

    if (SaveLocationPathName.substring(0,17) == '/settings/display') {
        if(OnFocus == false) {
           // r_Init = false;
        }
        if(OnFocus == true) {
            MM_CreateCheckbox('Hide Monarch Ads','MT_Ads');
            MM_CreateCheckbox('Hide Advice','MT_Advice');
            MM_CreateCheckbox('Hide Investments','MT_Investments');
            MM_CreateCheckbox('Hide Goals','MT_Goals');
            MM_CreateCheckbox('Hide Recurring','MT_Recurring');
            MM_CreateCheckbox('Hide Budget','MT_Budget');
        }
    }
}

function MM_CreateCheckbox(inValue,inCookie) {

   let qs = document.querySelector('.FormItemContainer__Root-j5b8rt-0');
   let e1 = document.createElement('div');
    e1.style = "font-size: 14px; margin:9px;";
    //e1.innerText = inValue;
    qs.after(e1);

    let OldValue = getCookie(inCookie);
    let e2 = document.createElement('input');
    e2.type = 'checkbox';
    e2.style = "position: relative;width: 20px;height: 20px;min-width: 20px;; margin:9px;";
    if(OldValue == 1) {e2.checked = 'checked'};
    e1.appendChild(e2);
    e2.addEventListener('click', () => {
        MM_FlipCookie(inCookie);
   });

    var text = document.createTextNode(inValue);
    e2.parentNode.insertBefore(text, e2.nextSibling)

}

function MM_FlipCookie(inCookie) {

    let OldValue = getCookie(inCookie);
    if(OldValue == 1) { OldValue = 0 } else {OldValue = 1};
    setCookie(inCookie,OldValue);
    r_Init = false;
}

function setCookie(cname, cvalue) {

    document.cookie = cname + "=" + cvalue + ";" ;
}


function getCookie(cname) {

    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

(function() {
    setInterval(() => {

        if(r_Init == false) {
            Init();
            r_Init = true;
        }

        if(window.location.pathname != SaveLocationPathName) {
            // Before Window Change
            MenuReports(false);
            MenuDisplay(false);

            SaveLocationPathName = window.location.pathname;

            // After Window Change
            MenuReports(true);
            MenuDisplay(true);
        }

    },500);
}());
