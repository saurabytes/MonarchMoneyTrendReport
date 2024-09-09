// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.06
// @description  Monarch Tweaks
// @author       Robert
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// @grant        GM_addStyle
// ==/UserScript==

let r_Init = false;
let r_TipsActive = 0;
let r_ToasterActive = 0;
let r_DatePickerActive = false;
let r_Filter = 0, r_FilterD = false;
let r_oo = null;
let r_oo2 = null;
const css_currency = 'USD';

let SaveLocationPathName = "";

function MM_Init() {

    let a1 = 'background-color: rgb(13, 44, 92); color: #FFFFFF;';
    let a2 = 'background-color: #14457a; color: #FFFFFF;';
    if(getStyle() == 'light') {
        a1 = 'background-color: #ffffff; color: rgb(8, 40, 100);';
        a2 = 'background-color: #eaf6fd; color: rgb(61, 146, 222);';
    }

    GM_addStyle('.dropbtn {' + a1 + '; border: none; cursor: pointer;}');
    GM_addStyle('.dropbtn:hover, .dropbtn:focus {' + a2 + '}');
    GM_addStyle('.dropdown {float: right;  position: relative; display: inline-block; font-weight: 200;}');
    GM_addStyle('.dropdown-content div {font-size: 0px; line-height: 2px; background-color: #ff7369;}');
    GM_addStyle('.dropdown-content {' + a1 + ';display:none; position: absolute; min-width: 300px; overflow: auto; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px; right: 0; z-index: 1;}');
    GM_addStyle('.dropdown-content a {' + a1 + ';font-size: 15px; padding: 10px 10px; display: block;}');
    GM_addStyle('.dropdown a:hover {' + a2 + ' }');
    GM_addStyle('.show {display: block;}');

    GM_addStyle('.Toast__Root-sc-1mbc5m5-0 {display: ' + getDisplay(getCookie("MT_HideToaster")) + '};');
    GM_addStyle('.ReportsTooltipRow__Diff-k9pa1b-3 {display: ' + getDisplay(getCookie("MT_HideTipDiff")) + '};');

    MM_hideElement("[href~='/settings/referrals']",getCookie('MT_Ads'));
    MM_hideElement("[href~='/advice']",getCookie('MT_Advice'));
    MM_hideElement("[href~='/investments']",getCookie('MT_Investments'));
    MM_hideElement("[href~='/objectives']",getCookie('MT_Goals'));
    MM_hideElement("[href~='/recurring']",getCookie('MT_Recurring'));
    MM_hideElement("[href~='/plan']",getCookie('MT_Budget'));

    MM_FixPopupWindow();

}

function MM_removeElements(InList) {

    let ii = parseInt(getCookie("MT_LowCalendarYear"));
    if(ii < 2000) {ii = 2000};
    ii -= 2000;
    for (let i = 0; i < ii; i++) {
        InList.removeChild(InList.firstChild)
    }
}

function MM_hideElement(InList,InValue) {

    const elements = document.querySelectorAll(InList);
    for (const el of elements) {
        if(InValue == 1) {el.style.display = 'none'} else {el.style.display = ''};
    }
}

function MM_FixPopupWindow() {

    let useTarget=document.querySelector('body');
    if(useTarget != null) {
        const observer2 = new MutationObserver(callback2);
        const config = { attributes: false, childList: true, subtree: false };
        observer2.observe(useTarget, config);
        r_oo2 = useTarget;
    }
}

function MM_FixCalendar(inValue) {

    if(r_oo == null) {

        let useTarget = MM_FindButton(inValue,'');

        if(useTarget != null) {
            const observer = new MutationObserver(callback);
            const config = { attributes: true, childList: true, subtree: true };
            observer.observe(useTarget, config);
            r_oo = useTarget;
        }
    }
}

