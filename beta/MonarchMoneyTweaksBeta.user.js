// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.26.03
// @description  Monarch Tweaks
// @author       Robert P
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// @grant        GM_addStyle
// @grant        GM_info
// ==/UserScript==

const css_currency = 'USD';
const css_green = 'color: #489d8c;';
const css_red = 'color: #ed5987;';
const pending = 2;
const graphql = 'https://api.monarchmoney.com/graphql';

let r_Init = false;
let r_DatePickerActive = false;
let r_PlanGridActive = false;
let r_TrendsActiveReady = false;
let r_FilterD = false;
let r_spawn = 0;
let r_eventListener = null;
let r_oo = null;
let r_oo2 = null;
let r_PlanYear = '';
let accountGroups = [];
let TrendTodayIs = new Date();
let TrendQueue = [];
let TrendQueue2 = [];
let TrendQueueTitle = '';
let TrendQueueShortTitle = '';
let TrendQueueCol = [];
let TrendQueueRow = null;
let TrendQueueByGroup = 0;
let TrendQueueByPeriod = 0;
let SaveLocationHRefName = '';
let SaveLocationPathName = '';
let css_styles = [];

function MM_Init() {

    const a = getStyle();
    const a1 = 'background-color: ' + ['#0d2c5c;','#ffffff;'][a];
    const a2 = 'background-color: ' + ['#14457a;','#eaf6fd;'][a];
    const a3 = ['#263d5f','#e4e9f0'][a];
    const a4 = 'background: ' + ['#082043;','aliceblue;'][a];
    const a5 = 'color: ' + ['#FFFFFF;','#082864;'][a];

    GM_addStyle('.MTPlanHeader {font-weight: 900; align-content: inherit; padding: 0px 0px 15px;}');
    GM_addStyle('.MTPlanDetail {' + css_green + 'font-size: 16px; font-weight: 500;}');

    GM_addStyle('.MTlink, .MTlink3 {background-color: transparent; color: rgb(50, 170, 240); font-weight: 500; font-size: 14px; cursor: pointer; border-radius: 4px; border-style: none; padding: 15px 1px 1px 16px; display:inline-block;}');
    GM_addStyle('.MTlink2 {background-color: transparent; font-size: 14px; font-weight: 500; padding: 0px 0px 0px 16px;}');

    GM_addStyle('.MTTrendButtons {display: flex; gap: 20px;}');
    GM_addStyle('.MTCheckboxClass {width: 20px; height: 20px;}');
    GM_addStyle('.MTSpacerClass {padding: 1px 1px 1px 1px; width: 100%; line-height: 10px; border-bottom: 1px solid ' + a3 +';}');

    GM_addStyle('.MThRefClass {cursor:pointer; text-align: right; ' + a5 + '}');
    GM_addStyle('.MThRefClass:hover {cursor:pointer; color: rgb(50, 170, 240);}');

    GM_addStyle('.MTTrendsContainer {display:block; padding-bottom: 0px;}');
    GM_addStyle('.MTFlexContainer {margin: 0px; gap: 20px; display: flex;}');
    GM_addStyle('.MTFlexContainerCard {padding: 30px; flex: 1 1 0%; display: flex; flex-flow: column; place-content: stretch flex-start; border-radius: 8px; background-color: '+ css_styles.background + ';}');
    GM_addStyle('.MTTrendCell, .MTTrendCell2 {' + a1 + a5 + ' text-align: right; font-size: 14px; padding-right: 5px;}');
    GM_addStyle('.MTTrendCell:hover {cursor:pointer; color: rgb(50, 170, 240);}');

    GM_addStyle('.MTTrendCellArrow, .MTTrendCellArrow2 {font-size: 16px; font-family: MonarchIcons, sans-serif !important; transition: 0.1s ease-out; ' + a1 + a5 + ' width: 26px; cursor: pointer; border-radius: 100%;  border-style: none; margin-left: 10px;}');
    GM_addStyle('.MTTrendCellArrow:hover {border: 1px solid rgb(218, 225, 234); box-shadow: rgba(8, 40, 100, 0.1) 0px 1px 2px;}');

    GM_addStyle('.MTSideDrawerRoot {position: absolute;  inset: 0px;  display: flex;  -moz-box-pack: end;  justify-content: flex-end;}');
    GM_addStyle('.MTSideDrawerContainer {overflow: hidden; padding: 12px; width: 640px; -moz-box-pack: end; ' + a4 + ' position: relative; overflow:auto;}');
    GM_addStyle('.MTSideDrawerMotion {display: flex; flex-direction: column; transform:none;}');
    GM_addStyle('.MTSideDrawerHeader { ' + a5 + ' padding: 12px; }');
    GM_addStyle('.MTSideDrawerDetail { ' + a5 + ' width: 24%; text-align: right; font-size: 13px; }');
    GM_addStyle('.MTSideDrawerDetail2 { ' + a5 + ' width: 24%; text-align: right; font-size: 12px; }');
    GM_addStyle('.MTSideDrawerDetail3 { ' + a5 + ' width: 13px; text-align: center; font-size: 13px; font-family: MonarchIcons, sans-serif !important; }');

    GM_addStyle('.MTTrendBig {font-size: 18px; font-weight: 500; padding-top: 8px;}');
    GM_addStyle('.MTTrendSmall {font-size: 12px;font-weight: 600; padding-top: 8px; color: #919cb4; text-transform: uppercase; line-height: 150%; letter-spacing: 1.2px;}');

    GM_addStyle('.dropbtn {' + a1 + a5 + '; border: none; cursor: pointer;}');
    GM_addStyle('.dropbtn:hover, .dropbtn:focus {' + a2 + '}');
    GM_addStyle('.MTdropdown {float: right;  position: relative; display: inline-block; font-weight: 200;}');
    GM_addStyle('.MTdropdown-content div {font-size: 0px; line-height: 2px; background-color: #ff7369;}');
    GM_addStyle('.MTdropdown-content {' + a1 + a5 + ';display:none; position: absolute; min-width: 300px; overflow: auto; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px; right: 0; z-index: 1;}');
    GM_addStyle('.MTdropdown-content a {' + a1 + a5 + ';font-size: 15px; padding: 10px 10px; display: block;}');
    GM_addStyle('.MTdropdown a:hover {' + a2 + ' }');
    GM_addStyle('.show {display: block;}');

    GM_addStyle('.Toast__Root-sc-1mbc5m5-0 {display: ' + getDisplay(getCookie("MT_HideToaster"),'block;') + '}');
    GM_addStyle('.ReportsTooltipRow__Diff-k9pa1b-3 {display: ' + getDisplay(getCookie("MT_HideTipDiff"),'block;') + '}');
    GM_addStyle('.AccountNetWorthCharts__Root-sc-14tj3z2-0 {display: ' + getDisplay(getCookie("MT_HideAccountsGraph"),'block;') + '}');

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
};

// [ Reports Menu ]
function MenuReports(OnFocus) {

    if (SaveLocationPathName.startsWith('/reports/')) {
        if(OnFocus == false) {
            const pn = window.location.pathname;
            if(pn.startsWith('/reports/') == false) {
                r_oo = null;
            }
        }
       if(OnFocus == true) {
           MenuReportsDataset();
           MenuReportBreadcrumbListener();
           MenuReportsTrends();
           r_spawn = 1;
        }
    }
}

function MenuReportsDataset() {

    const isFilter = document.querySelector('button.MT_FilterRestore');
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
                    fbr.addEventListener('click', MenuFilter,false);
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
        }
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

