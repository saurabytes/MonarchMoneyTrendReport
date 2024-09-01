// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  Monarch Tweaks
// @author       Robert
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// @grant        GM_addStyle
// ==/UserScript==

let r_Init = false;
let r_Tips = 0;
let r_Toaster = 0;
let r_Filter = 0;
let r_FilterD = false;
let SaveLocationPathName = "";

function getStyle() {
  const cssObj = window.getComputedStyle(document.querySelectorAll('[class*=Page__Root]')[0], null);
  const bgColor = cssObj.getPropertyValue('background-color');
  if (bgColor === 'rgb(8, 32, 67)') {
    return 'dark';
  }
  return 'light';
}

function MM_Init() {

    let a1 = '#04AA6D; color: white;';
    let a2 = 'rgb(13, 44, 92); color: white;';
    let a3 = '#14457a; color: white;';
    let s = getStyle();
    if(s == 'light') {
        a1 = '#ffffff; color: rgb(8, 40, 100);';
        a2 = '#ffffff; color: rgb(8, 40, 100);';
        a3 = '#eaf6fd; color: rgb(61, 146, 222);';
    }

    GM_addStyle('.dropbtn {background-color: ' + a1 + ' padding: 12px; font-size: 12px; border: none; cursor: pointer;}');
    GM_addStyle('.dropbtn:hover, .dropbtn:focus {  background-color: ' + a3 + '}');
    GM_addStyle('.dropdown {  float: right;  position: relative;  display: inline-block;}');
    GM_addStyle('.dropdown-content div {font-size: 0px; line-height: 3px; color: #ff7369; background-color: #ff7369;}');
    GM_addStyle('.dropdown-content {background-color: ' + a2 + ' display: none; position: absolute; min-width: 220px; overflow: auto; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px; right: 0;  z-index: 1;}');
    GM_addStyle('.dropdown-content a {background-color: ' + a2 + ' font-weight: normal; font-style: normal; font-size: 15px;font-family: "Graphik", sans-serif; padding: 8px 8px; text-decoration: none; display: block;}');
    GM_addStyle('.dropdown a:hover {background-color: ' + a3 + ' }');

    GM_addStyle('.show {display: block;}');

    MM_removeElement("[href~='/settings/referrals']",getCookie('MT_Ads'));
    MM_removeElement("[href~='/advice']",getCookie('MT_Advice'));
    MM_removeElement("[href~='/investments']",getCookie('MT_Investments'));
    MM_removeElement("[href~='/objectives']",getCookie('MT_Goals'));
    MM_removeElement("[href~='/recurring']",getCookie('MT_Recurring'));
    MM_removeElement("[href~='/plan']",getCookie('MT_Budget'));
    r_Tips = getCookie("MT_HideTipDiff");
    r_Toaster = getCookie("MT_HideToaster");
}

function MM_removeElements(InList,InValue) {

    for (const selector of InList) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            if(InValue == 1) {el.style.display = 'none'} else {el.style.display = ''};
        }
    };
}

function MM_removeElement(InList,InValue) {

    const elements = document.querySelectorAll(InList);
    for (const el of elements) {
        if(InValue == 1) {el.style.display = 'none'} else {el.style.display = ''};
    }
}

function MenuReports(OnFocus) {

    if (SaveLocationPathName.substring(0,9) == '/reports/') {
        switch(OnFocus) {
            case false:
                break;
            case true:
                if(r_Filter == 0) {
                    MenuReportsSetup()
                }
                break;
            case 2:
                if(r_Tips == 1) {
                    MM_removeElement("div.ReportsTooltipRow__Diff-k9pa1b-3","none");
                }
                break;
        }
    }
}

function MenuReportsSetup() {

    const isFilter = document.querySelector('button.MT_FilterRestore')
    if(isFilter == null) {
        const elements=document.querySelectorAll('div.WithIndicatorContainer__Root-sc-1gqsonh-0');
        if(elements) {
            for (const li of elements) {
                if(li.innerText == '\uf11e\nFilters') {
                    let cn = li.childNodes[0].className;

                    let div = document.createElement('div');
                    div.className = 'dropdown';
                    li.after(div);

                    let fbr = document.createElement('button');
                    fbr.className = "MT_FilterRestore " + cn;
                    fbr.textContent = 'Datasets';
                    div.appendChild(fbr);

                    let fb2 = document.createElement('div');
                    fb2.className = "dropdown-content";
                    fb2.setAttribute('id','MTDropdown');
                    div.appendChild(fb2);

                    fbr.addEventListener('click', () => {
                        MenuFilter();
                    });
                }
            }
        }
    }
}

