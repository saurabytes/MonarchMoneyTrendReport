// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Monarch Tweaks
// @author       Robert P
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// @grant        GM_addStyle
// @grant        GM_info
// ==/UserScript==

const css_currency = 'USD';
const graphql = 'https://api.monarchmoney.com/graphql';
const pending = 2;

let r_Init = false;
let r_TipsActive = 0;
let r_ToasterActive = 0;
let r_DatePickerActive = false;
let r_PlanGridActive = false;
let r_Filter = 0;
let r_FilterD = false;
let r_spawn = 0;
let r_eventListener = false;
let r_oo = null;
let r_oo2 = null;
let r_ooPO = null;
let r_ooPl = null;
let r_ooPl2 = null;
let r_PlanYear = '';
let accountGroups = [];
let SaveLocationHRefName = "";
let SaveLocationPathName = "";

let DebugForecast = false;

function MM_Init() {

    let a1 = 'background-color: rgb(13, 44, 92); color: #FFFFFF;';
    let a2 = 'background-color: #14457a; color: #FFFFFF;';
    if(getStyle() == 'light') {
        a1 = 'background-color: #ffffff; color: rgb(8, 40, 100);';
        a2 = 'background-color: #eaf6fd; color: rgb(61, 146, 222);';
    }

    GM_addStyle('.MTPlanHeader {font-weight: 900; align-content: inherit; padding: 0px 0px 15px; }');
    GM_addStyle('.MTPlanDetail {color: rgb(72, 157, 140);font-size: 16px; font-weight: 500;}');

    GM_addStyle('.MTlink {background-color: transparent; color: rgb(50, 170, 240); font-weight: 500; font-size: 14px; cursor: pointer; border-radius: 4px;  border-style: none; padding: 15px 1px 1px 16px; display:inline-block;}');
    GM_addStyle('.MTlink2 {background-color: transparent; font-size: 14px; font-weight: 500; padding: 0px 0px 0px 16px;}');

    GM_addStyle('.MTCheckboxClass {width: 20px; height: 20px; border-color: rgb(228, 233, 240); border-radius: 4px; border-style: solid; border-width: 1px;}');
    GM_addStyle('.dropbtn {' + a1 + '; border: none; cursor: pointer;}');
    GM_addStyle('.dropbtn:hover, .dropbtn:focus {' + a2 + '}');
    GM_addStyle('.dropdown {float: right;  position: relative; display: inline-block; font-weight: 200;}');
    GM_addStyle('.dropdown-content div {font-size: 0px; line-height: 2px; background-color: #ff7369;}');
    GM_addStyle('.dropdown-content {' + a1 + ';display:none; position: absolute; min-width: 300px; overflow: auto; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px; right: 0; z-index: 1;}');
    GM_addStyle('.dropdown-content a {' + a1 + ';font-size: 15px; padding: 10px 10px; display: block;}');
    GM_addStyle('.dropdown a:hover {' + a2 + ' }');
    GM_addStyle('.show {display: block;}');

    GM_addStyle('.Toast__Root-sc-1mbc5m5-0 {display: ' + getDisplay(getCookie("MT_HideToaster")) + ';}');
    GM_addStyle('.ReportsTooltipRow__Diff-k9pa1b-3 {display: ' + getDisplay(getCookie("MT_HideTipDiff")) + ';}');
    GM_addStyle('.AccountNetWorthCharts__Root-sc-14tj3z2-0 {display: ' + getDisplay(getCookie("MT_HideAccountsGraph")) + ';}');

    if(getCookie('MT_PlanCompressed') == 1) {
        GM_addStyle('.sTiBE {height: 69px;}');
        GM_addStyle('.jWyZIM {height: 45px;}');
        GM_addStyle('.fAcQtX {margin-bottom: 2px;}');
    }

    if(getCookie('MT_PendingIsRed') == 1) {
        GM_addStyle('.cxLoFP {color:red;}');
    }

    if(getCookie('MT_CompressedTx') == 1) {
        GM_addStyle('.dHdtJt {font-size: 14px;}');
        GM_addStyle('.hDZmpo {font-size: 14px;}');
        GM_addStyle('.dnAUzj {font-size: 14px; padding: 2px;}');
        GM_addStyle('.kphLtI {height: 28px;}');
    }

    MM_hideElement("[href~='/settings/referrals']",getCookie('MT_Ads'));
    MM_hideElement("[href~='/advice']",getCookie('MT_Advice'));
    MM_hideElement("[href~='/investments']",getCookie('MT_Investments'));
    MM_hideElement("[href~='/objectives']",getCookie('MT_Goals'));
    MM_hideElement("[href~='/recurring']",getCookie('MT_Recurring'));
    MM_hideElement("[href~='/plan']",getCookie('MT_Budget'));

    MM_SetupCallbacks();
}