function MenuReportsTrendsStyles() {

    const element = findButton('','');
    if(element) { css_styles.button = element.className;}
    css_styles.items1 = MTgetStyle('Grid__GridItem','hvKFU0');
    css_styles.items2 = MTgetStyle('Card__CardRoot-sc-','jznQAl');
    css_styles.items3 = MTgetStyle('CardHeader__Root-','eGiVnj');
    css_styles.row = MTgetStyle('TransactionsSummaryCard__CardInner','jLxdcY');
    css_styles.item = MTgetStyle('TransactionsSummaryCard__CardItem','eqYSVV');
    css_styles.hidePercent1 = getCookie('MT_TrendHidePer1',true);
    css_styles.hidePercent2 = getCookie('MT_TrendHidePer2',true);
    css_styles.color1 = 'background-color: #e68691;color: black;';
    css_styles.color2 = 'background-color: #ffc7ce;color: black;';
    css_styles.color3 = 'background-color: #fff3f4;color: black;';

    function MTgetStyle(inClass,inDefault) {
        let element=document.querySelector('[class*="' + inClass + '"]');
        if(element) {return 'Trend_' + element.className;} else {return inDefault;}
    }
}

async function MenuReportsTrendsGo() {

    document.body.style.cursor = "wait";

    TrendQueueByGroup = getCookie('MTTrendGroup',true);
    TrendQueueByPeriod = getCookie('MTTrendPeriod',true);
    let TrendFullPeriod = getCookie('MT_TrendFullPeriod',true);

    await buildCategoryGroups();

    TrendQueue = [];

    let lowerDate = new Date(TrendTodayIs);
    let higherDate = new Date(TrendTodayIs);
    lowerDate.setDate(1);
    lowerDate.setMonth(0);

    let month = lowerDate.getMonth();
    let day = lowerDate.getDate();
    let year = lowerDate.getFullYear();

    let month2 = higherDate.getMonth();
    let day2 = higherDate.getDate();
    let year2 = higherDate.getFullYear();

    TrendQueueTitle = getMonthName(month,true) + ' ' + day + ', ' + year + ' - ' + getMonthName(month2,true) + ' ' + day2 + ', ' + year2;

    // this year
    TrendQueueCol[4] = 'YTD ' + year;
    await BuildTrendData('cp',TrendQueueByGroup,'year',lowerDate,higherDate,'');

    // last year
    year-=1;
    lowerDate.setFullYear(year);
    higherDate.setFullYear(year);
    TrendQueueCol[3] = 'YTD ' + year;
    TrendQueueCol[5] = 'Difference';
    await BuildTrendData('lp',TrendQueueByGroup,'year',lowerDate,higherDate,'');

    // This Period
    TrendQueueCol[1] = '';
    year+=1;
    month = month2;
    lowerDate.setFullYear(year,month,1);
    higherDate.setFullYear(year2,month2,day2);

    if(TrendQueueByPeriod == 2) {
        const QtrDate = getDates('ThisQTRs',TrendTodayIs);
        month = parseInt(QtrDate.substring(0,2)) - 1;
        lowerDate.setMonth(month);
        if(month != month2) {TrendQueueCol[1] = getMonthName(month,true) + ' - ';}
    }
    if(TrendFullPeriod == 1) {
        day2 = daysInMonth(month2,year2);
        higherDate.setDate(day2);
    }

    TrendQueueCol[1] = TrendQueueCol[1] + getMonthName(month2,true) + ' ' + year;
    await BuildTrendData('cm',TrendQueueByGroup,'year',lowerDate,higherDate,'');

    // Last Period --------------
    TrendQueueCol[0] = '';
    if(TrendQueueByPeriod == 0) {
        month-=1;
        if(month < 0) {
            month = 11;
            year = year - 1;
        }
        month2 = month;
        year2 = year;
        lowerDate.setFullYear(year,month,1);
        higherDate.setFullYear(year2,month2,1);

        let x = daysInMonth(month,year);
        if(day2 > x) {day2 = x;}
        higherDate.setDate(day2);
        TrendQueueShortTitle = 'Last Month';
        TrendQueueCol[0] = getMonthName(month2,true) + ' ' + year;
    }
    if(TrendQueueByPeriod == 1) {
        year-=1;
        lowerDate.setFullYear(year,month,1);
        higherDate.setFullYear(year,month,1);
        higherDate.setDate(day2);
        TrendQueueShortTitle = 'Last ' + getMonthName(month);
        TrendQueueCol[0] = getMonthName(month,true) + ' ' + year;
    }
    if(TrendQueueByPeriod == 2) {
        year-=1;
        lowerDate.setFullYear(year);
        higherDate.setFullYear(year);
        if(month == month2) {
            TrendQueueCol[0] = getMonthName(month2,true) + ' ' + year;
        } else {
            TrendQueueCol[0] = getMonthName(month,true) + ' - ' + getMonthName(month2,true) + ' ' + year;
        }
        TrendQueueShortTitle = TrendQueueCol[0];
    }

    if(TrendFullPeriod == 1) {
        day2 = daysInMonth(month2,year2);
        higherDate.setDate(day2);
        TrendQueueCol[0] = TrendQueueCol[0] + ' *';
    }

    TrendQueueCol[2] = 'Difference';
    await BuildTrendData('lm',TrendQueueByGroup,'year',lowerDate,higherDate,'');
    await CleanupTrendData();
    r_TrendsActiveReady = true;
    document.body.style.cursor = '';
}

async function CleanupTrendData() {

    for (let i = 0; i < TrendQueue.length; i += 1) {
        let retGroup = await getCategoryGroup(TrendQueue[i].ID);
        if(TrendQueueByGroup == 0) {TrendQueue[i].DESC = retGroup.GROUPNAME;} else {TrendQueue[i].DESC = retGroup.NAME;}
        TrendQueue[i].TYPE = retGroup.TYPE;
        TrendQueue[i].ICON = retGroup.ICON;

        if(retGroup.TYPE == 'expense') {
            TrendQueue[i].N_CURRENT = TrendQueue[i].N_CURRENT * -1;
            TrendQueue[i].N_LAST = TrendQueue[i].N_LAST * -1;
            TrendQueue[i].N_CURRENTM = TrendQueue[i].N_CURRENTM * -1;
            TrendQueue[i].N_LASTM = TrendQueue[i].N_LASTM * -1;
        }

        TrendQueue[i].N_DIFF = (TrendQueue[i].N_CURRENT - TrendQueue[i].N_LAST).toFixed(2);
        TrendQueue[i].N_DIFFM = (TrendQueue[i].N_CURRENTM - TrendQueue[i].N_LASTM).toFixed(2);
        TrendQueue[i].N_DIFF = Number(TrendQueue[i].N_DIFF);
        TrendQueue[i].N_DIFFM = Number(TrendQueue[i].N_DIFFM);
    }
}