window.onclick = function(event) {

    if(r_FilterD == true) {
        if (!event.target.matches('.MT_FilterRestore')) {
            document.getElementById("MTDropdown").classList.toggle("show");
            r_FilterD = false;
            let et = event.target.href;
            let iMTF = et.search("#MTF_");
            if(iMTF > 0) {
                iMTF+=1;
                let cn = et.substring(iMTF);
                cn = cn.replaceAll('%20',' ');
                switch(cn) {
                    case 'MTF_@':
                        MenuFilter_Save('');
                        break;
                    case 'MTF_#':
                        MenuFilter_Save(getCookie('MT_LastFilter'));
                        break;
                    case 'MTF_$':
                        deleteCookie(getCookie('MT_LastFilter'));
                        setCookie("MT_LastFilter","");
                        break;
                    default:
                        MenuFilter_Restore(cn)
                        break;
                }
            }
        }
    }
}

function MenuFilter() {

    let eID = document.getElementById("MTDropdown");
    let NewToggle = eID.classList.toggle("show");
    if(NewToggle == true) {
        while (eID.hasChildNodes()) {
            eID.removeChild(eID.firstChild);
        }

        let rnames = [];
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            let cm = c.substring(0,4);
            if(cm == 'MTF_') {
                let ds = c.split('={');
                rnames.push(ds[0]);
            }
        }
        rnames.sort()

        let divI = document.createElement('a');
        divI.setAttribute('href','#MTF_@');
        divI.innerText = 'Save New Dataset'
        eID.appendChild(divI);

        let lc = getCookie('MT_LastFilter');
        if(lc) {
            let divI = document.createElement('a');
            divI.setAttribute('href','#MTF_#');
            divI.innerText = 'Update as "' + lc.substring(4) + '"';
            eID.appendChild(divI);
            divI = document.createElement('a');
            divI.setAttribute('href','#MTF_$');
            divI.innerText = 'Delete "' + lc.substring(4) + '"';
            eID.appendChild(divI);
        }
        divI = document.createElement('div');
        divI.innerText = '|';
        eID.appendChild(divI);

        for (var i = 0; i < rnames.length; i++) {
            let divI = document.createElement('a');
            divI.setAttribute('href','#' + rnames[i]);
            divI.innerText = rnames[i].substring(4);
            eID.appendChild(divI);
        }
        r_FilterD = true;
    } else {r_FilterD = false};
}

function MenuFilter_Save(cn) {

    let NewReport = cn;
    if(NewReport == '') {
        NewReport = window.prompt('Name of Dataset');
    } else {
        NewReport = NewReport.substring(4)
    }

    if(NewReport != null && NewReport != "") {
        NewReport = NewReport.trim()
        const storedStr = localStorage.getItem('persist:reports');
        setCookie('MTF_' + NewReport, storedStr);
        setCookie('MT_LastFilter', 'MTF_' + NewReport);
        alert('Filter Saved as "' + NewReport + '"');
    }
}

function MenuFilter_Restore(cn) {

    const storedStr = getCookie(cn);
    localStorage.setItem("persist:reports", storedStr);
    setCookie('MT_LastFilter', cn, true);
    window.location.assign(SaveLocationPathName);

}

function MenuDisplay(OnFocus) {

    if (SaveLocationPathName.substring(0,17) == '/settings/display') {
        if(OnFocus == false) {

        }
        if(OnFocus == true) {
            MM_CreateCheckbox('Hide Create Rule Tooltip','MT_HideToaster');
            MM_CreateCheckbox('Hide Report Tooltip Difference','MT_HideTipDiff');
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
   if(qs != null) {
       let e1 = document.createElement('div');
       e1.style = "font-size: 14px; margin: 9px;";
       qs.after(e1);

       let OldValue = getCookie(inCookie);
       let e2 = document.createElement('input');
       e2.type = 'checkbox';
       e2.style = "position: relative;width: 20px;height: 20px;min-width: 20px; margin:9px;";
       if(OldValue == 1) {e2.checked = 'checked'};
       e1.appendChild(e2);
       e2.addEventListener('click', () => {
           MM_FlipCookie(inCookie);
       });
       var text = document.createTextNode(inValue);
       e2.parentNode.insertBefore(text, e2.nextSibling)
   }

}

function MM_FlipCookie(inCookie) {

    let OldValue = getCookie(inCookie);
    if(OldValue == 1) { OldValue = 0 } else {OldValue = 1};
    setCookie(inCookie,OldValue);
    r_Init = false;
}

function deleteCookie(cName) {

    document.cookie = cName + "= ;expires=31 Dec 2000 23:59:59 GMT; path=/" ;

 }

function setCookie(cName, cValue) {

   document.cookie = cName + "=" + cValue + ";expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/" ;

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
            MM_Init();
            r_Init = true;
        }

        if(window.location.pathname != SaveLocationPathName) {
            // Lose Focus on a page
            MenuReports(false);
            MenuDisplay(false);

            SaveLocationPathName = window.location.pathname;

            // Gain Focus on a Page
            MenuReports(true);
            MenuDisplay(true);
        }

        MenuReports(2);

        if(r_Toaster == 1) {
            MM_removeElement('div.Toast__Root-sc-1mbc5m5-0',1);
        }
    },50);
}());