function MM_FindButton(inValue,inName) {

    let useTarget = null;
    let div=document.querySelectorAll('button');

    div.forEach((li)=> {
        if(useTarget == null) {
            if(inValue != '' && li.textContent.substring(0,1) == inValue) {
                useTarget = li;
            }
            if(inName != '' && inName == li.innerText) {
                useTarget = li;
            }
        }
    } );

    return useTarget;
}

const callback2 = (mutationList, observer2) => {

    let text = r_oo2.lastChild.innerText;
    if(text) {
        if(text.substring(0,17) == 'Split Transaction') {
            callBackSplit()
        }
    }
}

const callback = (mutationList, observer) => {

    r_DatePickerActive = r_DatePickerActive? false : true

    if (r_DatePickerActive == true) {
        let li = document.querySelectorAll('div.DateRangePickerShortcuts__StyledMenuItem-jr6842-1');
        if(li[6]) {
            let useClass = li[0].className;
            let div = document.createElement('div');
            div.className = useClass;
            div.innerText = 'Last year YTD';
            let newli = li[5].nextSibling.after(div);
            div.addEventListener('click', () => {
                MM_InputTwoFields('input.DateInput_input',getDates('LastYTDs'),getDates('LastYTDe'));
                let sb = MM_FindButton('','Apply');
                if(sb) {
                    focus(sb);
                    sb.click();} else
                    {console.log('MM Tweaks Error',sb)};
            });
        }
    }
};

function callBackSplit() {

    let li = document.querySelector('.TransactionSplitOriginalTransactionContainer__Amount-r53kdf-5')
    if(li) {
        if(li.getAttribute('hacked') != 'true') {
            li.setAttribute('hacked','true');
            let AmtStr = li.innerText.replace("$","");
            AmtStr = AmtStr.replace(/,/g,"");
            let AmtA = parseFloat(AmtStr).toFixed(2)
            li = document.querySelectorAll('.TransactionSplitModal__SplitSectionHeader-sc-1qu174z-3');
            if(li[1]) {
                let AmtB = AmtA / 2;
                AmtB = parseFloat(AmtB).toFixed(2)
                AmtA = AmtA - AmtB;
                AmtA = parseFloat(AmtA).toFixed(2)
                let Splitby2 = AmtA.toLocaleString("en-US", {style:"currency", currency:css_currency}) + ' / ' + AmtB.toLocaleString("en-US", {style:"currency", currency:css_currency});
                let div = document.createElement('div');
                div.style = "float: right;";
                li[1].appendChild(div);

                let div2 = document.createElement('button');
                let sb = MM_FindButton('','');
                if(sb) {
                    div2.className = sb.className;
                }
                div2.innerText = 'Split 50/50  (' + Splitby2 + ') ';
                div2.addEventListener('click', () => {
                    MM_InputTwoFields('input.CurrencyInput__Input-ay6xtd-0',AmtA,AmtB);
                });
                div.appendChild(div2);
            }
        }
    }
}

function MM_InputTwoFields(InSelector,InValue1,InValue2) {

    let x = document.querySelectorAll(InSelector);
    if(x[0]) {
        x[0].focus();
        x[0].value = '';
        document.execCommand('insertText', false, InValue1);
        if(x[1]) {
            x[1].focus();
            x[1].value = '';
            document.execCommand('insertText', false, InValue2);
        }
    }
}

function MM_FixCalendarYears() {

    const elements = document.querySelectorAll('select');
    if(elements) {
        for (const li of elements) {
            if(li.getAttribute('hacked') != 'true') {
                if(li.name == 'year') {
                    MM_removeElements(li);
                    li.setAttribute('hacked','true');
                }
            }
        }
    }
}

function MenuTransactions(OnFocus) {

    if (SaveLocationPathName.substring(0,13) == '/transactions') {
        if(OnFocus == false) {
            r_oo = null;
        }
        if(OnFocus == true) {
            sleep(2000);
            MM_FixCalendar('');
        }
    }
}