async function BuildTrendData (inCol,inGrouping,inPeriod,lowerDate,higherDate,inID) {

    const firstDate = formatQueryDate(lowerDate);
    const lastDate = formatQueryDate(higherDate);

    let useID = '';
    let useAmount = '';
    let useDesc = '';
    let useType = '';
    let snapshotData = null;
    let mm = '';
    let yy = '';
    let retGroups = [];

    if(inID) { useType = getCategoryGroup(inID).TYPE; }
    inGrouping = Number(inGrouping);

    if(inGrouping == 0) {
        snapshotData = await getMonthlySnapshotData(firstDate,lastDate,inPeriod);
    } else {
        snapshotData = await getMonthlySnapshotData2(firstDate,lastDate,inPeriod);
    }

    for (let i = 0; i < snapshotData.aggregates.length; i += 1) {
        switch(inGrouping) {
            case 0:
                useID = snapshotData.aggregates[i].groupBy.categoryGroup.id;
                break;
            case 1:
                useID = snapshotData.aggregates[i].groupBy.category.id;
                break;
            case 2:
                useID = snapshotData.aggregates[i].groupBy.category.id;
                retGroups = getCategoryGroup(useID);
                useID = retGroups.GROUP;
                useDesc = retGroups.NAME;
                useType = retGroups.TYPE;
                break;

        }
        if(inID == '' || inID == useID) {
            useAmount = Number(snapshotData.aggregates[i].summary.sum);
            if(inID) {
                let useDate = snapshotData.aggregates[i].groupBy.month;
                yy = useDate.substring(0,4);
                mm = useDate.substring(5,7);
                if(useType == 'expense') { useAmount = useAmount * -1;}
                TrendQueue2.push({"YEAR": yy, "MONTH": mm,"AMOUNT": useAmount, "DESC": useDesc});
            } else { Trend_UpdateQueue(useID,useAmount,inCol); }
        }
    }
    console.log(GM_info.script.version,firstDate,lastDate,inGrouping,inPeriod,inID,'Data Len: ' + snapshotData.aggregates.length,'Queue Len: ' + TrendQueue.length);
    if(inCol == 'hs') {r_TrendsActiveReady = 2;}
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
            TrendQueue.push({"ICON": "", "DESC": "","TYPE": "", "ID": useID,"N_CURRENT": useAmount,"N_LAST": 0, "N_DIFF": 0, "N_CURRENTM": 0, "N_LASTM": 0, "N_DIFFM": 0});
            break;
        case 'lp':
            TrendQueue.push({"ICON": "", "DESC": "","TYPE": "", "ID": useID,"N_CURRENT": 0,"N_LAST": useAmount, "N_DIFF": 0, "N_CURRENTM": 0, "N_LASTM": 0, "N_DIFFM": 0});
            break;
        case 'cm':
            TrendQueue.push({"ICON": "", "DESC": "","TYPE": "", "ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_DIFF": 0, "N_CURRENTM": useAmount, "N_LASTM": 0, "N_DIFFM": 0});
            break;
        case 'lm':
            TrendQueue.push({"ICON": "", "DESC": "","TYPE": "", "ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_DIFF": 0, "N_CURRENTM": 0, "N_LASTM": useAmount, "N_DIFFM": 0});
            break;
    }
}

function Trend_addCellPercent(inA,inB) {

    if(css_styles.hidePercent2 != '1') {
        if(isNaN(inA)) {inA = 0;}
        if(isNaN(inB)) {inB = 0;}
        let p = ['',''];
        if(inA != 0 || inB != 0) {
            if(inA != 0) {
                p[0] = ((inB - inA) / inA);
            } else {
                p[0] = 1;
            }
            p[0] = p[0] * 100;
            p[0] = Math.round(p[0] * 10) / 10;

            if(p[0] > 100) {
                p[1] = css_styles.color1;
            } else {
                if(p[0] > 50) {p[1] = css_styles.color2;} else {
                    if(p[0] > 25 ) {p[1] = css_styles.color3;}
                }
            }
            if(p[1]) {p[1] = p[1] + 'border-radius: 6px;';}
            p[0] = ' (' + p[0].toFixed(1) + '%)';
        }
        return(p);
    } else {return ['',''];}
}

function MenuReportsTrendsPanels(inType) {

    let div = document.querySelector("div.MTdropdown");
    if(div) {div.parentNode.style=inType;}
    div = document.querySelector('[class*="Grid__GridStyled-"]');
    if(div) {div.style=inType;}
}

