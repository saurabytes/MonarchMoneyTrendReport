// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  Monarch Tweaks
// @author       Robert P
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// @grant        GM_addStyle
// @grant        GM_info
// ==/UserScript==

const css_currency = 'USD';
const pending = 2;
const graphql = 'https://api.monarchmoney.com/graphql';
const css_green = '#489d8c';
const css_red = '#ed5987;';
let css_bgColor = '';

let r_Init = false;
let r_DatePickerActive = false;
let r_PlanGridActive = false;
let r_TrendsActiveReady = false;
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
let TrendQueue = [];
let TrendQueueTitle = '';
let TrendQueueShortTitle = '';
let TrendQueueCol = [];
let TrendQueueByGroup = 0;
let TrendQueueByPeriod = 0;
let SaveLocationHRefName = '';
let SaveLocationPathName = '';

function MM_Init() {

    let a1 = 'background-color: rgb(13, 44, 92); color: #FFFFFF;';
    let a2 = 'background-color: #14457a; color: #FFFFFF;';
    if(getStyle() == 'light') {
        a1 = 'background-color: #ffffff; color: rgb(8, 40, 100);';
        a2 = 'background-color: #eaf6fd; color: rgb(61, 146, 222);';
    }

    GM_addStyle('.MTPlanHeader {font-weight: 900; align-content: inherit; padding: 0px 0px 15px;}');
    GM_addStyle('.MTPlanDetail {color: rgb(72, 157, 140);font-size: 16px; font-weight: 500;}');

    GM_addStyle('.MTlink {background-color: transparent; color: rgb(50, 170, 240); font-weight: 500; font-size: 14px; cursor: pointer; border-radius: 4px; border-style: none; padding: 15px 1px 1px 16px; display:inline-block;}');
    GM_addStyle('.MTlink2 {background-color: transparent; font-size: 14px; font-weight: 500; padding: 0px 0px 0px 16px;}');

    GM_addStyle('.MTTrendButtons {display: flex; gap: 20px;}');
    GM_addStyle('.MTCheckboxClass {width: 20px; height: 20px;}');
    GM_addStyle('.MTSpacerClass {padding: 5px 5px 5px 5px; border-bottom: 1px solid rgb(240, 244, 248);}');

    GM_addStyle('.MTTrendsContainer {display:block; padding-bottom: 0px;}');
    GM_addStyle('.MTFlexContainer {margin: 0px; gap: 20px; display: flex;}');
    GM_addStyle('.MTFlexContainerCard {padding: 30px; flex: 1 1 0%; display: flex; flex-flow: column; place-content: stretch flex-start; border-radius: 8px; background-color: '+ css_bgColor + ';}');
    GM_addStyle('.MTTrendBig {font-size: 18px; font-weight: 500; padding-top: 8px;}');
    GM_addStyle('.MTTrendSmall {font-size: 12px;font-weight: 600; padding-top: 8px; color: #919cb4; text-transform: uppercase; line-height: 150%; letter-spacing: 1.2px;}');

    GM_addStyle('.dropbtn {' + a1 + '; border: none; cursor: pointer;}');
    GM_addStyle('.dropbtn:hover, .dropbtn:focus {' + a2 + '}');
    GM_addStyle('.MTdropdown {float: right;  position: relative; display: inline-block; font-weight: 200;}');
    GM_addStyle('.MTdropdown-content div {font-size: 0px; line-height: 2px; background-color: #ff7369;}');
    GM_addStyle('.MTdropdown-content {' + a1 + ';display:none; position: absolute; min-width: 300px; overflow: auto; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px; right: 0; z-index: 1;}');
    GM_addStyle('.MTdropdown-content a {' + a1 + ';font-size: 15px; padding: 10px 10px; display: block;}');
    GM_addStyle('.MTdropdown a:hover {' + a2 + ' }');
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

    const els = document.querySelectorAll(InList);
    for (const el of els) {
        InValue == 1 ? el.style.display = 'none' : el.style.display = '';
    }
}

function MM_SetupCallbacks() {

    if(!r_oo2) {
        r_oo2 = document.body;
        if(r_oo2 != null) {
            const observer2 = new MutationObserver(MM_BodyCallback);
            const config = { attributes: true, childList: true, subtree: true, };
            observer2.observe(r_oo2, config);
        }
    }
}

const MM_BodyCallback = (mutationList, observer2) => {

    if(r_PlanGridActive == pending && r_PlanYear != '') {
        if(mutationList.length < 49) { r_PlanGridActive = true; }
    }

    if(r_oo2) {
        const text = r_oo2.lastChild.innerText;
        if(text) {
            if(text.startsWith('Split Transaction')) {
                MM_SplitTransaction();
            }
        }
    }
}

// [ Reports Menu ]
function MenuReports(OnFocus) {

    if (SaveLocationPathName.startsWith('/reports/')) {
        if(OnFocus == false) {
            const pn = window.location.pathname;
            if(pn.startsWith('/reports/') == false) {
                r_oo = null;
            };
        };
       if(OnFocus == true) {
           MenuReportsDataset();
           MenuReportBreadcrumbListener();
           MenuReportsTrends();
           r_spawn = 1;
        }
    }
}