function MenuReports(OnFocus) {

    if (SaveLocationPathName.substring(0,9) == '/reports/') {
        if(OnFocus == false) {
            let pn = window.location.pathname;
            let pi = pn.search('/reports/');
            if(pi == -1) {
                // leaving all reports
                r_oo = null;
            } else {
                // leaving within reports
            };
        }
        if(OnFocus == true) {
            MenuReportsSetup();
            MM_FixCalendar('');
        }
    }
}

function MenuReportsSetup() {

    if(r_Filter == 0) {
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

        MenuFilter_AddItem(eID,'a','href','#MTF_@','Save New Dataset');
        let lc = getCookie('MT_LastFilter');
        if(lc) {
            MenuFilter_AddItem(eID,'a','href','#MTF_#','Update "' + lc.substring(4) + '"');
            MenuFilter_AddItem(eID,'a','href','#MTF_$','Delete "' + lc.substring(4) + '"');
        };
        MenuFilter_AddItem(eID,'div','','','|');
        for (var i = 0; i < rnames.length; i++) {
            MenuFilter_AddItem(eID,'a','href','#' + rnames[i],rnames[i].substring(4));
        }
        r_FilterD = true;
    } else
    {
        r_FilterD = false
    };
}

function MenuFilter_AddItem(p,a,b,c,d) {

    let divI = document.createElement(a);
    if(b) {divI.setAttribute(b,c)};
    if(d) {divI.innerText = d};
    p.appendChild(divI);
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
        setCookie('MTP_' + NewReport, SaveLocationPathName);
        setCookie('MT_LastFilter', 'MTF_' + NewReport);
        alert('Filter Saved as "' + NewReport + '"');
    }
}

function MenuFilter_Restore(cn) {

    const storedStr = getCookie(cn);
    localStorage.setItem("persist:reports", storedStr);
    setCookie('MT_LastFilter', cn);

    let PathCookie = cn.replace('MTF_','MTP_');
    SaveLocationPathName = getCookie(PathCookie);
    window.location.assign(SaveLocationPathName);

}

function MenuInstitutions(OnFocus) {

     if (SaveLocationPathName.substring(0,22) == '/settings/institutions') {
        if(OnFocus == false) {

        }
        if(OnFocus == true) {
            //MenuDisplay_Input('Run "Refresh All" once a day','MT_RefreshAll','checkbox');
        }
    }
}

function MenuDisplay(OnFocus) {

    if (SaveLocationPathName.substring(0,17) == '/settings/display') {
        if(OnFocus == false) {
            // reload defaults
            r_Init = false;
        }
        if(OnFocus == true) {
            MenuDisplay_Input('Lowest Calendar Year','MT_LowCalendarYear','number');
            MenuDisplay_Input('Hide Budget','MT_Budget','checkbox');
            MenuDisplay_Input('Hide Recurring','MT_Recurring','checkbox');
            MenuDisplay_Input('Hide Goals','MT_Goals','checkbox');
            MenuDisplay_Input('Hide Investments','MT_Investments','checkbox');
            MenuDisplay_Input('Hide Advice','MT_Advice','checkbox');
            MenuDisplay_Input('Hide Monarch Ads','MT_Ads','checkbox');
            MenuDisplay_Input('Hide Report Tooltip Difference','MT_HideTipDiff','checkbox');
            MenuDisplay_Input('Hide Create Rule Popup','MT_HideToaster','checkbox');
            MenuDisplay_Input('Calendar "Last year YTD" includes to end of month','MT_CalendarEOM','checkbox');
        }
    }
}