function MenuReportsTrendsDraw(inRedraw) {

    let CI = [0,0,0,0];
    let CE = [0,0,0,0];
    let CD_T = ['','','','',''];
    let CD_V = [0,0,0,0,0];
    let Hrow = null;
    let row = null;

    if(inRedraw == null) {
        removeAllSections('div.MTTrendsContainer');
        MenuReportsTrendsStyles();
        Hrow = Trend_TableContainer();
        TrendQueueRow = Trend_TableGrid(Hrow,1,'header','',TrendQueueCol[0],TrendQueueCol[1],TrendQueueCol[2],TrendQueueCol[3],TrendQueueCol[4],TrendQueueCol[5],'','');
        Trend_TableSort();
        Trend_TableDetails();
        Trend_TableCards();
    } else {
        removeAllSections('div.MTTrendData');
        Trend_TableSort();
        Trend_TableDetails();
    }

    function Trend_TableDetails() {
        Hrow = cec('div','MTTrendData',TrendQueueRow);
        row = Trend_DumpTotal(Hrow,2,'income','Income');
        row = Trend_DumpData(row,3,'income');
        row = Trend_DumpTotal(Hrow,2,'expense','Spending');
        row = Trend_DumpData(row,3,'expense');
        row = Trend_DumpTotal(Hrow,2,'savings','Savings');
    }

    function Trend_TableSort() {

        let inSort = getCookie('MTTrendSort',true);

        if(inSort == 0) {
            TrendQueue.sort(function (a, b) {
                if (a.DESC < b.DESC) { return -1;}
                if (a.DESC > b.DESC) { return 1;}
                return 0;
            });
        }

        if(inSort == 1) { TrendQueue.sort((a, b) => a.N_LASTM - b.N_LASTM);}
        if(inSort == 2) { TrendQueue.sort((a, b) => a.N_CURRENTM - b.N_CURRENTM);}
        if(inSort == 3) { TrendQueue.sort((a, b) => a.N_DIFFM - b.N_DIFFM);}
        if(inSort == 4) { TrendQueue.sort((a, b) => a.N_LAST - b.N_LAST);}
        if(inSort == 5) { TrendQueue.sort((a, b) => a.N_CURRENT - b.N_CURRENT);}
        if(inSort == 6) { TrendQueue.sort((a, b) => a.N_DIFF - b.N_DIFF);}
        if(inSort == -1) { TrendQueue.sort((a, b) => b.N_LASTM - a.N_LASTM);}
        if(inSort == -2) { TrendQueue.sort((a, b) => b.N_CURRENTM - a.N_CURRENTM);}
        if(inSort == -3) { TrendQueue.sort((a, b) => b.N_DIFFM - a.N_DIFFM);}
        if(inSort == -4) { TrendQueue.sort((a, b) => b.N_LAST - a.N_LAST);}
        if(inSort == -5) { TrendQueue.sort((a, b) => b.N_CURRENT - a.N_CURRENT);}
        if(inSort == -6) { TrendQueue.sort((a, b) => b.N_DIFF - a.N_DIFF);}

        setCookie('MTTrendSort',inSort);
    }

    function Trend_TableCards() {

        let useStyle = '';
        let useValue = '';

        let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
        if(topDiv) {
            let div = document.createElement('div');
            div.className = 'MTTrendsContainer aMVqz';
            topDiv.prepend(div);
            topDiv = cec('div','MTFlexContainer',div,'','','gap','gutter');
            if(CD_V[1] == 0) {
                CD_V[1] = CD_V[4];
                CD_T[1] = 'Spent most in\n' + CD_T[4] + '\nthis period';
            }

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
            let div = cec('div',css_styles.items1,div2);
            let hed = cec('div',css_styles.items2,div);
            let cht = cec('div',css_styles.items3,hed);

            div = cec('div','CardHeader__Title hhcshL',cht);
            div = cec('div','FlexContainer__Root jEeSYR fKLqRU',div);

            div2 = cec('span','MTTrendSmall',div,'Net Income Trend Report');
            div2 = cec('a','MTTrendBig MThRefClass',div,TrendQueueTitle,'{TrendEOM');
            if(getCookie('MT_TrendFullPeriod') == 1) {
                div2 = cec('span','MTTrendSmall',div,'* Comparing to End of Month','','style','font-size: 10px;');
            }

            let tbs = cec('span','MTTrendButtons',cht);

            div2 = document.createElement('button');
            div2.textContent = 'Export';
            div2.className = 'MTTrendExport ' + css_styles.button;
            tbs.appendChild(div2);
            div2.addEventListener('click',MenuReportsTrendExport,false);

            div2 = document.createElement('button');
            let tl = ['By Last Month','By Same Month', 'By Same Quarter'];
            div2.textContent = tl[TrendQueueByPeriod];
            div2.className = 'MTTrendPeriod ' + css_styles.button;
            tbs.appendChild(div2);
            div2.addEventListener('click', () => {
                flipCookie('MTTrendPeriod',2);
                MenuReportsTrendsGo();
            });
            div2 = document.createElement('button');
            tl = ['By group','By category'];
            div2.textContent = tl[TrendQueueByGroup];
            div2.className = 'MTTrendGroup ' + css_styles.button;
            tbs.appendChild(div2);
            div2.addEventListener('click', () => {
                flipCookie('MTTrendGroup',1);
                MenuReportsTrendsGo();
            });
            return hed;
        }
    }

    function Trend_TableGrid(InRow,inType,inGroup,inTitle,a,b,c,d,e,f,inRef,InRef2) {

        let useStyle = ['','',''];
        let useDiv = '';
        let useHref = [inRef,'','','','','','',InRef2];
        let useCss = '';

        let el = null;

        switch (inType) {
            case 1:
                el = cec('div',css_styles.items3,InRow,'','','style','font-size: 16px; font-weight:500; position: sticky; top: 0; background-color:' + css_styles.background);
                break;
            case 2:
                el = cec('div',css_styles.items3,InRow,'','','style','font-size: 16px; font-weight:500;');
                break;
            default:
                el = cec('div',css_styles.item,InRow);
                break;
        }

        if(inType > 1) {
            useStyle[1] = Trend_GetColor(inGroup,c);
            useStyle[2] = Trend_GetColor(inGroup,f);
            let aa = addPercent(inType,inGroup,0,a);
            let bb = addPercent(inType,inGroup,1,b);
            let dd = addPercent(inType,inGroup,2,d);
            let ee = addPercent(inType,inGroup,3,e);
            let ff = Trend_addCellPercent(a,b);
            let gg = Trend_addCellPercent(d,e);
            a = getDollarValue(a) + aa;
            b = getDollarValue(b) + bb;
            c = getDollarValue(c) + ff[0];
            d = getDollarValue(d) + dd;
            e = getDollarValue(e) + ee;
            f = getDollarValue(f) + gg[0];
            useCss = 'MTTrendCell2';
            if(inGroup == 'expense') { useStyle[2] = useStyle[2] + gg[1];}
        } else {
            for (let i = 1; i < 7; i++) {
                useHref[i] = '{Trend:' + i.toString();
            }
            useCss = 'MThRefClass';
        }
        if(useHref[0]) {useDiv = 'a';} else {useDiv = 'span';}
        let elx = cec(useDiv,'MTTrendCell',el,inTitle,useHref[0],'style','text-align: left; width: 16%;'+ useStyle[0]);
        elx = cec('span',useCss,el,a,useHref[1],'style','width: 13%;');
        elx = cec('span',useCss,el,b,useHref[2],'style','width: 13%;');
        elx = cec('span',useCss,el,c,useHref[3],'style','width: 14%;'+ useStyle[1]);
        elx = cec('span',useCss,el,d,useHref[4],'style','width: 13%;');
        elx = cec('span',useCss,el,e,useHref[5],'style','width: 13%;');
        elx = cec('span',useCss,el,f,useHref[6],'style','width: 14%;'+ useStyle[2]);
        if(inType == 3) {
            elx = cec('button','MTTrendCellArrow',el,'',useHref[7],'','');
            elx = cec('span','',elx,'','','','');
        } else { elx = cec('span','',el,' ','','style','width: 26px;'); }
        if(inType == 2) {
            return cec('div',css_styles.row,InRow);
        }
        return InRow;
    }

    function addPercent(inType,inGroup,ndx,inAmount) {

        let lit = '';
        if(css_styles.hidePercent1 != '1') {
            if(inType == 3 && inGroup == 'expense') {
                if(CE[ndx] > 0 && inAmount > 0) {
                    lit = (inAmount / CE[ndx]) * 100;
                    lit = Math.round(lit * 10) / 10;
                    lit = ' (' + lit.toFixed(1) + '%)';
                }
            }
            if(inType == 3 && inGroup == 'income') {
                if(CI[ndx] > 0 && inAmount > 0) {
                    lit = (inAmount / CI[ndx]) * 100;
                    lit = Math.round(lit * 10) / 10;
                    lit = ' (' + lit.toFixed(1) + '%)';
                }
            }
            if(inGroup == 'savings') {
                if(CI[ndx] > 0) {
                    lit = (inAmount / CI[ndx]) * 100;
                    lit = Math.round(lit * 10) / 10;
                    lit = ' (' + lit.toFixed(1) + '%)';
                } else {
                    lit = ' (0%)';
                }
            }
        }
        return lit;
    }

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
                    // cards
                    wv = TrendQueue[i].N_CURRENTM - TrendQueue[i].N_LASTM;
                    if((CD_V[0] == 0 && wv < 0) || wv < CD_V[0]) {
                        CD_V[0] = wv;
                        CD_T[0]= TrendQueue[i].DESC;
                    }
                    if((CD_V[1] == 0 && wv > 0) || wv > CD_V[1]) {
                        CD_V[1] = wv;
                        CD_T[1]= TrendQueue[i].DESC;
                    }
                    if(TrendQueue[i].N_CURRENTM > CD_V[4]) {
                        CD_V[4] = TrendQueue[i].N_CURRENTM;
                        CD_T[4]= TrendQueue[i].DESC;
                    }
                }
            }
        }
        SM[5] = SM[3] - SM[2];
        SM[4] = SM[1] - SM[0];

        if(inGroup == 'savings') {
            CD_V[3] = SM[5];
            CD_V[2] = CE[0] - CE[1];

            if(SM[5] >= 0) { CD_T[3] = 'Saved more than\nlast year'; } else { CD_T[3] = 'Saved less than\nlast year'; }
            if(CD_V[2] <= 0) { CD_T[2] = 'Spent more than\n' + TrendQueueShortTitle; } else { CD_T[2] = 'Spent less than\n' + TrendQueueShortTitle; }

            for (let i = 0; i < 2; i++) {
                if(CD_V[i] <= 0) {
                    CD_T[i] = 'Spent less in\n' + CD_T[i];
                } else {
                    CD_T[i] = 'Spent more in\n' + CD_T[i];
                }
                CD_T[i] = CD_T[i] + ['\nthis month','\nsame time last year','\ncompared to ' + TrendQueueShortTitle][TrendQueueByPeriod];
            }


        }
        for (let i = 0; i < 6; i++) {
            SM[i] = SM[i].toFixed(2);
            SM[i] = Number(SM[i]);
        }
        return Trend_TableGrid(inRow,inType,inGroup,inTitle,SM[0],SM[1],SM[4],SM[2],SM[3],SM[5],'','');
    }

    function Trend_DumpData(inRow,inType,inGroup) {

        let row = inRow;
        let hr = ['category-groups','categories'][TrendQueueByGroup];
        for (let i = 0; i < TrendQueue.length; i++) {
            if(TrendQueue[i].TYPE == inGroup) {
                row = Trend_TableGrid(row,3,inGroup,TrendQueue[i].ICON + ' ' + TrendQueue[i].DESC,TrendQueue[i].N_LASTM,TrendQueue[i].N_CURRENTM,TrendQueue[i].N_DIFFM,TrendQueue[i].N_LAST,TrendQueue[i].N_CURRENT,TrendQueue[i].N_DIFF,'/' + hr + '/' + TrendQueue[i].ID,'{Hstry/' + hr + '/' + TrendQueue[i].ID);
            }
        }
        return row;
    }

    function Trend_GetColor(inGroup,inAmount, inRed) {

        let useStyle = '';
        if(inGroup == 'income' || inGroup == 'savings') {
            if(inAmount >= 0) { useStyle = css_green; }
        } else {
            if(inAmount <= 0) { useStyle = css_green; }
        }
        if(useStyle == '' && inRed == true) {useStyle = css_red;}
        return useStyle;
    }

    function MenuReportsTrendExport() {

        const CRLF = String.fromCharCode(13,10);
        const c = ',';
        let csvContent = '';

        csvContent = csvContent + 'Trends Report - ' + getDates('Today') + c + TrendQueueCol.join(c) + CRLF;

        let types = ['income','expense'];
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

        downloadFile('Monarch Trends ' + getDates('today'),csvContent);
    }
}