function MM_hideElement(InList,InValue) {

    const elements = document.querySelectorAll(InList);
    for (const el of elements) {
        if(InValue == 1) {el.style.display = 'none'} else {el.style.display = ''};
    }
}

function MM_SetupCallbacks() {

    if(!r_oo2) {
        let useTarget=document.querySelector('body');
        if(useTarget != null) {
            const observer2 = new MutationObserver(MM_BodyCallback);
            const config = { attributes: true, childList: true, subtree: true, };
            observer2.observe(useTarget, config);
            r_oo2 = useTarget;
        }
    }
}

const MM_BodyCallback = (mutationList, observer2) => {

    // recalculate Budget
    if(r_PlanGridActive == pending) {
        if (r_PlanYear != '') {
            if(mutationList.length < 49) {
                if(DebugForecast == true) {console.log('MM_BodyCallback',mutationList.length);};
                r_PlanGridActive = true;
            }
        }
    }

    // Split 50/50
    if(r_oo2) {
        let text = r_oo2.lastChild.innerText;
        if(text) {
            if(text.startsWith('Split Transaction')) {
                MM_SplitTransaction()
            }
        }
    }
}

// ===[ Reports Menu ] ===
function MenuReports(OnFocus) {

    if (SaveLocationPathName.startsWith('/reports/')) {
        if(OnFocus == false) {
            let pn = window.location.pathname;
            if(pn.startsWith('/reports/') == false) {
                // leaving all reports
                r_oo = null;
            };
        };
       if(OnFocus == true) {
           MenuReportsDataset();
           MenuReportBreadcrumbListener();
           r_spawn = 1;
        }
    }
}