function MenuDisplay_Input(inValue,inCookie,inType) {

    let qs = document.querySelector('.SettingsCard__Placeholder-sc-189f681-2');
    if(qs != null) {
        qs = qs.firstChild.lastChild;
        let e1 = document.createElement('div');
        e1.style = 'margin: 13px 22px;';
        qs.after(e1);

        let OldValue = getCookie(inCookie);

        if(inType == 'checkbox') {
            let e2 = document.createElement('input');
            e2.type = inType;
            e2.style = "width: 20px; height: 20px;  margin: 5px 1px;"
            if(OldValue == 1) {e2.checked = 'checked'};
            e1.appendChild(e2);
            e2.addEventListener('click', () => {
                flipCookie(inCookie);
            });
            let e3 = document.createTextNode('  ' + inValue);
            e2.parentNode.insertBefore(e3, e2.nextSibling)
        } else {
            let e3 = document.createElement("div");
            e3.innerText = inValue;
            e3.style = 'margin: 5px 1px; font-weight: 500;';
            e1.appendChild(e3);

            let e2 = document.createElement('input');
            e2.type = inType;
            e2.style = "line-height: 30px; font-size: 15px; width: 90px; border-color: rgb(228, 233, 240); border-radius: 4px; border-style: solid; border-width: 1px;";
            const d = new Date();
            let year = d.getFullYear();
            e2.min = 2000;
            e2.max = year;
            e2.value = OldValue;
            e1.appendChild(e2);
            e2.addEventListener('click', () => {
                setCookie(inCookie,e2.value);
            });
        }
    }
}

window.onclick = function(event) {

    if(r_FilterD == true) {
        if (!event.target.matches('.MT_FilterRestore')) {
            document.getElementById("MTDropdown").classList.toggle("show");
            r_FilterD = false;
            const et = event.target.href;
            if(et) {
                let iMTF = et.search("#MTF_");
                if(iMTF > 0) {
                    let PathCookie = getCookie('MT_LastFilter');
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
                            deleteCookie(PathCookie);
                            PathCookie = PathCookie.replace('MTF_','MTP_');
                            deleteCookie(PathCookie);
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
}

function flipCookie(inCookie) {

    let OldValue = getCookie(inCookie);
    if(OldValue == 0) { OldValue = 1 } else { OldValue = 0};
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

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function getDates(InValue) {

    const d = new Date();
    let month = d.getMonth();
    let day = d.getDate();
    let year = d.getFullYear();

    if(getCookie('MT_CalendarEOM') == 1) {
        day = daysInMonth(month,year);
    }

    month+=1

    if(InValue == 'LastYTDs') {
        year-=1;
        let FullDate = '01/01/' + year;
        return(FullDate);
    }
    if(InValue == 'LastYTDe') {
        year-=1;
        let FullDate = ("0" + month).slice(-2) + '/' + ("0" + day).slice(-2) + '/' + year;
        if(getCookie('MT_CalendarEOM') == 1) {

            FullDate = ("0" + month).slice(-2) + '/' + ("0" + day).slice(-2) + '/' + year;
        }
        return(FullDate);
    }
}

function getStyle() {

  const cssObj = window.getComputedStyle(document.querySelectorAll('[class*=Page__Root]')[0], null);
  const bgColor = cssObj.getPropertyValue('background-color');
  if (bgColor === 'rgb(8, 32, 67)') { return 'dark'; } else {return 'light'};

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getDisplay(InA) {
    if(InA == 1) {return 'none;'} else {return 'block;'};
}

(function() {
    setInterval(() => {

        if(r_Init == false) {
            MM_Init();
            r_Init = true;
        }

        if(window.location.pathname != SaveLocationPathName) {
            // Lose Focus on a page
            if(SaveLocationPathName) {
                MenuReports(false);
                MenuDisplay(false);
                MenuTransactions(false);
                MenuInstitutions(false);
            }
            SaveLocationPathName = window.location.pathname;

            // Gain Focus on a Page
            MenuReports(true);
            MenuDisplay(true);
            MenuTransactions(true);
            MenuInstitutions(true);
        }

        if(r_DatePickerActive == true) {
            MM_FixCalendarYears();
        }

    },250);
}());