function MenuReportsHistory(inParms) {

    let topDiv = document.getElementById('root');
    if(topDiv) {

        const parmsA = inParms.split("/");
        const lowerDate = new Date("2022-01-01");
        const higherDate = new Date();

        let retGroups = getCategoryGroup(parmsA[2]);
        let inGroup = 1;

        topDiv = topDiv.childNodes[0];
        let div = cec('div','MTHistoryPanel',topDiv,'','','','');
        let div2 = cec('div','MTSideDrawerRoot',div,'','','tabindex','0');
        let div3 = cec('div','MTSideDrawerContainer',div2,'','','','');
        let div4 = cec('div','MTSideDrawerMotion',div3,'','','grouptype',parmsA[1]);
        div4.setAttribute('cattype',retGroups.TYPE);
        div = cec('span','MTSideDrawerHeader',div4,'','','','');
        div2 = cec('button','MTTrendCellArrow',div,'','','style','float:right;');
        if(parmsA[1] == 'category-groups') {
            div2 = cec('button','MTTrendCellArrow2',div,['',''][getCookie('MTC_div.TrendHistoryDetail',true)],'','style','float:right;');
        }
        div2 = cec('div','MTTrendBig',div,'Monthly Summary');
        div = cec('span','MTSideDrawerHeader',div4,'','','','');
        div2 = cec('div','MTTrendSmall',div, retGroups.TYPE,'','style','float:right;');

        if(parmsA[1] == 'category-groups') {
            div2 = cec('a','MThRefClass',div,retGroups.ICON + ' ' + retGroups.GROUPNAME ,'/' + parmsA[1] + '/' + retGroups.GROUP ,'','' );
            inGroup = 2;
        } else {
            div2 = cec('a','MThRefClass',div,retGroups.ICON + ' ' + retGroups.GROUPNAME + ' / ' + retGroups.NAME,'/' + parmsA[1] + '/' + retGroups.ID,'','' );
        }

        TrendQueue2 = [];
        BuildTrendData('hs',inGroup,'month',lowerDate,higherDate,parmsA[2]);

    }
}

function MenuReportsHistoryDraw() {

    let sumQue = [];
    let detailQue = [];
    const os = 'text-align:left; font-weight: 600;';
    const os2 = 'font-weight: 600;';
    const os3 = 'text-align:left; font-weight: 200; font-size: 12px;';
    const os4 = 'margin-bottom: 10px; line-height: 10px !important; display: ' + getDisplay(getCookie('MTC_div.TrendHistoryDetail',true),'');
    const startYear = Number(getDates('n_CurYear') - 2);
    const curYear = Number(getDates('n_CurYear'));
    const curMonth = Number(getDates('n_CurMonth'));
    let curYears = 1;
    let skiprow = false;
    let inGroup = 1;
    let useArrow = 0;
    let c_r = 'red';
    let c_g = 'green';

    let topDiv = document.querySelector('div.MTSideDrawerMotion')
    if(topDiv) {
        if(topDiv.getAttribute("grouptype") == 'category-groups') { inGroup = 2;}
        if(topDiv.getAttribute("cattype") == 'income') { c_g = 'red'; c_r = 'green'; }
        let div = cec('div','MTSideDrawerHeader',topDiv,'','','','');

        for (let i = 0; i < 12; i++) {
            sumQue.push({"MONTH": i,"YR1": MTHistoryDraw(i+1,startYear),"YR2": MTHistoryDraw(i+1,startYear + 1),"YR3": MTHistoryDraw(i+1,startYear + 2)});
        }

        if(startYear < getCookie('MT_LowCalendarYear')) {skiprow = true;}

        let div2 = cec('div',css_styles.item,div,'','','style',os2);
        let div3 = cec('span','MTSideDrawerDetail',div2,'Month','','style',os);
        for (let j = startYear; j <= curYear; j++) {
            if(skiprow == false || j > startYear) {
                div3 = cec('span','MTSideDrawerDetail',div2,j,'','','');
            }
        }

        div3 = cec('span','MTSideDrawerDetail3',div2,'','','','');
        div3 = cec('span','MTSideDrawerDetail',div2,'Average for Month','','','');
        div2 = cec('div',css_styles.item,div,'','','style',os2);
        div3 = cec('span','MTSpacerClass',div2,'','','','');

        let T = ['Total',0,0,0,0];

        for (let i = 0; i < 12; i++) {
            if(i > 0 && i == curMonth) {
                div2 = cec('div',css_styles.item,div,'','','style',os2);
                div3 = cec('span','MTSpacerClass',div2,'','','','');
            }
            if(sumQue[i].YR2 == sumQue[i].YR3){
                useArrow = 2;}
            else {
                if(i >= curMonth) {
                    if(sumQue[i].YR3 > sumQue[i].YR2) {useArrow = 0;} else {useArrow = 2;}
                } else {
                    if(sumQue[i].YR3 > sumQue[i].YR2) {useArrow = 0;} else {useArrow = 1;}
                }
            }
            div2 = cec('div',css_styles.item,div,'','','','');
            if(sumQue[i].YR1 != 0) {curYears = 3;}
            if(curYears < 3) {
                if(sumQue[i].YR2 != 0) {curYears = 2;}
            }
            div3 = cec('span','MTSideDrawerDetail',div2,getMonthName(i,true),'','style',os);
            if(skiprow == false) {div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue(sumQue[i].YR1),'','','');}
            div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue(sumQue[i].YR2),'','','');
            div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue(sumQue[i].YR3),'','','');
            div3 = cec('span','MTSideDrawerDetail3',div2,['','',' '][useArrow],'','style','color: ' + [c_r,c_g][useArrow]);

            if(i < curMonth) {
                div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue((sumQue[i].YR1 + sumQue[i].YR2 + sumQue[i].YR3) / curYears),'','','');
            } else {
                div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue((sumQue[i].YR1 + sumQue[i].YR2)/(curYears-1)),'','','');
            }
            T[1] = T[1] + sumQue[i].YR1;
            T[2] = T[2] + sumQue[i].YR2;
            T[3] = T[3] + sumQue[i].YR3;

            if(inGroup == 2) { MTHistoryDrawDetail(i+1,div); }
        }
        let tot = T[1]+T[2]+T[3];
        if(tot != 0) { T[4] = tot / curYears; }

        div2 = cec('div',css_styles.item,div,'','','style',os2);
        div3 = cec('span','MTSpacerClass',div2,'','','');
        div2 = cec('div',css_styles.item,div,'','','style',os2);

        div3 = cec('span','MTSideDrawerDetail',div2,T[0],'','style',os);
        for (let i = 1; i < 5; i++) {
            if(skiprow == false || i > 1) {
                div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue(T[i]),'','','');
            }
        }
        div = cec('div','MTSideDrawerHeader',topDiv,'','','','');
        div2 = cec('div','MTlink',div,'Download CSV','','style','padding: 0px; display:block; text-align:center;');
    }

    function MTHistoryDraw(inMonth,inYear) {

        let ms = '0' + inMonth.toString();
        ms = ms.slice(-2);
        let ys = inYear.toString();
        let amt = 0.00

        for (let i = 0; i < TrendQueue2.length; i++) {
            if(TrendQueue2[i].MONTH == ms && TrendQueue2[i].YEAR == ys) {
                amt = amt + TrendQueue2[i].AMOUNT;
            }
        }
        return amt;
    }

    function MTHistoryDrawDetail(inMonth,inDiv) {

        let ms = '0' + inMonth.toString();
        detailQue = [];
        ms = ms.slice(-2);

        for (let i = 0; i < TrendQueue2.length; i++) {
            if(TrendQueue2[i].MONTH == ms ) {
                let result = MTHistoryFind(TrendQueue2[i].DESC);
                if(TrendQueue2[i].YEAR == startYear) { detailQue[result].YR1 = TrendQueue2[i].AMOUNT;}
                if(TrendQueue2[i].YEAR == startYear+1) { detailQue[result].YR2 = TrendQueue2[i].AMOUNT;}
                if(TrendQueue2[i].YEAR == startYear+2) { detailQue[result].YR3 = TrendQueue2[i].AMOUNT;}
            }
        }

        detailQue.sort((a, b) => b.YR3 - a.YR3 || b.YR2 - a.YR2);

        for (let i = 0; i < detailQue.length; i++) {
            let div2 = cec('div','TrendHistoryDetail ' + css_styles.item,inDiv,'','','style',os4);
            let div3 = cec('span','MTSideDrawerDetail2',div2,' ' + detailQue[i].DESC,'','style',os3);
            if(skiprow == false) {div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue(detailQue[i].YR1),'','','');}
            div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue(detailQue[i].YR2),'','','');
            div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue(detailQue[i].YR3),'','','');
            div3 = cec('span','MTSideDrawerDetail3',div2,'','','','');
            if(i < curMonth) {
                div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue((detailQue[i].YR1 + detailQue[i].YR2 + detailQue[i].YR3) / curYears),'','','');
            } else {
                div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue((detailQue[i].YR1 + detailQue[i].YR2)/(curYears-1)),'','','');
            }
        }
        let div2 = cec('div','TrendHistoryDetail ' + css_styles.item,inDiv,'','','style',os4);
    }

    function MTHistoryFind(inDesc) {

         for (let i = 0; i < detailQue.length; i++) {
             if(detailQue[i].DESC == inDesc) {
                 return(i);
             }
         }
        detailQue.push({"DESC": inDesc,"YR1": 0,"YR2": 0,"YR3": 0});
        return detailQue.length-1;
    }
}