function MenuReportsDataset() {

    const isFilter = document.querySelector('button.MT_FilterRestore')
    if(isFilter == null) {
        const elements=document.querySelectorAll('div.WithIndicatorContainer__Root-sc-1gqsonh-0');
        if(elements) {
            for (const li of elements) {
                if(li.innerText == '\uf11e\nFilters') {

                    const cn = li.childNodes[0].className;

                    const div = document.createElement('div');
                    div.className = 'MTdropdown';
                    li.after(div);

                    const fbr = document.createElement('button');
                    fbr.className = 'MT_FilterRestore ' + cn;
                    fbr.textContent = ' Datasets ';
                    div.appendChild(fbr);

                    const fb2 = document.createElement('div');
                    fb2.className = 'MTdropdown-content';
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

// [ Trends Menu ]
function MenuReportsTrends() {

    let r_TrendsActive = document.querySelector('a.MTTrendsMenu');
    if(!r_TrendsActive) {
        const div = document.querySelector('[class*="ReportsHeaderTabs__Root"]');
        if(div) {
            r_TrendsActive = cec('a','MTTrendsMenu ' + div.lastChild.className,div,'Trends','/reports/trends');
        };
    }

    if(SaveLocationPathName.endsWith('/reports/trends')) {
        r_TrendsActive.className = r_TrendsActive.className + ' tab-nav-item-active';
        MenuReportsTrendsPanels('display:none;');
        MenuReportsTrendsGo();
    } else {
        r_TrendsActive.className = r_TrendsActive.className.replace(' tab-nav-item-active','');
        removeAllSections('.MTTrendsContainer');
        MenuReportsTrendsPanels('');
    }
}

function MenuReportsTrendsPanels(inType) {

    let div = document.querySelector("div.MTdropdown");
    if(div) {div.parentNode.style=inType};
    div = document.querySelector('[class*="Grid__GridStyled-"]');
    if(div) {div.style=inType};
}

async function MenuReportsTrendsGo() {

    document.body.style.cursor = "wait";

    TrendQueueByGroup = getCookie('MTTrendGroup',true);
    TrendQueueByPeriod = getCookie('MTTrendPeriod',true);

    await BuildCategoryGroups();

    TrendQueue = [];

    let lowerDate = new Date();
    let higherDate = new Date();
    lowerDate.setDate(1);
    lowerDate.setMonth(0);

    // lower date
    let month = lowerDate.getMonth();
    let day = lowerDate.getDate();
    let year = lowerDate.getFullYear();

    // today
    let month2 = higherDate.getMonth();
    let day2 = higherDate.getDate();
    let year2 = higherDate.getFullYear();

    let TrendFullPeriod = getCookie('MT_TrendFullPeriod');

    TrendQueueTitle = getMonthName(month,true) + ' ' + day + ', ' + year + ' - ' + getMonthName(month2,true) + ' ' + day2 + ', ' + year2;

    // this year
    TrendQueueCol[4] = 'YTD ' + year;
    await BuildTrendData('cp',lowerDate,higherDate);

    // last year
    year-=1;
    lowerDate.setFullYear(year);
    higherDate.setFullYear(year);
    TrendQueueCol[3] = 'YTD ' + year;
    TrendQueueCol[5] = 'Difference';
    await BuildTrendData('lp',lowerDate,higherDate);

    // This Period
    TrendQueueCol[1] = '';
    year+=1;
    month = month2;
    lowerDate.setFullYear(year,month,1);
    higherDate.setFullYear(year2,month2,day2);

    if(TrendQueueByPeriod == 2) {
        const QtrDate = getDates('ThisQTRs');
        month = parseInt(QtrDate.substring(0,2)) - 1;
        lowerDate.setMonth(month);
        TrendQueueCol[1] = getMonthName(month,true) + ' - ';
    }

    TrendQueueCol[1] = TrendQueueCol[1] + getMonthName(month2,true) + ' ' + year;
    await BuildTrendData('cm',lowerDate,higherDate);

    // Last Period --------------
    TrendQueueCol[0] = '';
    if(TrendQueueByPeriod == 0) {
        month-=1;
        if(month < 0) {
            month = 11;
            year = year - 1;
        };
        month2 = month;
        year2 = year;
        lowerDate.setFullYear(year,month,1);
        higherDate.setFullYear(year2,month2,1);

        let x = daysInMonth(month,year);
        if(TrendFullPeriod == 1 || day2 > x) {
            day2 = x;
        }
        higherDate.setDate(day2);
        TrendQueueShortTitle = 'Last Month';
        TrendQueueCol[0] = getMonthName(month2,true) + ' ' + year;
    }
    if(TrendQueueByPeriod == 1) {
        year-=1;
        lowerDate.setFullYear(year,month,1);
        higherDate.setFullYear(year,month,1);
        if(TrendFullPeriod == 1) {
            day2 = daysInMonth(month,year);
        }
        higherDate.setDate(day2);
        TrendQueueShortTitle = 'Last ' + getMonthName(month);
        TrendQueueCol[0] = getMonthName(month,true) + ' ' + year;
    }
    if(TrendQueueByPeriod == 2) {
        year-=1;
        lowerDate.setFullYear(year);
        higherDate.setFullYear(year);
        TrendQueueCol[0] = getMonthName(month,true) + ' - ' + getMonthName(month2,true) + ' ' + year;
        TrendQueueShortTitle = TrendQueueCol[0];
    }
    TrendQueueCol[2] = 'Difference';
    await BuildTrendData('lm',lowerDate,higherDate);

    await CleanupTrendData();

    r_TrendsActiveReady = true;
    document.body.style.cursor = '';
}

async function CleanupTrendData() {

    let retGroup = [];

    for (let i = 0; i < TrendQueue.length; i += 1) {
        retGroup = await GetCategoryGroup(TrendQueue[i].ID);
        TrendQueueByGroup == 1 ? TrendQueue[i].DESC = retGroup[1] : TrendQueue[i].DESC = retGroup[2];
        TrendQueue[i].TYPE = retGroup[3];

        if(retGroup[3] == 'expense') {
            TrendQueue[i].N_CURRENT = TrendQueue[i].N_CURRENT * -1;
            TrendQueue[i].N_LAST = TrendQueue[i].N_LAST * -1;
            TrendQueue[i].N_CURRENTM = TrendQueue[i].N_CURRENTM * -1;
            TrendQueue[i].N_LASTM = TrendQueue[i].N_LASTM * -1;
        }

        TrendQueue[i].N_DIFF = (TrendQueue[i].N_CURRENT - TrendQueue[i].N_LAST);
        TrendQueue[i].N_DIFFM = (TrendQueue[i].N_CURRENTM - TrendQueue[i].N_LASTM);

    }
    TrendQueue.sort((a, b) => b.N_CURRENT - a.N_CURRENT);
}

async function BuildTrendData (inCol,lowerDate,higherDate) {

    const firstDate = formatQueryDate(lowerDate);
    const lastDate = formatQueryDate(higherDate);

    let useID = '';
    let useAmount = '';
    let snapshotData = null;

    if(TrendQueueByGroup == 1) {
        snapshotData = await getMonthlySnapshotData(firstDate,lastDate);
    } else {
        snapshotData = await getMonthlySnapshotData2(firstDate,lastDate);
    }

    for (let i = 0; i < snapshotData.aggregates.length; i += 1) {
        if(TrendQueueByGroup == 1) {
            useID = snapshotData.aggregates[i].groupBy.categoryGroup.id;
        } else {
            useID = snapshotData.aggregates[i].groupBy.category.id;
        }
        useAmount = Number(snapshotData.aggregates[i].summary.sum);
        Trend_UpdateQueue(useID,useAmount,inCol);
    }
    console.log('beta 1',firstDate,lastDate,TrendQueueByGroup,TrendQueueByPeriod,snapshotData.aggregates.length);
}

function Trend_UpdateQueue(useID,useAmount,inCol) {

    for (let i = 0; i < TrendQueue.length; i++) {
        if(TrendQueue[i].ID == useID) {
            switch(inCol) {
                case 'cp':
                    TrendQueue[i].N_CURRENT = useAmount;
                    break;
               case 'lp':
                    TrendQueue[i].N_LAST = useAmount;
                    break;
               case 'cm':
                    TrendQueue[i].N_CURRENTM = useAmount;
                    break;
               case 'lm':
                    TrendQueue[i].N_LASTM = useAmount;
                    break;
            }
            return;
        }
    }

    switch(inCol) {
        case 'cp':
            TrendQueue.push({"TYPE": "", "ID": useID,"DESC": "","N_CURRENT": useAmount,"N_LAST": 0, "N_DIFF": 0, "N_CURRENTM": 0, "N_LASTM": 0, "N_DIFFM": 0});
            break;
        case 'lp':
            TrendQueue.push({"TYPE": "", "ID": useID,"DESC": "","N_CURRENT": 0,"N_LAST": useAmount, "N_DIFF": 0, "N_CURRENTM": 0, "N_LASTM": 0, "N_DIFFM": 0});
            break;
        case 'cm':
            TrendQueue.push({"TYPE": "", "ID": useID,"DESC": "","N_CURRENT": 0,"N_LAST": 0, "N_DIFF": 0, "N_CURRENTM": useAmount, "N_LASTM": 0, "N_DIFFM": 0});
            break;
        case 'lm':
            TrendQueue.push({"TYPE": "", "ID": useID,"DESC": "","N_CURRENT": 0,"N_LAST": 0, "N_DIFF": 0, "N_CURRENTM": 0, "N_LASTM": useAmount, "N_DIFFM": 0});
            break;
    }
}

function MenuReportsTrendsDraw() {

    let Hrow = null;
    let row = null;

    let CI = [0,0,0,0];
    let CE = [0,0,0,0];
    let CD_T = ['','','',''];
    let CD_V = [0,0,0,0];

    let css_table0 = 'hvKFU0';
    let css_table1 = 'jznQAl';
    let css_table2 = 'eGiVnj';
    let css_grid = 'jLxdcY';
    let css_items = 'eqYSVV';
    let css_button = '';
    Trend_LoadStyles();

    removeAllSections('div.MTTrendsContainer');

    Hrow = Trend_TableContainer();
    row = Trend_TableGrid(Hrow,1,'header','',TrendQueueCol[0],TrendQueueCol[1],TrendQueueCol[2],TrendQueueCol[3],TrendQueueCol[4],TrendQueueCol[5]);
    row = Trend_DumpTotal(Hrow,2,'income','Income');
    row = Trend_DumpData(row,3,'income');
    row = Trend_DumpTotal(Hrow,2,'expense','Spending');
    row = Trend_DumpData(row,3,'expense');
    row = Trend_DumpTotal(Hrow,2,'savings','Savings');
    Trend_TableCards();

    function Trend_TableCards() {

        let useStyle = '';
        let useValue = '';

        let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
        if(topDiv) {
            let div = document.createElement('div');
            div.className = 'MTTrendsContainer aMVqz';
            topDiv.prepend(div);
            topDiv = cec('div','MTFlexContainer',div,'','','gap','gutter');

            for (let i = 0; i < 4; i++) {
                let div2 = cec('div','MTFlexContainerCard',topDiv);
                useValue = getDollarValue(CD_V[i]);
                useStyle = 'text-align: center;';
                cec('span','MTTrendBig',div2,useValue,'','style',useStyle + Trend_GetColor(['expense','expense','income','income'][i],CD_V[i],true));
                cec('span','MTTrendSmall',div2,CD_T[i],'','style',useStyle);
            }
        }
    }

    function Trend_TableContainer() {

        let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
        if(topDiv) {
            let div2 = document.createElement('div');
            div2.className = 'MTTrendsContainer aMVqz';
            topDiv.prepend(div2);
            let div = cec('div',css_table0,div2);
            let hed = cec('div',css_table1,div);
            let cht = cec('div',css_table2,hed);

            div = cec('div','CardHeader__Title hhcshL',cht);
            div = cec('div','FlexContainer__Root jEeSYR fKLqRU',div);

            div2 = cec('span','MTTrendSmall',div,'Net Income Trend Report');
            div = cec('span','MTTrendBig',div,TrendQueueTitle);

            let tbs = cec('span','MTTrendButtons',cht);

            div2 = document.createElement('button');
            div2.textContent = 'Export';
            div2.className = 'MTTrendExport ' + css_button;
            tbs.appendChild(div2);
            div2.addEventListener('click', () => {
                MenuReportsTrendExport();
            });

            div2 = document.createElement('button');
            let tl = ['By Last Month','By Month', 'By Quarter'];
            div2.textContent = tl[TrendQueueByPeriod];
            div2.className = 'MTTrendPeriod ' + css_button;
            tbs.appendChild(div2);
            div2.addEventListener('click', () => {
                flipCookie('MTTrendPeriod',2);
                MenuReportsTrendsGo();
            });
            div2 = document.createElement('button');
            tl = ['By group','By category'];
            div2.textContent = tl[TrendQueueByGroup];
            div2.className = 'MTTrendGroup ' + css_button;
            tbs.appendChild(div2);
            div2.addEventListener('click', () => {
                flipCookie('MTTrendGroup',1);
                MenuReportsTrendsGo();
            });
            return hed;
        }
    }

    function Trend_TableGrid(InRow,inType,inGroup,inTitle,a,b,c,d,e,f) {

        let useStyle = ['','',''];
        let el = null;

        if(inType == 1 || inType == 2) {
            el = cec('div',css_table2,InRow,'','','style','font-size: 16px; font-weight:500;');
        } else {
            el = cec('div',css_items,InRow);
        }

        if(inType > 1) {
            useStyle[1] = Trend_GetColor(inGroup,c);
            useStyle[2] = Trend_GetColor(inGroup,f);
            let aa = addPercent(inType,inGroup,0,a);
            let bb = addPercent(inType,inGroup,1,b);
            let dd = addPercent(inType,inGroup,2,d);
            let ee = addPercent(inType,inGroup,3,e);
            a = getDollarValue(a) + aa;
            b = getDollarValue(b) + bb;
            c = getDollarValue(c);
            d = getDollarValue(d) + dd;
            e = getDollarValue(e) + ee;
            f = getDollarValue(f);
        } else {
            if(getCookie('MT_TrendFullPeriod') == 1) {
                inTitle = '* Comparing Full ' + ['Month','Month','Quarter'][TrendQueueByPeriod];
                useStyle[0] = 'font-size: 11px;';
            }
        }

        let elx = Trend_Table1W(el,inTitle,'width: 16%;'+ useStyle[0]);
        elx = Trend_Table1W(el,a,'text-align: right; width: 14%;');
        elx = Trend_Table1W(el,b,'text-align: right; width: 14%;');
        elx = Trend_Table1W(el,c,'text-align: right; width: 11%;' + useStyle[1]);
        elx = Trend_Table1W(el,d,'text-align: right; width: 18%;');
        elx = Trend_Table1W(el,e,'text-align: right; width: 14%;');
        elx = Trend_Table1W(el,f,'text-align: right; width: 11%;' + useStyle[2]);

        if(inType == 1 || inType == 2) {
            return cec('div',css_grid,InRow);
        }
        return InRow;
    }

    function addPercent(inType,inGroup,ndx,inAmount) {

        let lit = '';
        if(inType == 3 && inAmount > 0) {
            if(inGroup == 'expense') {
                if(CE[ndx] > 0) {
                    lit = (inAmount / CE[ndx]) * 100;
                    lit = Math.round(lit * 10) / 10;
                    lit = ' (' + lit.toFixed(1) + '%)';
                }
            }
            if(inGroup == 'income') {
                if(CI[ndx] > 0) {
                    lit = (inAmount / CI[ndx]) * 100;
                    lit = Math.round(lit * 10) / 10;
                    lit = ' (' + lit.toFixed(1) + '%)';
                }
            }
        }
        return lit;
    }

    function Trend_Table1W(InRow,abcd,InStyle) {

        return cec('span','MTTrendCellAmount',InRow,abcd,'','style',InStyle);

    };

    function Trend_DumpTotal(inRow,inType,inGroup,inTitle) {

        let SM = [0,0,0,0,0,0];
        let wv = 0;

        if(inGroup == 'savings') {
            SM[3] = CI[3] - CE[3];
            SM[2] = CI[2] - CE[2];
            SM[1] = CI[1] - CE[1];
            SM[0] = CI[0] - CE[0];
        }
         else {
            for (let i = 0; i < TrendQueue.length; i++) {
                if(TrendQueue[i].TYPE == inGroup) {
                    SM[3] += TrendQueue[i].N_CURRENT;
                    SM[2] += TrendQueue[i].N_LAST;
                    SM[1] += TrendQueue[i].N_CURRENTM;
                    SM[0] += TrendQueue[i].N_LASTM;
                }
                if(inGroup == 'income' && TrendQueue[i].TYPE == 'income') {
                    CI[3] += TrendQueue[i].N_CURRENT;
                    CI[2] += TrendQueue[i].N_LAST;
                    CI[1] += TrendQueue[i].N_CURRENTM;
                    CI[0] += TrendQueue[i].N_LASTM;
                }
                if(inGroup == 'expense' && TrendQueue[i].TYPE == 'expense') {
                    CE[3] += TrendQueue[i].N_CURRENT;
                    CE[2] += TrendQueue[i].N_LAST;
                    CE[1] += TrendQueue[i].N_CURRENTM;
                    CE[0] += TrendQueue[i].N_LASTM;
                    wv = TrendQueue[i].N_CURRENTM - TrendQueue[i].N_LASTM;
                    if((CD_V[0] == 0 && wv < 0) || wv < CD_V[0]) {
                        CD_V[0] = wv;
                        CD_T[0]= TrendQueue[i].DESC;
                    }
                    if((CD_V[1] == 0 && wv > 0) || wv > CD_V[1]) {
                        CD_V[1] = wv;
                        CD_T[1]= TrendQueue[i].DESC;
                    }
                }
            }
        }
        SM[5] = SM[3] - SM[2];
        SM[4] = SM[1] - SM[0];

        if(inGroup == 'savings') {
            CD_V[3] = SM[5];
            CD_V[2] = CE[0] - CE[1];
            CD_T[2] = TrendQueueShortTitle;

            if(SM[5] >= 0) {
                CD_T[3] = 'Saved more than\nlast year';
            } else {
                CD_T[3] = 'Saved less than\nlast year';
            }
            if(CD_V[2] <= 0) {
                CD_T[2] = 'Spent more than\n' + CD_T[2];
            } else {
                CD_T[2] = 'Spent less than\n' + CD_T[2];
            }
            for (let i = 0; i < 2; i++) {
                if(CD_V[i] <= 0) {
                    CD_T[i] = 'Spent less in ' + CD_T[i];
                } else {
                    CD_T[i] = 'Spent more in ' + CD_T[i];
                }
                CD_T[i] = CD_T[i] + ['\nthis month','\nsame time last year','\nsame quarter'][TrendQueueByPeriod];
            }
        }

        return Trend_TableGrid(inRow,inType,inGroup,inTitle,SM[0],SM[1],SM[4],SM[2],SM[3],SM[5]);
    }

    function Trend_DumpData(inRow,inType,inGroup) {

        let row = inRow;

        for (let i = 0; i < TrendQueue.length; i++) {
            if(TrendQueue[i].TYPE == inGroup) {
                let DescStr = decodeURIComponent(TrendQueue[i].DESC);
                row = Trend_TableGrid(row,3,inGroup,TrendQueue[i].DESC,TrendQueue[i].N_LASTM,TrendQueue[i].N_CURRENTM,TrendQueue[i].N_DIFFM,TrendQueue[i].N_LAST,TrendQueue[i].N_CURRENT,TrendQueue[i].N_DIFF);
            }
        }
        return row;
    }

    function Trend_GetColor(inGroup,inAmount, inRed) {

        let useStyle = '';
        if(inGroup == 'income' || inGroup == 'savings') {
            if(inAmount >= 0) { useStyle = 'color: ' + css_green; };
        } else {
            if(inAmount <= 0) { useStyle = 'color: ' + css_green; };
        }
        if(useStyle == '' && inRed == true) {useStyle = 'color: ' + css_red};
        return useStyle;
    }

    function Trend_LoadStyles() {

        let element=document.querySelector('div.Grid__GridItem-s9hcqo-1');
        if(element) { css_table0 = 'Trend_' + element.className; };
        element=document.querySelector('div.Card__CardRoot-sc-1pcxvk9-0');
        if(element) { css_table1 = 'Trend_' + element.className; };
        element=document.querySelector('div.CardHeader__Root-r0eoe3-0');
        if(element) { css_table2 = 'Trend_' + element.className; };
        element=document.querySelector('div.TransactionsSummaryCard__CardInner-sc-10q11ba-1');
        if(element) { css_grid = 'TrendGrid ' + element.className; };
        element=document.querySelector('div.TransactionsSummaryCard__CardItem-sc-10q11ba-0');
        if(element) { css_items = 'Trend_' + element.className; };
        element = findButton('','');
        if(element) { css_button = element.className;};

    }

    function MenuReportsTrendExport() {

        const CRLF = String.fromCharCode(13,10);
        const c = ',';
        let csvContent = '';

        csvContent = csvContent + 'Trends Report - ' + getDates('Today') + c + TrendQueueCol.join(c) + CRLF;

        let types = ['income','expense']
        for (const i in types) {
            csvContent = csvContent + types[i].toUpperCase() + c;
            if(i == 0) {
                csvContent = csvContent + CI[0].toFixed(2) + c + CI[1].toFixed(2) + c + (CI[1]-CI[0]).toFixed(2) + c;
                csvContent = csvContent + CI[2].toFixed(2) + c + CI[3].toFixed(2) + c + (CI[3]-CI[2]).toFixed(2) + c + CRLF;
            } else {
                csvContent = csvContent + CE[0].toFixed(2) + c + CE[1].toFixed(2) + c + (CE[1]-CE[0]).toFixed(2) + c;
                csvContent = csvContent + CE[2].toFixed(2) + c + CE[3].toFixed(2) + c + (CE[3]-CE[2]).toFixed(2) + c + CRLF;
            }

            for(let j = 0; j < TrendQueue.length; j++) {
                if(TrendQueue[j].TYPE == types[i]) {
                    csvContent = csvContent + TrendQueue[j].DESC + c + TrendQueue[j].N_LASTM.toFixed(2) + c + TrendQueue[j].N_CURRENTM.toFixed(2) + c + TrendQueue[j].N_DIFFM.toFixed(2) + c +TrendQueue[j].N_LAST.toFixed(2) + c + TrendQueue[j].N_CURRENT.toFixed(2) + c +TrendQueue[j].N_DIFF.toFixed(2) + c + CRLF;
                }
            }
            csvContent = csvContent + ',,,,,,' + CRLF;
        }

        downloadFile('Monarch Trends Report',csvContent);
    }

}

// Datasets Menu
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
        rnames.sort();

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
        r_FilterD = false;
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
        NewReport = NewReport.substring(4);
    }

    if(NewReport != null && NewReport != "") {
        NewReport = NewReport.trim();
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
        r_oo = findButton(inValue,'');
        if(r_oo != null) {
            const observer = new MutationObserver(MM_FixCalendarCallback);
            const config = { attributes: true, childList: true, subtree: true };
            observer.observe(r_oo, config);
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
        InList.removeChild(InList.firstChild);
    }
}

const MM_FixCalendarCallback = (mutationList, observer) => {

    r_DatePickerActive = r_DatePickerActive? false : true

    if (r_DatePickerActive == true) {
        let li = document.querySelectorAll('div.DateRangePickerShortcuts__StyledMenuItem-jr6842-1');
        if(li[6]) {
            const useClass = li[0].className;

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

// [ Breadcrumbs ]
function MenuReportBreadcrumbListener() {

    if (SaveLocationPathName.endsWith('/income') || SaveLocationPathName.endsWith('/spending')) {
        if(r_eventListener == false) {
            if(getCookie("MT_ReportsDrilldown") == 1) {
                window.addEventListener("click", event => {
                    const cl = event.target.parentNode;
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
            let x = storedStr.indexOf('}",');
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
        const div = document.querySelector('div.ReportsPieChart__Root-a4nd0f-0');
        if(div) {
            let groupStoredStr = localStorage.getItem('persist:breadcrumb');
            if(groupStoredStr) {
                const GroupStuff = groupStoredStr.split('/:/');
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
                    div.prepend(bc);
                    bc.addEventListener('click', () => {
                        window.location.replace(SaveLocationPathName + '?categoryGroups=' + groupId);
                    });
                } else
                {
                    let bc = document.createElement('span');
                    bc.className = 'MTlink2';
                    bc.innerText = '/ ' + groupName;
                    div.prepend(bc);
                }
            }

            let bc3 = document.createElement('button');
            bc3.className = 'MTlink';
            bc3.innerText = 'Clear Categories »';
            div.prepend(bc3);
            bc3.addEventListener('click', () => {
                const storedStr = localStorage.getItem('persist:reports');
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

// [ Splits ]
function MM_SplitTransaction() {

    let li = document.querySelector('[class*="TransactionSplitOriginalTransactionContainer__Amount"]');
    if(li) {
        if(li.getAttribute('hacked') != 'true') {
            li.setAttribute('hacked','true');
            let AmtA = getCleanValue(li.innerText,2);
            li = document.querySelectorAll('[class*="TransactionSplitModal__SplitSectionHeader"]');
            if(li[1]) {
                let AmtB = AmtA / 2;
                AmtB = parseFloat(AmtB).toFixed(2);
                AmtA = AmtA - AmtB;
                AmtA = parseFloat(AmtA).toFixed(2);
                let Splitby2 = getDollarValue(AmtA) + ' / ' + getDollarValue(AmtB);
                let div = cec('div','',li[1],'','','style','float: right;');

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
        if(OnFocus == false) { r_oo = null; }
        if(OnFocus == true) { r_spawn = 1; }
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
            MenuDisplay_Input('','','spacer');
            MenuDisplay_Input('Menu - Hide Budget','MT_Budget','checkbox');
            MenuDisplay_Input('Menu - Hide Recurring','MT_Recurring','checkbox');
            MenuDisplay_Input('Menu - Hide Goals','MT_Goals','checkbox');
            MenuDisplay_Input('Menu - Hide Investments','MT_Investments','checkbox');
            MenuDisplay_Input('Menu - Hide Advice','MT_Advice','checkbox');
            MenuDisplay_Input('Menu - Hide Monarch Ads','MT_Ads','checkbox');
            MenuDisplay_Input('','','spacer');
            MenuDisplay_Input('General - Calendar "Last year" and "Last 12 months" include full month','MT_CalendarEOM','checkbox');
            MenuDisplay_Input('Accounts - Hide Accounts Net Worth Graph panel','MT_HideAccountsGraph','checkbox');
            MenuDisplay_Input('Transactions - Transactions panel has smaller compressed grid (Requires refresh page)','MT_CompressedTx','checkbox');
            MenuDisplay_Input('Transactions - Show Pending Transactions in red (Allow Pending Edits must be disabled)','MT_PendingIsRed','checkbox');
            MenuDisplay_Input('Transactions - Hide Create Rule pop-up','MT_HideToaster','checkbox');
            MenuDisplay_Input('Reports - Add Drill-Down functionality to Reports Income/Spending','MT_ReportsDrilldown','checkbox');
            MenuDisplay_Input('Reports - Trends previous period always includes full period (end of month/quarter)','MT_TrendFullPeriod','checkbox');
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
        if(inType == 'spacer') {
            e1.className = 'MTSpacerClass';
            qs.after(e1);
            return;
        }

        if(inType == 'header') {
            e1.innerText = inValue;
            let x = document.querySelector('div.CardHeader__Root-r0eoe3-0');
            if(x){ e1.className = x.className; }
            e1.style = 'font-size: 18px; font-weight: 500; display: inline-block';
        } else {
            e1.style = 'margin: 11px 25px;';
        }
        qs.after(e1);
        let e2 = null;
        let e3 = null;

        const OldValue = getCookie(inCookie);

        const d = new Date();
        const year = d.getFullYear();

        if(inType == 'checkbox') {
            e2 = document.createElement('input');
            e2.type = inType;
            e2.className = 'MTCheckboxClass';
            if(OldValue == 1) {e2.checked = 'checked'};
            e1.appendChild(e2);
            e2.addEventListener('change', () => {
                flipCookie(inCookie,1);
                r_Init = false;
            });
            e3 = document.createTextNode('  ' + inValue);
            e2.parentNode.insertBefore(e3, e2.nextSibling);
        };
        if(inType == 'number') {
            cec('div','',e1,inValue,'','style','font-size: 14px; font-weight: 500;');
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
        }
    }
}

// [ Plan & Budget ] 
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
            r_ooPl.style = 'display: ' + getDisplay(1);
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
            r_ooPl2.style = 'display: ' + getDisplay(1);
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
    removeAllSections('.MTPlanHeader');
    removeAllSections('.MTPlanDetail');

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
                        r_PlanGridActive = pending;
                        return;
                    }
                }

                rowValue += cellValue;

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
                        clonedNodeYTD.innerText = getDollarValue(rowValue);
                    };
                    el.insertAdjacentElement('afterend', clonedNodeYTD);
                };

                if(pivotCount == 12) {
                    if(isNaN(rowValue)) {
                        clonedNodeProj.innerText = '-';
                    } else {
                        clonedNodeProj.innerText = getDollarValue(rowValue);
                    };
                    el.insertAdjacentElement('afterend', clonedNodeProj);
                    pivotCount = 0;
                    rowValue = 0;
                };
            }
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
            i = 0;
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

    if(r_TrendsActiveReady == true) {
        MenuReportsTrendsDraw();
        r_TrendsActiveReady = false;
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

function removeAllSections(inDiv) {

    const divs = document.querySelectorAll(inDiv);
    for (let i = 0; i < divs.length; ++i) {
        divs[i].remove();
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

function getCleanValue(inValue,inDec) {

    if(inValue) {
        const AmtStr = inValue.replace(/[$,]+/g,"");
        let Amt = parseInt(AmtStr);
        if(inDec) { Amt = parseFloat(AmtStr).toFixed(inDec); };
        return Amt;
    }
    else {
        return null;
    }
}

function getDollarValue(InValue) {

    return InValue.toLocaleString("en-US", {style:"currency", currency:css_currency});

}

function getMonthName(inValue,inShort) {

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if(inShort != null && inShort == true) {
        return months[inValue].substring(0,3);
    } else
    {
        return months[inValue];
    }
}

function formatQueryDate(date) {

    var d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {month = '0' + month;}
    if (day.length < 2) {day = '0' + day;}

    return [year, month, day].join('-');
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
    if(InValue == 'ThisYear') {
        day = 1;
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
    const FullDate = ("0" + month).slice(-2) + '/' + ("0" + day).slice(-2) + '/' + year;
    return(FullDate);
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function flipCookie(inCookie,spin) {

    let OldValue = parseInt(getCookie(inCookie,true)) + 1;
    if(spin == null) {spin = 1;}
    if(OldValue > spin) {
        setCookie(inCookie,0);
    } else {
        setCookie(inCookie,OldValue);
    }
}

function deleteCookie(cName) {

    document.cookie = cName + "= ;expires=31 Dec 2000 23:59:59 GMT; path=/" ;
 }

function setCookie(cName, cValue) {

   document.cookie = cName + "=" + cValue + ";expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/" ;
}

function getCookie(cname,isNum) {

    let name = cname + '=';
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
    if(isNum == true) {return 0};
    return '';
}

function findButton(inValue,inName) {

    let useTarget = null;
    const div=document.querySelectorAll('button');

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

function cec(e,c,r,it,hr,a1,a2,b1,b2) {

    let div = document.createElement(e);
    if(c) {div.className = c};
    if(it) {div.innerText = it};
    if(hr) {div.href = hr};
    if(a1) {div.setAttribute(a1,a2)};
    if(b1) {div.setAttribute(b1,b2)};
    const x = r.appendChild(div);
    return x;
}

function getStyle() {

    const cssObj = window.getComputedStyle(document.querySelector('[class*=Page__Root]'), null);
    const bgColor = cssObj.getPropertyValue('background-color');
    if (bgColor === 'rgb(8, 32, 67)') { css_bgColor = '#0d2c5c';return 'dark'; } else {css_bgColor = '#ffffff';return 'light'};

}

function getDisplay(InA) {
    if(InA == 1) {return 'none;'} else {return 'block;'};
}

function downloadFile(inTitle,inData) {

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + inData);
    const link = cec('a','',document.body,'',encodedUri,'download',inTitle + '.csv');
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
                    MenuPlan(false);
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

    },400);
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

async function getMonthlySnapshotData2(startDate, endDate) {
  const options = callGraphQL({
    operationName: 'GetAggregatesGraph',
    variables: {startDate: startDate, endDate: endDate, },
      query: "query GetAggregatesGraph($startDate: Date, $endDate: Date) {\n    aggregates(\n filters: { startDate: $startDate, endDate: $endDate }\n groupBy: [\"category\", \"year\"]\n  fillEmptyValues: false\n ) {\n groupBy {\n category {\n id\n }\n year\n }\n summary {\n sum\n }\n }\n }\n"
      });

  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    }).catch((error) => {
      console.error('query error: ',error);
    });
}

async function getMonthlySnapshotData(startDate, endDate) {
  const options = callGraphQL({
    operationName: 'GetAggregatesGraphCategoryGroup',
    variables: {startDate: startDate, endDate: endDate, },
      query: "query GetAggregatesGraphCategoryGroup($startDate: Date, $endDate: Date) {\n aggregates(\n filters: { startDate: $startDate, endDate: $endDate }\n groupBy: [\"categoryGroup\", \"year\"]\n fillEmptyValues: false\n ) {\n groupBy {\n categoryGroup {\n id\n }\n year\n }\n summary {\n sum\n }\n }\n }\n"
      });

  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    }).catch((error) => {
      console.error('query error: ',error);
    });
}

async function getCategoryData() {
    const options = callGraphQL({
      operationName: 'GetCategorySelectOptions',
      variables: {},
        query: "query GetCategorySelectOptions {categories {\n id\n name\n order\n icon\n group {\n id\n name \n type}}}"
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
            accountGroups.push({"GROUP": categoryData.categories[i].group.id, "GROUPNAME": categoryData.categories[i].group.name, "ID": categoryData.categories[i].id, "NAME": categoryData.categories[i].name, "ICON": categoryData.categories[i].icon, "TYPE": categoryData.categories[i].group.type, "ORDER": categoryData.categories[i].order});
        }
    }
}

function GetCategoryGroup(InId) {

  for (let i = 0; i < accountGroups.length; i++) {
      if(accountGroups[i].ID == InId || accountGroups[i].GROUP == InId) {
          return [accountGroups[i].GROUP,accountGroups[i].GROUPNAME,accountGroups[i].NAME,accountGroups[i].TYPE];
      }
  }

    return [null,null,null, null];
}