function MenuReportsDataset() {

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
                        fbr.textContent = ' Datasets ';
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
// ===[ Datasets Menu ] ===
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
            if(c.startsWith('MTF_')) {
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

// ===[ Calendar Fixes ] ===
function MM_FixCalendar(inValue) {

    if(r_oo == null) {

        let useTarget = findButton(inValue,'');

        if(useTarget != null) {
            const observer = new MutationObserver(MM_FixCalendarCallback);
            const config = { attributes: true, childList: true, subtree: true };
            observer.observe(useTarget, config);
            r_oo = useTarget;
        }
    }
}

function MM_FixCalendarYears() {

    const elements = document.querySelectorAll('select[name]');
    if(elements) {
        for (const li of elements) {
            if(li.getAttribute('hacked') != 'true') {
                if(li.name == 'year') {
                    MM_FixCalendarDropdown(li);
                    li.setAttribute('hacked','true');
                }
            }
        }
    }
}

function MM_FixCalendarDropdown(InList) {

    let ii = parseInt(getCookie("MT_LowCalendarYear"));
    if(ii < 2000) {ii = 2000};
    ii -= 2000;
    for (let i = 0; i < ii; i++) {
        InList.removeChild(InList.firstChild)
    }
}

const MM_FixCalendarCallback = (mutationList, observer) => {

    r_DatePickerActive = r_DatePickerActive? false : true

    if (r_DatePickerActive == true) {
        let li = document.querySelectorAll('div.DateRangePickerShortcuts__StyledMenuItem-jr6842-1');
        if(li[6]) {
            let useClass = li[0].className;

            let div = document.createElement('div');
            div.className = useClass;
            div.innerText = 'This quarter';
            let newli = li[5].nextSibling.after(div);
            div.addEventListener('click', () => {
                inputTwoFields('input.DateInput_input',getDates('ThisQTRs'),getDates('ThisQTRe'));
                let sb = findButton('','Apply');
                if(sb) {
                    focus(sb);
                    sb.click();
                };
            });
            div = document.createElement('div');
            div.className = useClass;
            div.innerText = 'Last year YTD';
            newli = li[5].nextSibling.after(div);
            div.addEventListener('click', () => {
                inputTwoFields('input.DateInput_input',getDates('LastYTDs'),getDates('LastYTDe'));
                let sb = findButton('','Apply');
                if(sb) {
                    focus(sb);
                    sb.click();
                };
            });
            div = document.createElement('div');
            div.className = useClass;
            div.innerText = 'Last 12 months';
            newli = li[5].nextSibling.after(div);
            div.addEventListener('click', () => {
                inputTwoFields('input.DateInput_input',getDates('12Mths'),getDates('Today'));
                let sb = findButton('','Apply');
                if(sb) {
                    focus(sb);
                    sb.click();
                };
            });
        }
    }
};

// ===[ Breadcrumbs ] =============================================================================
function MenuReportBreadcrumbListener() {

    if (SaveLocationPathName.endsWith('/income') || SaveLocationPathName.endsWith('/spending')) {
        if(r_eventListener == false) {
            if(getCookie("MT_ReportsDrilldown") == 1) {
                window.addEventListener("click", event => {
                    let cl = event.target.parentNode;
                    if(cl) {
                        const CheckLegend = cl.attributes[0].value;
                        if(CheckLegend) {
                            if(CheckLegend.includes("PieChartWithLegend") == true) {
                                const parentAsearch = cl.parentNode.parentNode.search;
                                r_spawn = -1;
                                event.stopImmediatePropagation();
                                event.stopPropagation();
                                event.preventDefault();
                                MenuReportBreadcrumbGo(parentAsearch);
                            };
                        }
                    }
                }, true);
                r_eventListener = true;
            }
        }
        BuildCategoryGroups();
    }
}

function MenuReportBreadcrumbGo(Parms) {

    let bcl = '';
    let groupId = '';
    let groupName = '';
    let catName = '';

    if(Parms) {
        const params = new URLSearchParams(Parms);
        const categorygroups = params.get('categoryGroups');
        const categories = params.get('categories');

        if(categories || categorygroups) {
            let storedStr = localStorage.getItem('persist:reports');
            let x = storedStr.indexOf('}",')
            if(x > 0) {

                // Remove current categories
                let newStoredStr = removeAllEncompass(storedStr,',\"categories\":','\"]');

                newStoredStr = newStoredStr.substring(0,x) + ',\\"categories\\":[';

                if(categorygroups) {
                    for (let i = 0; i < accountGroups.length; i++) {
                        if(accountGroups[i].GROUP == categorygroups) {
                            if(bcl == '1') { newStoredStr = newStoredStr + ','};
                            bcl = '1';
                            newStoredStr = newStoredStr + '\\"' + accountGroups[i].ID + '\\"';
                            groupName = accountGroups[i].GROUPNAME;
                            groupId = accountGroups[i].GROUP;
                        };
                    }
                } else
                {
                    newStoredStr = newStoredStr + '\\"' + categories + '\\"';
                    bcl = '2';
                    [groupId,groupName,catName] = GetCategoryGroup(categories);
                }

                newStoredStr = newStoredStr + ']' + storedStr.substring(x);
                newStoredStr = newStoredStr.replace('"category_group','"category');

                localStorage.setItem("persist:reports", newStoredStr);
                localStorage.setItem("persist:breadcrumb",groupId + '/:/' + groupName + '/:/' + bcl + '/:/' + catName );

                // Redirect back to page
                window.location.replace(SaveLocationPathName);
            }
        }
    }

    if(r_spawn > -1) {
        let x = document.querySelector('div.ReportsPieChart__Root-a4nd0f-0');
        if(x) {
            let groupStoredStr = localStorage.getItem('persist:breadcrumb');
            if(groupStoredStr) {
                let GroupStuff = groupStoredStr.split('/:/');
                groupId = GroupStuff[0];
                groupName = GroupStuff[1];
                bcl = GroupStuff[2];
                catName = GroupStuff[3];
            }

            if(groupId) {
                if(bcl == '2') {
                    let bc = document.createElement('button');
                    bc.className = 'MTlink';
                    bc.innerText = groupName + ' »';
                    x.prepend(bc);
                    bc.addEventListener('click', () => {
                        window.location.replace(SaveLocationPathName + '?categoryGroups=' + groupId);
                    });
                } else
                {
                    let bc = document.createElement('span');
                    bc.className = 'MTlink2';
                    bc.innerText = '/ ' + groupName;
                    x.prepend(bc);
                }
            }

            let bc3 = document.createElement('button');
            bc3.className = 'MTlink';
            bc3.innerText = 'Clear Categories »';
            x.prepend(bc3);
            bc3.addEventListener('click', () => {
                let storedStr = localStorage.getItem('persist:reports');
                let newStoredStr = removeAllEncompass(storedStr,',\\"categories\\":','\"]');
                newStoredStr = newStoredStr.replace('"\\"category\\""','"\\"category_group\\""');
                localStorage.setItem('persist:reports',newStoredStr);
                localStorage.removeItem('persist:breadcrumb');
                window.location.replace(SaveLocationPathName);
            });
        }
    }
}

function removeAllEncompass(InValue,InStart,InEnd) {

    let result = InValue;
    if(InValue != null) {
        let a = InValue.indexOf(InStart);
        if(a > 0) {
            let b = InValue.indexOf(InEnd,a+1);
            if(b > a) {
                b = b + InEnd.length;
                result = InValue.substring(0, a) + InValue.substring(b);
            }
        }
    }
    return result;
}

// ===[ Splits ] ======================================
function MM_SplitTransaction() {

    let li = document.querySelector('[class*="TransactionSplitOriginalTransactionContainer__Amount"]')
    if(li) {
        if(li.getAttribute('hacked') != 'true') {
            li.setAttribute('hacked','true');
            let AmtStr = li.innerText.replace("$","");
            AmtStr = AmtStr.replace(/,/g,"");
            let AmtA = parseFloat(AmtStr).toFixed(2)
            li = document.querySelectorAll('[class*="TransactionSplitModal__SplitSectionHeader"]');
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
                let sb = findButton('','');
                if(sb) {
                    div2.className = sb.className;
                }
                div2.innerText = 'Split 50/50  (' + Splitby2 + ') ';
                div2.addEventListener('click', () => {
                    inputTwoFields('input.CurrencyInput__Input-ay6xtd-0',AmtA,AmtB);
                });
                div.appendChild(div2);
            }
        }
    }
}

function MenuTransactions(OnFocus) {

    if (SaveLocationPathName.startsWith('/transactions')) {
        if(OnFocus == false) {
            r_oo = null;
        }
        if(OnFocus == true) {
            r_spawn = 1;
        }
    }
}

function MenuLogin(OnFocus) {

    if (SaveLocationPathName.startsWith('/login')) {
        if(OnFocus == false) {
            MM_Init();
        }
    }
}

function MenuDisplay(OnFocus) {

    if (SaveLocationPathName.startsWith('/settings/display')) {
        if(OnFocus == false) {
            // reload defaults
            r_Init = false;
        }
        if(OnFocus == true) {
            MenuDisplay_Input(GM_info.script.name + ' - ' + GM_info.script.version,'','header');
            MenuDisplay_Input('Lowest Calendar year','MT_LowCalendarYear','number');
            MenuDisplay_Input('Menu - Hide Budget','MT_Budget','checkbox');
            MenuDisplay_Input('Menu - Hide Recurring','MT_Recurring','checkbox');
            MenuDisplay_Input('Menu - Hide Goals','MT_Goals','checkbox');
            MenuDisplay_Input('Menu - Hide Investments','MT_Investments','checkbox');
            MenuDisplay_Input('Menu - Hide Advice','MT_Advice','checkbox');
            MenuDisplay_Input('Menu - Hide Monarch Ads','MT_Ads','checkbox');
            MenuDisplay_Input('General - Calendar "Last year" and "Last 12 months" include full month','MT_CalendarEOM','checkbox');
            MenuDisplay_Input('Accounts - Hide Accounts Net Worth Graph panel','MT_HideAccountsGraph','checkbox');
            MenuDisplay_Input('Transactions - Transactions panel has smaller compressed grid (Requires refresh page)','MT_CompressedTx','checkbox');
            MenuDisplay_Input('Transactions - Show Pending Transactions in red (Allow Pending Edits must be disabled)','MT_PendingIsRed','checkbox');
            MenuDisplay_Input('Transactions - Hide Create Rule pop-up','MT_HideToaster','checkbox');
            MenuDisplay_Input('Reports - Add Drill-Down functionality to Reports Income/Spending','MT_ReportsDrilldown','checkbox');
            MenuDisplay_Input('Reports - Hide Chart Tooltip difference amount','MT_HideTipDiff','checkbox');
            MenuDisplay_Input('Budget - Add YTD Total & Projected to Forecast Monthly & Export','MT_PlanYTD','checkbox');
            MenuDisplay_Input('Budget - Panel has smaller compressed grid (Requires refresh page)','MT_PlanCompressed','checkbox');
        }
    }
}

function MenuDisplay_Input(inValue,inCookie,inType) {

    let qs = document.querySelector('.SettingsCard__Placeholder-sc-189f681-2');
    if(qs != null) {
        qs = qs.firstChild.lastChild;
        let e1 = document.createElement('div');
        if(inType == 'header') {
            e1.innerText = inValue;
            let x = document.querySelector('div.CardHeader__Root-r0eoe3-0');
            if(x){
                e1.className = x.className
            }
            e1.style = 'font-size: 18px; font-weight: 500; display: inline-block';
        } else {
            e1.style = 'margin: 11px 25px;';
        }
        qs.after(e1);
        let e2 = null;
        let e3 = null;

        let OldValue = getCookie(inCookie);

        const d = new Date();
        let year = d.getFullYear();

        switch(inType) {
            case 'checkbox':
                e2 = document.createElement('input');
                e2.type = inType;
                e2.className = 'MTCheckboxClass';
                if(OldValue == 1) {e2.checked = 'checked'};
                e1.appendChild(e2);
                e2.addEventListener('change', () => {
                    flipCookie(inCookie);
                });
                e3 = document.createTextNode('  ' + inValue);
                e2.parentNode.insertBefore(e3, e2.nextSibling)
                break;
            case 'number':
                e3 = document.createElement("div");
                e3.innerText = inValue;
                e3.style = 'font-size: 14px; font-weight: 500;';
                e1.appendChild(e3);

                e2 = document.createElement('input');
                e2.type = inType;
                e2.min = 2000;
                e2.max = year;
                e2.value = OldValue;
                e2.style = 'font-size: 16px; padding: 5px 5px;';
                e1.appendChild(e2);
                e2.addEventListener('change', () => {
                    setCookie(inCookie,e2.value);
                });
                break;
        }
    }
}
// ===== [ Plan & Budget ] ============================
function MenuPlan(OnFocus) {

    if (SaveLocationPathName.startsWith('/plan')) {
        if(getCookie("MT_PlanYTD") == 1) {
            if(OnFocus == false) {
                r_PlanGridActive = false;
                if(r_ooPl) {
                    r_ooPl.remove();
                    r_ooPl = null;
                }
                if(r_ooPl2) {
                    r_ooPl2.remove();
                    r_ooPl2 = null;
                }
            }
            if(OnFocus == true) {
                r_PlanGridActive = true;
            }
        }
    }
}

function MenuPlanUpdate() {

    // Getting Setting button of Plan container
    let hed = document.querySelector('[class*="PlanHeaderControls__SettingsButton"]');
    if(!hed) {
        r_PlanYear = '';
        r_PlanGridActive = pending;
        return;
    }

    // Create buttons if needed
    if(r_ooPl == null) {
        let hed2 = document.querySelector('[class*="PlanHeaderControls__Root"]');
        if(hed2) {

            r_ooPl = document.createElement('button');
            r_ooPl.className = "MT_PlanRecalc " + hed.className;
            r_ooPl.textContent = 'Recalculate';
            r_ooPl.style = 'display: ' + getDisplay(1)
            hed2.prepend(r_ooPl);
            r_ooPl.addEventListener('click', () => {
                r_PlanGridActive = true;
            });

            let divI = document.createElement('div');
            divI.setAttribute('class','PlanHeaderControls__Divider cwyGMK');
            hed2.prepend(divI);

            r_ooPl2 = document.createElement('button');
            r_ooPl2.className = "MT_PlanExport " + hed.className;
            r_ooPl2.textContent = 'Export';
            r_ooPl2.style = 'display: ' + getDisplay(1)
            hed2.prepend(r_ooPl2);
            r_ooPl2.addEventListener('click', () => {
                MenuPlanExport();
            });
        }
    }

    if(getCookie("MT_Goals") == 1) {
        let div = document.querySelectorAll('[class*="PlanSectionHeader__Root"]');
        if(div.length > 2) {
            div[2].style = 'display: ' + getDisplay(1);
            div = div[2].nextSibling;
            div.style = 'display: ' + getDisplay(1);
            div = div.nextSibling;
            div.style = 'display: ' + getDisplay(1);
        }
    }

    // turn off buttons (assume off)
    if(r_ooPl) {r_ooPl.style = 'display: ' + getDisplay(1)};
    if(r_ooPl2) {r_ooPl2.style = 'display: ' + getDisplay(1)};

    // remove all tweaked columns
    const headers = document.querySelectorAll('.MTPlanHeader');
    const details = document.querySelectorAll('.MTPlanDetail');
    headers.forEach(header => header.remove());
    details.forEach(detail => detail.remove());

    // check if forecasting year
    hed = document.querySelector('[class*="PlanHeader__Container"]');
    if(!hed) {
        r_PlanYear = '';
        r_PlanGridActive = pending;
        return;
    }

    // get current page year
    r_PlanYear = hed.innerText.substring(0,4);
    if(hed.innerText[5] == '-') {
        r_PlanGridActive = pending;
        r_PlanYear = '';
        return;
    }

    // wait till a full page load
    let elements = document.querySelectorAll('[class*="PlanSectionFooter__Title"]');
    if(elements == null || elements.length < 4) {
        r_PlanYear = '';
        r_PlanGridActive = true;
        return;
    }

    if(r_ooPl2) {r_ooPl2.style = 'display: ' + getDisplay(0)};

    // only tweak this year's forecast
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    if(year.toString() != r_PlanYear) {
        r_PlanGridActive = pending;
        r_PlanYear = '';
        return;
    }

    if(DebugForecast == true) {console.log('MenuPlanUpdate',month,r_PlanYear,elements.length,r_PlanGridActive);};

    if(month > 0) {
        // insert header
        month-=1;
        let currentPeriod = getMonthName(month,true) + ' ' + year;
        let elements = document.querySelectorAll('[class*="PlanGrid__PlanGridColumn"]');

        for (let el of elements) {
            if(el.innerText == currentPeriod) {
                let clonedNode = el.cloneNode(true);
                clonedNode.innerText = 'Total YTD';
                clonedNode.className = clonedNode.className + ' MTPlanHeader';
                el.insertAdjacentElement('afterend', clonedNode);
            }
            if(el.innerText == 'Dec ' + year) {
                let clonedNode = el.cloneNode(true);
                clonedNode.innerText = 'Projected';
                clonedNode.className = clonedNode.className + ' MTPlanHeader';
                el.insertAdjacentElement('afterend', clonedNode);
            }
        }

        // add data
        let pivotCount = 0;

        var cellValue = 0;
        var rowValue = 0;
        let useValue = '';
        let JanValue = '';
        let clonedNodeYTD = null;
        let clonedNodeProj = null;

        month+=1;

        elements = document.querySelectorAll('[class*="PlanGrid__PlanGridColumn"]');
        if(elements) {
        }

        for (let el of elements) {

            useValue = el.innerText;
            if(!useValue) {
                if(el.lastChild != null) {
                    let x = el.lastChild.childNodes[0];
                    if(x) {
                        useValue = x.defaultValue;
                    }
                }
            }

            if(useValue.startsWith('$') || useValue.startsWith('-') || useValue == '') {

                cellValue = getCleanValue(useValue);
                pivotCount+=1;

                // check totals finished
                if(pivotCount == 1) {
                    JanValue = useValue;
                }
                if(pivotCount == month) {
                    if(useValue.startsWith('$') && JanValue == '-') {
                        if(DebugForecast == true) {console.log('MenuPlanUpdate','Waiting',JanValue,useValue);};
                        r_PlanGridActive = pending;
                        return;
                    }
                }

                rowValue += cellValue;
                 if(DebugForecast == true) {console.log('MenuPlanUpdate',pivotCount,useValue);};

                // clone first column
                if(pivotCount == 1) {
                    clonedNodeYTD = el.cloneNode(true);
                    clonedNodeYTD.className = clonedNodeYTD.className + ' MTPlanDetail';
                    clonedNodeProj = el.cloneNode(true);
                    clonedNodeProj.className = clonedNodeProj.className + ' MTPlanDetail';
                };

                if(pivotCount == month) {
                    if(isNaN(rowValue)) {
                        clonedNodeYTD.innerText = '-';
                    } else {
                        clonedNodeYTD.innerText = rowValue.toLocaleString("en-US", {style:"currency", currency:css_currency});
                    };
                    el.insertAdjacentElement('afterend', clonedNodeYTD);
                };

                if(pivotCount == 12) {
                    if(isNaN(rowValue)) {
                        clonedNodeProj.innerText = '-';
                    } else {
                        clonedNodeProj.innerText = rowValue.toLocaleString("en-US", {style:"currency", currency:css_currency});
                    };
                    el.insertAdjacentElement('afterend', clonedNodeProj);
                    pivotCount = 0;
                    rowValue = 0;
                };
            } else {if(DebugForecast == true) {console.log('MenuPlanUpdate Skip',pivotCount,useValue);};};
        }
    }

    if(r_ooPl) {r_ooPl.style = 'display: ' + getDisplay(0)};
    if(r_ooPl2) {r_ooPl2.style = 'display: ' + getDisplay(0)};

    r_PlanGridActive = pending;
 }

function MenuPlanExport(Year) {

    const CRLF = String.fromCharCode(13,10);

    const spans = document.querySelectorAll('[class*="PlanRowTitle__Title"]');
    const data = [];
    const spans2 = document.querySelectorAll('[class*="PlanCellAmount"], [class*="PlanCell__Amount"]');
    const data2 = [];

    let useValue = '';
    var i = 0;
    var ii = 0;
    var iir = 0;
    let FullRow = r_PlanYear;

    // Headers
    spans.forEach(span => {
        if(span.firstChild.title || span.innerText.startsWith('Show ') || span.innerText.startsWith('Collapse ')) {
           // hide data
        } else
        {
            data.push(span.innerText);
        }
    });

    // Cell Amounts
    const storedStyle = spans2[0].className;
    spans2.forEach(span => {
        i+=1;
        if(ii > 0 || (i == 1 && span.className == storedStyle)) {
            ii+=1;
            if(span.value) {
                useValue = span.value;
            }
            else
            {
                useValue = span.innerText;
            }
            useValue = getCleanValue(useValue);
            data2.push(useValue);
        }
        if(i == 12) {
            i =0 ;
            ii = 0;
        }
    });

    for (i = 0; i < 12; i++) {
        FullRow = FullRow + ',' + getMonthName(i,true);
    }

    let csvContent = FullRow + CRLF;

    for (i = 0; i < data2.length; i++) {
        if(iir == 0) {
            if(data[ii] == 'Goals') {
                break;
            };
            FullRow = '"' + data[ii] + '"' ;
            ii+=1;
        }

        iir+=1;
        FullRow = FullRow + ',' + data2[i];

        if(iir == 12) {
            iir = 0;
           csvContent = csvContent + FullRow + CRLF;
        }
    };

    downloadFile('Forecast Plan',csvContent);

}

function MenuCheckSpawnProcess() {

    if(r_DatePickerActive == true) {
        MM_FixCalendarYears();
    }

    switch (r_PlanGridActive) {
        case true:
            MenuPlanUpdate();
            break;
        case pending:
            if(SaveLocationHRefName != window.location.href) {
                // reload plan
                SaveLocationHRefName = window.location.href;
                r_PlanGridActive = true;
            }
            break;
    }

    if(r_spawn > 0) {
        r_spawn+=1;
        if(r_spawn > 3) {
            r_spawn = 0;
            MenuReportBreadcrumbGo(window.location.search);
            MM_FixCalendar('');
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


function inputTwoFields(InSelector,InValue1,InValue2) {

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

function getCleanValue(inValue) {

    if(inValue) {

        let AmtStr = inValue.replace(/[$,]+/g,"");;
        let Amt = parseInt(AmtStr);
        return Amt;

    } else {return null};
}

function getMonthName(inValue,inShort) {

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if(inShort == true) {
        return months[inValue].substring(0,3);
    } else
    {
        return months[inValue];
    }
}

function getDates(InValue) {

    let d = new Date();
    let month = d.getMonth();
    let day = 1;
    let year = d.getFullYear();

    if(InValue == 'LastYTDs') {
        year-=1;
        month = 0;
    }
    if(InValue == 'Today') {
        day = d.getDate();
    }
    if(InValue == '12Mths') {
        year-=1;
        if(getCookie('MT_CalendarEOM') == 1) {
            day = 1;
        } else {day = d.getDate();}
    }
    if(InValue == 'LastYTDe') {
        year-=1;
        if(getCookie('MT_CalendarEOM') == 1) {
            day = daysInMonth(month,year);
        }
    }
    if(InValue == 'ThisQTRs') {
        if(month < 3) {month = 0};
        if(month == 4 || month == 5) {month = 3};
        if(month == 7 || month == 8) {month = 6};
        if(month == 10 || month == 11) {month = 9};
    }
    if(InValue == 'ThisQTRe') {
        if(month < 2) {month = 2};
        if(month == 3 || month == 4) {month = 5};
        if(month == 6 || month == 7) {month = 8};
        if(month == 9 || month == 10) {month = 11};
        day = daysInMonth(month,year);
     }
    month+=1;
    let FullDate = ("0" + month).slice(-2) + '/' + ("0" + day).slice(-2) + '/' + year;
    return(FullDate);

    function daysInMonth(iMonth, iYear) {
        return 32 - new Date(iYear, iMonth, 32).getDate();
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

function findButton(inValue,inName) {

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

function getStyle() {

  const cssObj = window.getComputedStyle(document.querySelectorAll('[class*=Page__Root]')[0], null);
  const bgColor = cssObj.getPropertyValue('background-color');
  if (bgColor === 'rgb(8, 32, 67)') { return 'dark'; } else {return 'light'};

}

function getDisplay(InA) {
    if(InA == 1) {return 'none;'} else {return 'block;'};
}

function downloadFile(inTitle,inData) {

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + inData);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', inTitle + '.csv');
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

(function() {

    setInterval(() => {

        if(r_spawn > -1) {
            if(r_Init == false) {
                MM_Init();
                r_Init = true;
            }

            if(window.location.pathname != SaveLocationPathName) {

                // Lose Focus on a page
                if(SaveLocationPathName) {
                    MenuLogin(false);
                    MenuReports(false);
                    MenuDisplay(false);
                    MenuTransactions(false);
                    MenuPlan(false)
                };

                SaveLocationPathName = window.location.pathname;
                SaveLocationHRefName = window.location.href;

                // Gain Focus on a Page
                MenuReports(true);
                MenuDisplay(true);
                MenuTransactions(true);
                MenuPlan(true);
            };

            MenuCheckSpawnProcess();
        }

    },500);
}());

function getGraphqlToken() {
  return JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).token;
}

function callGraphQL(data) {
  return {
    mode: 'cors',
    method: 'POST',
    headers: {
      accept: '*/*',
      authorization: `Token ${getGraphqlToken()}`,
      'content-type': 'application/json',
      origin: 'https://app.monarchmoney.com',
    },
    body: JSON.stringify(data),
  };
}

async function getCategoryData() {
  const options = callGraphQL({
    operationName: 'GetCategorySelectOptions',
    variables: {},
      query: "query GetCategorySelectOptions {\n  categoryGroups {\n    id\n    name\n    type\n    categories {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n  categories {\n    id\n    name\n    order\n    icon\n    group {\n      id\n      name\n    }\n  }\n}"
    });

  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    }).catch((error) => {
      console.error(error);
    });
}

async function BuildCategoryGroups() {

    if(accountGroups.length == 0) {
        const categoryData = await getCategoryData();
        for (let i = 0; i < categoryData.categories.length; i += 1) {
            accountGroups.push({"GROUP": categoryData.categories[i].group.id, "GROUPNAME": categoryData.categories[i].group.name, "ID": categoryData.categories[i].id, "NAME": categoryData.categories[i].name});
        }
    }
}

function GetCategoryGroup(InId) {

  for (let i = 0; i < accountGroups.length; i++) {
      if(accountGroups[i].ID == InId) {
          return [accountGroups[i].GROUP,accountGroups[i].GROUPNAME,accountGroups[i].NAME];
      }
  }

    return [null,null,null];
}