function MenuReportsHistoryExport() {

    const CRLF = String.fromCharCode(13,10);
    const c = ',';
    let csvContent = '';

    const spans = document.querySelectorAll('span.MTSideDrawerDetail' + [',span.MTSideDrawerDetail2',''][getCookie('MTC_div.TrendHistoryDetail',true)]);

    let j = 0;
    let Cols = 0;

    spans.forEach(span => {
        j=j+1;
        if(Cols == 0) {
            if(span.innerText.startsWith('Average')) { Cols = j;}
        }
        csvContent = csvContent + getCleanValue(span.innerText,2);
        if(j == Cols) {
            j=0;
            csvContent = csvContent + CRLF;
        } else {
            csvContent = csvContent + c;
        }
    });

    downloadFile('Monarch Trends History ' + getDates('today'),csvContent);
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
        }
        MenuFilter_AddItem(eID,'div','','','|');
        for (var i = 0; i < rnames.length; i++) {
            MenuFilter_AddItem(eID,'a','href','#' + rnames[i],rnames[i].substring(4));
        }
        r_FilterD = true;
    } else
    {
        r_FilterD = false;
    }
}

function MenuFilter_AddItem(p,a,b,c,d) {

    let divI = document.createElement(a);
    if(b) {divI.setAttribute(b,c);}
    if(d) {divI.innerText = d;}
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
    if(ii < 2000) {ii = 2000;}
    ii -= 2000;
    for (let i = 0; i < ii; i++) {
        InList.removeChild(InList.firstChild);
    }
}

const MM_FixCalendarCallback = (mutationList, observer) => {

    r_DatePickerActive = r_DatePickerActive? false : true;

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
                }
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
                }
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
                }
            });
        }
    }
};

// [ Breadcrumbs ]
function MenuReportBreadcrumbListener() {

    if (SaveLocationPathName.endsWith('/income') || SaveLocationPathName.endsWith('/spending')) {
        if(getCookie("MT_ReportsDrilldown") == 1) {
            if(r_eventListener == null) {
                r_eventListener = window.addEventListener('click', event => {
                    const cl = event.target.parentNode;
                    if(cl) {
                        const CheckLegend = cl.attributes[0].value;
                        if(CheckLegend) {
                            if(CheckLegend.includes("PieChartWithLegend") == true) {
                                event.stopImmediatePropagation();
                                event.stopPropagation();
                                event.preventDefault();
                                const parentAsearch = cl.parentNode.parentNode.search;
                                r_spawn = -1;
                                MenuReportBreadcrumbGo(parentAsearch);
                            }
                        }
                    }
                }, true);
            }
        }
    }
    buildCategoryGroups();
}

function MenuReportBreadcrumbGo(Parms) {

    if(getCookie("MT_ReportsDrilldown",true) == 0) {return;}

    let bcl = '';
    let retGroups = [];

    retGroups.GROUPNAME = '';
    retGroups.GROUP = '';
    retGroups.ID = '';
    retGroups.TYPE = '';

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
                            if(bcl == '1') { newStoredStr = newStoredStr + ',';}
                            bcl = '1';
                            newStoredStr = newStoredStr + '\\"' + accountGroups[i].ID + '\\"';
                            retGroups.GROUPNAME = accountGroups[i].GROUPNAME;
                            retGroups.GROUP = accountGroups[i].GROUP;
                            retGroups.ID = accountGroups[i].ID
                            retGroups.TYPE = accountGroups[i].TYPE;
                        }
                    }
                } else
                {
                    newStoredStr = newStoredStr + '\\"' + categories + '\\"';
                    bcl = '2';
                    retGroups = getCategoryGroup(categories);
                }

                newStoredStr = newStoredStr + ']' + storedStr.substring(x);
                newStoredStr = newStoredStr.replace('"category_group','"category');

                localStorage.setItem("persist:reports", newStoredStr);
                localStorage.setItem("persist:breadcrumb",retGroups.GROUP + '/:/' + retGroups.GROUPNAME + '/:/' + bcl + '/:/' + retGroups.NAME + '/:/' + retGroups.TYPE );

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
                retGroups.GROUP = GroupStuff[0];
                retGroups.GROUPNAME = GroupStuff[1];
                bcl = GroupStuff[2];
                retGroups.NAME = GroupStuff[3];
                retGroups.TYPE = GroupStuff[4];
                if((retGroups.TYPE == 'income' && SaveLocationPathName.includes("spending")) || (retGroups.TYPE == 'expense' && SaveLocationPathName.includes("income")) ) {
                    return;
                }
            }

            if(retGroups.GROUP) {
                if(bcl == '2') {
                    let bc = document.createElement('button');
                    bc.className = 'MTlink';
                    bc.innerText = retGroups.GROUPNAME + ' »';
                    div.prepend(bc);
                    bc.addEventListener('click', () => {
                        window.location.replace(SaveLocationPathName + '?categoryGroups=' + retGroups.GROUP);
                    });
                } else
                {
                    let bc = document.createElement('span');
                    bc.className = 'MTlink2';
                    bc.innerText = '/ ' + retGroups.GROUPNAME;
                    div.prepend(bc);
                }
            }

            if(document.querySelector('button.MTlink3') == null) {
                let bc3 = document.createElement('button');
                bc3.className = 'MTlink3';
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
                if(sb) { div2.className = sb.className; }
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
            r_Init == false;
        }
    }
}

function MenuDisplay(OnFocus) {

    if (SaveLocationPathName.startsWith('/settings/display')) {
        if(OnFocus == false) {
            if(r_Init == false) {
                window.location.replace(window.location.pathname);
            }
        }
        if(OnFocus == true) {
            MenuDisplay_Input(GM_info.script.name + ' - ' + GM_info.script.version,'','header');
            MenuDisplay_Input('Lowest Calendar/Data year','MT_LowCalendarYear','number');
            MenuDisplay_Input('','','spacer');
            MenuDisplay_Input('Menu - Hide Budget','MT_Budget','checkbox');
            MenuDisplay_Input('Menu - Hide Recurring','MT_Recurring','checkbox');
            MenuDisplay_Input('Menu - Hide Goals','MT_Goals','checkbox');
            MenuDisplay_Input('Menu - Hide Investments','MT_Investments','checkbox');
            MenuDisplay_Input('Menu - Hide Advice','MT_Advice','checkbox');
            MenuDisplay_Input('Menu - Hide Monarch Ads','MT_Ads','checkbox');
            MenuDisplay_Input('','','spacer');
            MenuDisplay_Input('Accounts - Hide Accounts Net Worth Graph panel','MT_HideAccountsGraph','checkbox');
            MenuDisplay_Input('Transactions - Transactions panel has smaller compressed grid','MT_CompressedTx','checkbox');
            MenuDisplay_Input('Transactions - Show Pending Transactions in red (Preferences / "Allow Pending Edits" must be off)','MT_PendingIsRed','checkbox');
            MenuDisplay_Input('Transactions - Hide Create Rule pop-up','MT_HideToaster','checkbox');
            MenuDisplay_Input('Reports - Add drill-down & breadcrumbs for Groups to Categories in Income/Spending','MT_ReportsDrilldown','checkbox');
            MenuDisplay_Input('Reports - Hide chart tooltip Difference amount','MT_HideTipDiff','checkbox');
            MenuDisplay_Input('Reports / Trends - Always compare to End of Month','MT_TrendFullPeriod','checkbox');
            MenuDisplay_Input('Reports / Trends - Hide percentage of Income & Spending','MT_TrendHidePer1','checkbox');
            MenuDisplay_Input('Reports / Trends - Hide percentage of Difference','MT_TrendHidePer2','checkbox');
            MenuDisplay_Input('Budget - Add YTD Total & Projected Total to Forecast / Monthly','MT_PlanYTD','checkbox');
            MenuDisplay_Input('Budget - Panel has smaller compressed grid','MT_PlanCompressed','checkbox');
            MenuDisplay_Input('General - Calendar "Last year" and "Last 12 months" include full month','MT_CalendarEOM','checkbox');
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
            if(OldValue == 1) {e2.checked = 'checked';}
            e1.appendChild(e2);
            e2.addEventListener('change', () => {
                flipCookie(inCookie,1);
                r_Init = false;
                MM_Init();
                r_Init = false;
            });
            e3 = document.createTextNode('  ' + inValue);
            e2.parentNode.insertBefore(e3, e2.nextSibling);
        }
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
                r_Init = false;
            });
        }
    }
}

// [ Plan & Budget ]
function MenuPlan(OnFocus) {

    if (SaveLocationPathName.startsWith('/plan')) {
        if(getCookie("MT_PlanYTD") == 1) {
            if(OnFocus == false) { r_PlanGridActive = false; }
            if(OnFocus == true) { r_PlanGridActive = true; }
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

    if(getCookie("MT_Goals") == 1) {
        let div = document.querySelectorAll('[class*="PlanSectionHeader__Root"]');
        if(div.length > 2) {
            div[2].style = 'display: ' + getDisplay(1,'block;');
            div = div[2].nextSibling;
            div.style = 'display: ' + getDisplay(1,'block;');
            div = div.nextSibling;
            div.style = 'display: ' + getDisplay(1,'block;');
        }
    }

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

                if(useValue == '') {useValue = '$0';}
                cellValue = Number(getCleanValue(useValue,0));
                pivotCount+=1;

                // check totals finished
                if(pivotCount == 1) { JanValue = useValue; }
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
                }

                if(pivotCount == month) {
                    if(isNaN(rowValue)) {
                        clonedNodeYTD.innerText = '-';
                    } else {
                        clonedNodeYTD.innerText = getDollarValue(rowValue);
                    }
                    el.insertAdjacentElement('afterend', clonedNodeYTD);
                }

                if(pivotCount == 12) {
                    if(isNaN(rowValue)) {
                        clonedNodeProj.innerText = '-';
                    } else {
                        clonedNodeProj.innerText = getDollarValue(rowValue);
                    }
                    el.insertAdjacentElement('afterend', clonedNodeProj);
                    pivotCount = 0;
                    rowValue = 0;
                }
            }
        }
    }

    r_PlanGridActive = pending;
}

function MenuCheckSpawnProcess() {

    if(r_DatePickerActive == true) {
        MM_FixCalendarYears();
    }
    if(r_TrendsActiveReady == true) {
        r_TrendsActiveReady = false;
        MenuReportsTrendsDraw(null);
    }
    if(r_TrendsActiveReady == 2) {
        r_TrendsActiveReady = false;
        MenuReportsHistoryDraw();
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

    const cn = event.target.className;
    const pcn = event.target.parentNode.className;

    // ======================================================
    // console.log(cn,pcn,event.target,event.target.parentNode);

    switch (cn) {
        case 'MTSideDrawerRoot':
            removeAllSections('div.MTSideDrawerRoot');
            break;
        case 'MTTrendCellArrow':
            if(pcn == 'MTSideDrawerHeader') {removeAllSections('div.MTSideDrawerRoot');}
            break;
        case 'MTTrendCellArrow2':
            flipAllSections('div.TrendHistoryDetail');
            event.target.innerText = ['',''][getCookie('MTC_div.TrendHistoryDetail',true)];
            break;
        case 'MTlink':
            if(pcn == 'MTSideDrawerHeader') {MenuReportsHistoryExport();}
            break;
        case 'MTTrendCell':
            if(pcn.startsWith('Trend_CardHeader')) {
                setCookie('MTTrendSort',0);
                MenuReportsTrendsDraw(true);
            }
            break;
    }

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
                            MenuFilter_Restore(cn);
                            break;
                    }
                }
            }
        }
    }
};

function cec(e,c,r,it,hr,a1,a2) {

    let el = '';
    let div = document.createElement(e);

    if(it) {div.innerText = it;}
    if(hr) {
        if(hr[0] == '{') {
            el = hr.substring(1);
        } else {
            div.href = hr;
        }
    }
    if(c) {div.className = c;}
    if(a1) {div.setAttribute(a1,a2);}
    const x = r.appendChild(div);
    if(el) { div.addEventListener("click", function () { cecHandler(el); }); }
    return x;
}

function cecHandler(el) {

    if(el.startsWith('Trend:') == true) {
        let elSelected = el.substring(6);
        let elCurrent = getCookie('MTTrendSort',true);
        if(Math.abs(elCurrent) == Math.abs(elSelected)) {
            elSelected = elCurrent * -1;
        }
        setCookie('MTTrendSort',elSelected);
        MenuReportsTrendsDraw(true);
    }
    if(el =='TrendEOM') {
        if(TrendTodayIs.getMonth() == getDates('n_CurMonth') && TrendTodayIs.getDate() == getDates('n_CurDay') && TrendTodayIs.getFullYear() == getDates('n_CurYear')) {
            TrendTodayIs = getDates('d_EndofLastMonth');

        } else {
            TrendTodayIs = getDates('d_CurDate');
        }
        MenuReportsTrendsGo();
       }
    if(el.startsWith('Hstry/') == true) {
        MenuReportsHistory(el);
    }
}

function removeAllSections(inDiv) {

    const divs = document.querySelectorAll(inDiv);
    for (let i = 0; i < divs.length; ++i) {
        divs[i].remove();
    }
}

function flipAllSections(inDiv) {

    flipCookie('MTC_' + inDiv,1);
    const cv = getCookie('MTC_' + inDiv,true);
    MM_hideElement(inDiv,cv)
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

function getMonthName(inValue,inShort) {

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if(inShort != null && inShort == true) {
        return months[inValue].substring(0,3);
    } else
    {
        return months[inValue];
    }
}

function getDates(InValue,InDate) {

    let d = null;
    if(InDate) {
        d = new Date(InDate);
    } else {
        d = new Date();
    }
    let month = d.getMonth();
    let day = d.getDate();
    let year = d.getFullYear();

    if(InValue == 'n_CurYear') {return(year);}
    if(InValue == 'n_CurMonth') {return(month);}
    if(InValue == 'n_CurDay') {return(day);}
    if(InValue == 'd_CurDate') {return d;};

    if(InValue == 'Today') {
    } else {
        d.setDate(1);day = 1;
        switch (InValue) {
            case 'd_EndofLastMonth':
                month-=1;
                if(month < 0) {
                    month = 11;
                    year-=1;
                }
                day = daysInMonth(month,year);
                d.setFullYear(year, month, day);
                return(d);
            case 'LastYTDs':
                year-=1;
                month = 0;
                break;
            case '12Mths':
                year-=1;
                if(getCookie('MT_CalendarEOM') == 1) { day = 1; } else {day = d.getDate();}
                break;
            case 'LastYTDe':
                year-=1;
                if(getCookie('MT_CalendarEOM') == 1) {day = daysInMonth(month,year); }
                break;
            case 'ThisQTRs':
                if(month < 3) {month = 0;}
                if(month == 4 || month == 5) {month = 3;}
                if(month == 7 || month == 8) {month = 6;}
                if(month == 10 || month == 11) {month = 9;}
                break;
            case 'ThisQTRe':
                if(month < 2) {month = 2;}
                if(month == 3 || month == 4) {month = 5;}
                if(month == 6 || month == 7) {month = 8;}
                if(month == 9 || month == 10) {month = 11;}
                day = daysInMonth(month,year)
                break;
        }
    }
    month+=1;
    const FullDate = [("0" + month).slice(-2),("0" + day).slice(-2),year].join('/');
    return(FullDate);
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

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function findButton(inValue,inName) {

    let useTarget = null;
    const div=document.querySelectorAll('button');

    div.forEach((li)=> {
        if(useTarget == null) {
            if(inValue != '' && li.textContent.substring(0,1) == inValue) {
                useTarget = li;
                return useTarget;
            }
            if(inName != '' && inName == li.innerText) {
                useTarget = li;
                return useTarget;
            }
        }
    } );

    return useTarget;
}

function getCleanValue(inValue,inDec) {

    if(inValue.startsWith('$') || inValue.startsWith('-')) {
        const AmtStr = inValue.replace(/[$,]+/g,"");
        let Amt = Number(AmtStr);
        if(inDec > 0) {Amt = Amt.toFixed(inDec);}
        return Amt;
    }
    else {
        return inValue;
    }
}

function getDollarValue(InValue) {
    if(InValue === -0 || isNaN(InValue)) {InValue = 0;}
    return InValue.toLocaleString("en-US", {style:"currency", currency:css_currency});
}

function downloadFile(inTitle,inData) {
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + inData);
    const link = cec('a','',document.body,'',encodedUri,'download',inTitle + '.csv');
    link.click();
    document.body.removeChild(link);
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
    if(isNum == true) {return 0;}
    return '';
}

function deleteCookie(cName) {
    document.cookie = cName + "= ;expires=31 Dec 2000 23:59:59 GMT; path=/" ;
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

function getDisplay(InA,InB) {
    if(InA == 1) {return 'none;';} else {return InB;}
}

function getStyle() {
    const cssObj = window.getComputedStyle(document.querySelector('[class*=Page__Root]'), null);
    const bgColor = cssObj.getPropertyValue('background-color');
    if (bgColor === 'rgb(8, 32, 67)') { css_styles.background = '#0d2c5c';return 0; } else {css_styles.background = '#ffffff';return 1;}
}

(function() {

    setInterval(() => {

        if(r_spawn > -1) {
            if(window.location.pathname != SaveLocationPathName) {

                // Lose Focus on a page
                if(SaveLocationPathName) {
                    MenuLogin(false);
                    MenuReports(false);
                    MenuDisplay(false);
                    MenuTransactions(false);
                    MenuPlan(false);
                }

                if(r_Init == false) {
                    MM_Init();
                    r_Init = true;
                }

                SaveLocationPathName = window.location.pathname;
                SaveLocationHRefName = window.location.href;

                // Gain Focus on a Page
                MenuReports(true);
                MenuDisplay(true);
                MenuTransactions(true);
                MenuPlan(true);
            }

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

async function getMonthlySnapshotData2(startDate, endDate,groupingType) {
  const options = callGraphQL({
    operationName: 'GetAggregatesGraph',
    variables: {startDate: startDate, endDate: endDate, },
      query: "query GetAggregatesGraph($startDate: Date, $endDate: Date) {\n aggregates(\n filters: { startDate: $startDate, endDate: $endDate }\n groupBy: [\"category\", \"" + groupingType + "\"]\n  fillEmptyValues: false\n ) {\n groupBy {\n category {\n id\n }\n " + groupingType + "\n }\n summary {\n sum\n }\n }\n }\n"
      });

  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    }).catch((error) => { console.error(GM_info.script.version,error); });
}

async function getMonthlySnapshotData(startDate, endDate, groupingType) {
    const options = callGraphQL({
    operationName: 'GetAggregatesGraphCategoryGroup',
    variables: {startDate: startDate, endDate: endDate, },
      query: "query GetAggregatesGraphCategoryGroup($startDate: Date, $endDate: Date) {\n aggregates(\n filters: { startDate: $startDate, endDate: $endDate }\n groupBy: [\"categoryGroup\", \"" + groupingType + "\"]\n fillEmptyValues: false\n ) {\n groupBy {\n categoryGroup {\n id\n }\n " + groupingType + "\n }\n summary {\n sum\n }\n }\n }\n"
      });

  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    }).catch((error) => { console.error(GM_info.script.version,error); });
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
    }).catch((error) => { console.error(GM_info.script.version,error); });
}

async function buildCategoryGroups() {

    if(accountGroups.length == 0) {
        const categoryData = await getCategoryData();
        for (let i = 0; i < categoryData.categories.length; i += 1) {
            accountGroups.push({"GROUP": categoryData.categories[i].group.id, "GROUPNAME": categoryData.categories[i].group.name, "ID": categoryData.categories[i].id, "NAME": categoryData.categories[i].name, "ICON": categoryData.categories[i].icon, "TYPE": categoryData.categories[i].group.type, "ORDER": categoryData.categories[i].order});
        }
    }
}

function getCategoryGroup(InId) {

  for (let i = 0; i < accountGroups.length; i++) {
      if(accountGroups[i].ID == InId || accountGroups[i].GROUP == InId) {
          return accountGroups[i]
      }
  }
    return [null];
}
