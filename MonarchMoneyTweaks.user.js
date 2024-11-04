// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      2.00
// @description  Monarch Tweaks
// @author       Robert P
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// ==/UserScript==

const version = '2.00';
const css_currency = 'USD';
const css_green = 'color: #489d8c;';
const css_red = 'color: #ed5987;';
const graphql = 'https://api.monarchmoney.com/graphql';

let r_Init = false;
let SaveLocationHRefName = '';
let SaveLocationPathName = '';
let r_headStyle = null;
let r_DatePickerActive = false;
let r_PlanGridActive = false;
let r_DatasetActive = false;
let r_spawn = 0;
let r_eventListener = null;
let r_oo = null;
let r_oo2 = null;
let r_PlanYear = '';
let accountGroups = [];
let TrendTodayIs = new Date();
let TrendQueue = [];
let TrendQueue2 = [];

// flex container
const MTFields = 13;
let MTFlex = [];
let MTFlexTitle = [];
let MTFlexRow = [];
let MTFlexCard = [];
let MTFlexCR = 0;
let MTFlexDetails = null;
let MTFlexReady = false;
let MTP = null;

function MM_Init() {

    const a = getStyle();
    const a1 = 'background-color: ' + ['#0d2c5c;','#ffffff;'][a];
    const a2 = 'background-color: ' + ['#14457a;','#eaf6fd;'][a];
    const a3 = ['#263d5f','#e4e9f0'][a];
    const a4 = 'background: ' + ['#082043;','aliceblue;'][a];
    const a5 = 'color: ' + ['#FFFFFF;','#082864;'][a];

    addStyle('.MTPlanHeader {font-weight: 900; align-content: inherit; padding: 0px 0px 15px;}');
    addStyle('.MTPlanDetail {' + css_green + 'font-size: 16px; font-weight: 500;}');
    addStyle('.MTlink, .MTlink3 {background-color: transparent; color: rgb(50, 170, 240); font-weight: 500; font-size: 14px; cursor: pointer; border-radius: 4px; border-style: none; padding: 15px 1px 1px 16px; display:inline-block;}');
    addStyle('.MTlink2 {background-color: transparent; font-size: 14px; font-weight: 500; padding: 0px 0px 0px 16px;}');
    addStyle('.MTCheckboxClass {width: 20px; height: 20px;}');
    addStyle('.MTSpacerClass {padding: 1px 1px 1px 1px; width: 100%; line-height: 10px; border-bottom: 1px solid ' + a3 +';}');
    addStyle('.MThRefClass {' + a5 + '}');

    addStyle('.MTFlexButtonExport, .MTFlexButton1, .MTFlexButton2 {' + a1 + a5 + 'margin-left: 20px; font-weight: 500; border: 1px solid ' + a3 + '; box-shadow: rgba(8, 40, 100, 0.1) 0px 1px 2px; font-size: 14px; padding: 7.5px 12px;cursor: pointer;border-radius: 4px;line-height: 150%;}');
    addStyle('.MTFlexContainer {display:block; padding: 20px;}');
    addStyle('.MTFlexContainer2 {margin: 0px;  gap: 20px;  display: flex; }');
    addStyle('.MTFlexContainerPanel { display: flex; flex-flow: column; place-content: stretch flex-start; ' + a1 + 'border-radius: 8px; box-shadow: rgba(8, 40, 100, 0.04) 0px 4px 8px;}');
    addStyle('.MTFlexContainerCard {  display: flex; flex: 1 1 0%; justify-content: space-between; padding: 16px 24px; align-items: center;' + a1 + 'border-radius: 8px; box-shadow: rgba(8, 40, 100, 0.04) 0px 4px 8px;}');
    addStyle('.MTFlexGrid {' + a1 + 'padding: 20px;  border-spacing: 8px;}');
    addStyle('.MTFlexGrid th, td { padding-right: 8px;}');
    addStyle('.MTFlexTitle2 {display: flex; flex-flow: column;}');
    addStyle('.MTFlexGridTitleRow { font-size: 16px; font-weight: 500; height: 56px; position: sticky; top: 0; ' + a1 + '}');
    addStyle('.MTFlexGridTitleCell { border-bottom: 1px solid ' + a3 + ';}');
    addStyle('.MTFlexGridTitleCell2 { text-align: right; border-bottom: 1px solid ' + a3 + ';}');
    addStyle('.MTFlexGridTitleCell:hover, .MTFlexGridTitleCell2:hover, .MTFlexGridDCell:hover, .MTFlexGridSCell:hover, .MThRefClass:hover {cursor:pointer; color: rgb(50, 170, 240);}');
    addStyle('.MTFlexGridRow { font-size: 14px; font-weight: 500; height: 56px; }');
    addStyle('.MTFlexGridItem { font-size: 14px; ; height: 28px }');
    addStyle('.MTFlexGridHCell { }');
    addStyle('.MTFlexGridHCell2 { text-align: right; }');
    addStyle('.MTFlexGridDCell, .MTFlexGridD3Cell {' + a5 +' }');
    addStyle('.MTFlexGridDCell2 { text-align: right; }');
    addStyle('.MTFlexGridSCell,.MTFlexGridS3Cell { padding-bottom: 18px; vertical-align:top; height: 36px;' + a5 + ' font-weight: 500; border-top: 1px solid ' + a3 + ';}');
    addStyle('.MTFlexGridSCell2 { text-align: right; padding-bottom: 18px; vertical-align:top; height: 36px;' + a5 + ' font-weight: 500; border-top: 1px solid ' + a3 + ';}');
    addStyle('.MTFlexBig {font-size: 18px; font-weight: 500; padding-top: 8px;}');
    addStyle('.MTFlexSmall {font-size: 12px;font-weight: 600; padding-top: 8px; color: #919cb4; text-transform: uppercase; line-height: 150%; letter-spacing: 1.2px;}');
    addStyle('.MTFlexLittle {font-size: 10px;font-weight: 600; padding-top: 8px; color: #919cb4; text-transform: uppercase; line-height: 150%; letter-spacing: 1.2px;}');
    addStyle('.MTFlexCellArrow, .MTTrendCellArrow, .MTTrendCellArrow2 {' + a1 + a5 + 'width: 24px; height:24px; font-size: 16px; font-family: MonarchIcons, sans-serif; transition: 0.1s ease-out; cursor: pointer; border-radius: 100%; border-style: none;}');
    addStyle('.MTFlexCellArrow:hover {border: 1px solid ' + a4 + '; box-shadow: rgba(8, 40, 100, 0.1) 0px 1px 2px;}');

    addStyle('.MTSideDrawerRoot {position: absolute;  inset: 0px;  display: flex;  -moz-box-pack: end;  justify-content: flex-end;}');
    addStyle('.MTSideDrawerContainer {overflow: hidden; padding: 12px; width: 640px; -moz-box-pack: end; ' + a4 + ' position: relative; overflow:auto;}');
    addStyle('.MTSideDrawerMotion {display: flex; flex-direction: column; transform:none;}');
    addStyle('.MTSideDrawerHeader { ' + a5 + ' padding: 12px; }');
    addStyle('.MTSideDrawerItem { font-size: 14px;  margin-bottom: 10px;  place-content: stretch space-between;  display: flex;');
    addStyle('.MTSideDrawerDetail { ' + a5 + ' width: 24%; text-align: right; font-size: 13px; }');
    addStyle('.MTSideDrawerDetail2 { ' + a5 + ' width: 24%; text-align: right; font-size: 12px; }');
    addStyle('.MTSideDrawerDetail3 { ' + a5 + ' width: 13px; text-align: center; font-size: 13px; font-family: MonarchIcons, sans-serif !important; }');

    addStyle('.dropbtn {' + a1 + a5 + '; border: none; cursor: pointer;}');
    addStyle('.dropbtn:hover, .dropbtn:focus {' + a2 + '}');
    addStyle('.MTdropdown {float: right;  position: relative; display: inline-block; font-weight: 200;}');
    addStyle('.MTdropdown-content div {font-size: 0px; line-height: 2px; background-color: #ff7369;}');
    addStyle('.MTdropdown-content {' + a1 + a5 + ';display:none; position: absolute; min-width: 300px; overflow: auto; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px; right: 0; z-index: 1;}');
    addStyle('.MTdropdown-content a {' + a1 + a5 + ';font-size: 15px; padding: 10px 10px; display: block;}');
    addStyle('.MTdropdown a:hover {' + a2 + ' }');
    addStyle('.show {display: block;}');

    addStyle('.Toast__Root-sc-1mbc5m5-0 {display: ' + getDisplay(getCookie("MT_HideToaster"),'block;') + '}');
    addStyle('.ReportsTooltipRow__Diff-k9pa1b-3 {display: ' + getDisplay(getCookie("MT_HideTipDiff"),'block;') + '}');
    addStyle('.AccountNetWorthCharts__Root-sc-14tj3z2-0 {display: ' + getDisplay(getCookie("MT_HideAccountsGraph"),'block;') + '}');
    if(getCookie('MT_PlanCompressed') == 1) {
        addStyle('.sTiBE {height: 69px;}');
        addStyle('.jWyZIM {height: 45px;}');
        addStyle('.fAcQtX {margin-bottom: 2px;}');
    }
    if(getCookie('MT_PendingIsRed') == 1) {addStyle('.cxLoFP {color:red;}');}
    if(getCookie('MT_CompressedTx') == 1) {
        addStyle('.dHdtJt {font-size: 14px;}');
        addStyle('.hDZmpo {font-size: 14px;}');
        addStyle('.dnAUzj {font-size: 14px; padding: 2px;}');
        addStyle('.kphLtI {height: 28px;}');
    }
    MM_MenuFix();
    MM_SetupCallbacks();
}

function MM_MenuFix() {

    MM_hideElement("[href~='/settings/referrals']",getCookie('MT_Ads'));
    MM_hideElement("[href~='/advice']",getCookie('MT_Advice'));
    MM_hideElement("[href~='/investments']",getCookie('MT_Investments'));
    MM_hideElement("[href~='/objectives']",getCookie('MT_Goals'));
    MM_hideElement("[href~='/recurring']",getCookie('MT_Recurring'));
    MM_hideElement("[href~='/plan']",getCookie('MT_Budget'));

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

    if(r_PlanGridActive == 2 && r_PlanYear != '') {
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

// [ Flex Queue ]
function MF_QueueAddTitle(p) {
    MTFlexTitle.push({"Col": p.Column, "Title": p.Title,"isSortable": p.isSortable, "Width": p.Width, "Format": p.Format, "ShowPercent": p.ShowPercent, "ShowPercentShade": p.ShowPercentShade});
    MTFlexTitle.sort((a, b) => (a.Col - b.Col));
}

function MF_QueueAddRow(p) {
    MTFlexCR = MTFlexRow.length;
    if(p.PK == undefined || p.PK == null) {p.PK = '';}
    if(isNaN(p.SK)) {p.SK = 0;}
    MTFlexRow.push({"Num": MTFlexCR, "isHeader": p.isHeader, "BasedOn": p.BasedOn, "IgnoreShade": p.IgnoreShade, "Section": p.Section, "PK": p.PK, "SK": p.SK, "UID": p.UID,"PKHRef": p.PKHRef, "PKTriggerEvent": p.PKTriggerEvent, "SKHRef": p.SKHRef, "SKTriggerEvent": p.SKTriggerEvent, "Icon": p.Icon });
}

function MF_QueueAddCard(p) {
    MTFlexCard.push({"Col": p.Col, "Title": p.Title,"Subtitle": p.Subtitle, "Style": p.Style});
}

async function MF_GridInit(inName) {

    document.body.style.cursor = "wait";
    MTFlex = [];
    MTFlexTitle = [];
    MTFlexRow = [];
    MTFlexCard = [];
    MTFlexCR = 0;
    MTFlexReady = false;
    MTFlex.Name = inName;
    MTFlex.Button1 = getCookie(inName + 'Button1',true);
    MTFlex.Button2 = getCookie(inName + 'Button2',true);
    await buildCategoryGroups();

}

function MT_GridDraw(inRedraw) {

    removeAllSections(['div.MTFlexContainer','table.MTFlexGrid'][inRedraw]);
    if(inRedraw == false) {MT_GridDrawContainer();}
    MT_GridDrawSort();
    MT_GridDrawDetails();
    if(inRedraw == false) {MT_GridDrawCards();}
    document.body.style.cursor = "";
}

function MT_GridDrawDetails() {

    let el = null;
    let elx = null;
    let Header = null;
    let pct = null;
    let useDesc = '';
    let useStyle = '';
    let useStyle2 = '';
    let useValue = 0;
    let useValue2 = '';
    let workValue = 0;
    let rowNdx = 0;
    let Subtotals = [];
    let Grouptotals = [];
    let SubtotalsNdx = 0;
    let RowI = 0;
    let ArrowSpacing = 'width: 34px; padding-left: 0px;'

    MT_GridDrawClear();
    MT_GridDrawTitles();
    for (RowI = 0; RowI < MTFlexRow.length; RowI += 1) {
        MT_GridDrawRow(false);
        if(RowI == MTFlexRow.length-1) {
            MT_GridDrawRow(true);
            MT_GridDrawClear();
        } else if (MTFlexRow[RowI].Section != MTFlexRow[RowI+1].Section || MTFlexRow[RowI].PK != MTFlexRow[RowI+1].PK) {
            MT_GridDrawRow(true);
            MT_GridDrawClear();
        }
    }

    function MT_GridDrawClear() {
        for (let j=0; j < MTFlexTitle.length; j += 1) {Grouptotals[j] = 0;}
    }

    function MT_GridDrawTitles() {

        Header = cec('table','MTFlexGrid',MTFlexDetails,'','','','');
        el = cec('tr','MTFlexGridTitleRow',Header,'','','','');
        for (RowI = 0; RowI < MTFlexTitle.length; RowI += 1) {
            if(MTFlexTitle[RowI].Format == 1) {useStyle = 'MTFlexGridTitleCell2'; } else {useStyle = 'MTFlexGridTitleCell'; }
            elx = cec('td',useStyle,el,MTFlexTitle[RowI].Title,'','Column',RowI.toString());
            if(MTFlexTitle[RowI].Width != '') {elx.style = 'width: ' + MTFlexTitle[RowI].Width;}
        }
        if(MTFlex.TriggerEvents) { elx = cec('td',useStyle,el,'','','style',ArrowSpacing);}
    }

    function MT_GridDrawRow(isSubTotal) {

        let useRow = Object.assign({}, MTFlexRow[RowI]);

        if(isSubTotal == false) {
            if(useRow.isHeader == true) {
                el = cec('tr','MTFlexGridRow',Header,'','','','');
                useStyle = 'MTFlexGridHCell';
                Subtotals[SubtotalsNdx] = RowI;
                SubtotalsNdx+=1;
            } else {
                el = cec('tr','MTFlexGridItem',Header,'','','','');
                useStyle = 'MTFlexGridDCell';
            }
            useDesc = useRow[MTFields];
            if(useRow.Icon) {useDesc = useRow.Icon + ' ' + useDesc;}
            if(useRow.SKHRef) {
                elx = cec('td',useStyle,el,'','','','');
                elx = cec('a',useStyle,elx,useDesc,useRow.SKHRef,'','');
            } else {
                elx = cec('td',useStyle,el,useDesc);
            }
        } else {
            if(useRow.isHeader == true) {return;}
            if(MTFlex.Subtotals != true) {return;};

            for (let j = 0; j < MTFlexTitle.length; j += 1) {
                useRow[MTFields + j + 1] = Grouptotals[j];
            }
            useRow.IgnoreShade = true;
            useDesc = useRow.PK;
            el = cec('tr','MTFlexGridItem',Header,'','','','');
            if(useRow.PKHRef) {
                elx = cec('td','MTFlexGridSCell',el,'','','','');
                elx = cec('a','MTFlexGridDCell',elx,useDesc,useRow.PKHRef,'','');
            } else {
                elx = cec('td','MTFlexGridS3Cell',el,useDesc,'','','');
            }
            useStyle = 'MTFlexGridSCell';
        }

        useStyle = useStyle + '2';
        for (let j = 1; j < MTFlexTitle.length; j += 1) {
            useValue = useRow[j + MTFields];
            if(MTFlexTitle[j].Format == 0) {
                if(isSubTotal == false) {
                    cec('td','MTFlexGridD3Cell',el,useValue,'','','');
                } else {
                    cec('td',useStyle,el,useValue,'','','');
                }
            } else {
                useValue2 = getDollarValue(useValue);
                useStyle2 = '';
                switch (MTFlexTitle[j].ShowPercent) {
                    case 1:
                        pct = MT_GridPercent(useRow[j + MTFields - 2],useRow[j + MTFields - 1],MTFlexTitle[j].ShowPercentShade,1,useRow.IgnoreShade);
                        useValue2 = useValue2 + ' ' + pct[0];
                        useStyle2 = pct[1];
                        break;
                    case 2:
                        rowNdx = useRow.BasedOn -1;
                        rowNdx = Subtotals[rowNdx];
                        workValue = MTFlexRow[rowNdx][j + MTFields];
                        pct = MT_GridPercent(workValue,useValue,MTFlexTitle[j].ShowPercentShade,2,useRow.IgnoreShade);
                        useValue2 = useValue2 + ' ' + pct[0];
                        useStyle2 = pct[1];
                        break;
                }
                if(useStyle2 == '') { useStyle2 = MT_GridDrawEmbed(useRow.Section,j,useValue,useDesc);}
                if(useStyle2) {elx = cec('td',useStyle,el,useValue2,'','style',useStyle2);} else {elx = cec('td',useStyle,el,useValue2,'','','');}
                Grouptotals[j-1] += useValue;
            }
        }

        if(MTFlex.TriggerEvents) {
            if(isSubTotal == true && useRow.PKTriggerEvent) {
                elx = cec('td','',el,'','','style',ArrowSpacing + 'vertical-align: top;');
                elx = cec('button','MTFlexCellArrow',elx,'','','triggers',useRow.PKTriggerEvent + '|');
                let elx2 = cec('span','',elx,'','','','');
            }
            else if(isSubTotal == false && useRow.SKTriggerEvent) {
                elx = cec('td','',el,'','','style',ArrowSpacing);
                elx = cec('button','MTFlexCellArrow',elx,'','','triggers',useRow.SKTriggerEvent + '|');
                let elx2 = cec('span','',elx,'','','','');
            } else {
                elx = cec('td','',el,'','','style',ArrowSpacing );
            }
        }
    }
}

function MT_GridDrawSort() {

    let useSort = getCookie(MTFlex.Name + 'Sort',true);
    let useCol = MTFields + Math.abs(useSort);

    for (let i = 0; i < MTFlexRow.length; i += 1) {
        MTFlexRow[i].SK = MTFlexRow[i][useCol];
    }
    switch (MTFlexTitle[useCol-MTFields].isSortable) {
        case 1:
            if(useSort < 0) {
                MTFlexRow.sort((a, b) => (a.Section - b.Section || a.PK.localeCompare(b.PK) || b.SK.localeCompare(a.SK) ));
            } else {
                MTFlexRow.sort((a, b) => (a.Section - b.Section || a.PK.localeCompare(b.PK) || a.SK.localeCompare(b.SK) ));
            }
            break;
        case 2:
            if(useSort < 0) {
                MTFlexRow.sort((a, b) => (a.Section - b.Section || a.PK.localeCompare(b.PK) || b.SK - a.SK ));
            } else {
                MTFlexRow.sort((a, b) => (a.Section - b.Section || a.PK.localeCompare(b.PK) || a.SK - b.SK ));
            }
            break;
    }
}

function MT_GridDrawContainer() {

    let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
    if(topDiv) {
        let div2 = document.createElement('div');
        div2.className = 'MTFlexContainer';
        topDiv.prepend(div2);
        let div = cec('div','',div2,'','','','');
        MTFlexDetails = cec('div','MTFlexContainerPanel',div,'','','','');
        let cht = cec('div','MTFlexContainerCard',MTFlexDetails,'','','','');

        div = cec('div','MTFlexTitle',cht,'','','','');
        div = cec('div','MTFlexTitle2',div,'','','','');
        div2 = cec('span','MTFlexSmall',div,MTFlex.Title1,'','','');
        if(MTFlex.TriggerEvent) {
            div2 = cec('a','MTFlexBig MThRefClass',div,MTFlex.Title2,'','');
        } else {
            div2 = cec('span','MTFlexBig',div,MTFlex.Title2,'','','');
        }
        div2 = cec('span','MTFlexLittle',div,MTFlex.Title3,'','','');

        let tbs = cec('span','MTFlexButtonContainer',cht);
        if(MTFlex.Button1Options) {div2 = cec('button','MTFlexButton1',tbs,MTFlex.Button1Options[MTFlex.Button1],'','','');}
        if(MTFlex.Button2Options) {div2 = cec('button','MTFlexButton2',tbs,MTFlex.Button2Options[MTFlex.Button2],'','','');}
        div2 = cec('button','MTFlexButtonExport',tbs,'Export','','','');
    }
}

function MT_GridDrawCards() {

    if(MTFlexCard.length == 0) {return;}
    let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
    if(topDiv) {
        MTFlexCard.sort((a, b) => (a.Col - b.Col));
        let div = document.createElement('div');
        div.className = 'MTFlexContainer';
        div.style = 'padding-bottom: 0px;';
        topDiv.prepend(div);
        topDiv = cec('div','MTFlexContainer2',div,'','','','');
        for (let i = 0; i < MTFlexCard.length; i++) {
            let div2 = cec('div','MTFlexContainerCard',topDiv,'','','style','flex-flow: column;');
            cec('span','MTFlexBig',div2,MTFlexCard[i].Title,'','style',MTFlexCard[i].Style);
            cec('span','MTFlexSmall',div2,MTFlexCard[i].Subtitle,'','style','text-align:center');
        }
    }
}

function MT_GridPercent(inA,inB,inHighlight, inPercent, inIgnoreShade) {

    if(isNaN(inA)) {inA = 0;}
    if(isNaN(inB)) {inB = 0;}
    let p = ['',''];
    if(inA != 0 || inB != 0) {
        if(inA != 0) {
            if(inPercent == 1) {
                p[0] = ((inB - inA) / inA);
            } else {
                p[0] = inB / inA;
                if(p[0] < 0) { p[0] = 0;}
            }
        } else {p[0] = 1;}
        p[0] = p[0] * 100;
        p[0] = Math.round(p[0] * 10) / 10;

        if(inHighlight == true && inIgnoreShade != true) {
            if(p[0] > 100) {
                p[1] = 'background-color: #e68691; color: black;';
            } else {
                if(p[0] > 50) {p[1] = 'background-color: #ffc7ce; color: black;';} else {
                    if(p[0] > 25 ) {p[1] = 'background-color: #fff3f4; color: black;';}
                }
            }
            if(p[1]) {p[1] = p[1] + 'border-radius: 6px;';}
        }

        if (p[0] > 1000) { p[0] = '(>1,000%)';
        } else if (p[0] < -1000) { p[0] = '(<1,000%)'; } else { p[0] = ' (' + p[0].toFixed(1) + '%)'; }
    }
    return(p);
}

function MT_GridExport() {

    const CRLF = String.fromCharCode(13,10);
    const c = ',';
    const MTFieldsEnd = MTFields + MTFlexTitle.length;
    let csvContent = '';
    let useValue = '';
    let k = 0;

    for (let i = 0; i < MTFlexTitle.length; i += 1) { csvContent = csvContent + '"' + MTFlexTitle[i].Title + '"' + c;}
    csvContent = csvContent + CRLF;
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(i > 0 && MTFlexRow[i].Section != MTFlexRow[i-1].Section) { csvContent = csvContent + c + CRLF; }
        k = 0;
        for (let j = MTFields; j < MTFieldsEnd; j += 1) {
            useValue = '';
            if(MTFlexRow[i][j] != undefined) {
                if(MTFlexTitle[k].Format == 1) {
                    useValue = Number(MTFlexRow[i][j]);
                    useValue = useValue.toFixed(2);
                } else {
                    useValue = MTFlexRow[i][j];
                }
            }
            k+=1;
            csvContent = csvContent + useValue + c;
        }
        csvContent = csvContent + CRLF;
    }
    downloadFile( MTFlex.Title1 +' - ' + MTFlex.Title2,csvContent);
}

function MT_GridDrawEmbed(inSection,inCol,inValue, inDesc) {

    switch (MTFlex.Name) {
        case 'MTTrend':
            if((inSection == 2) && (inCol == 3 || inCol == 6)) {if(inValue > 0) {return css_green;}}
            if((inSection == 4) && (inCol == 3 || inCol == 6)) {if(inValue < 0) {return css_green;}}
            break;
    }
    return '';
}

function MT_GridUpdateUID(inUID,inCol,inValue) {
     for (let i = 0; i < MTFlexRow.length; i += 1) {
         if(MTFlexRow[i].UID == inUID) {
             MTFlexRow[i][MTFields + inCol] = inValue;
             break;
         }
     }
}

function MT_GridRollup(inNew,inRoll,inBasedOn,inName) {

    if(MTFlexRow.length == 0) {return;}
    let Subtotals = [];
    for (let i = 0; i < MTFlexTitle.length; i += 1) {Subtotals[i] = 0;}
    for (let i = 0; i < MTFlexRow.length; i += 1) {
         if(MTFlexRow[i].Section == inRoll) {
             for (let j = 1; j < MTFlexTitle.length; j += 1) {
                 if(MTFlexTitle[j].Format > 0) {Subtotals[j] += MTFlexRow[i][MTFields + j];}
             }
         }
    }
    MTP = [];
    MTP.isHeader = true;
    MTP.IgnoreShade = true;
    MTP.Section = inNew;
    MTP.BasedOn = inBasedOn;
    MF_QueueAddRow(MTP);
    MTFlexRow[MTFlexCR][MTFields] = inName;
    for (let j = 1; j < MTFlexTitle.length; j += 1) {
        if(MTFlexTitle[j].Format > 0) {MTFlexRow[MTFlexCR][MTFields+j] = Subtotals[j];} else {MTFlexRow[MTFlexCR][MTFields+j] = '';}
    }
}

function MT_GridRollDifference(inNew,inA,inB, inBasedOn, inName) {

    if(MTFlexRow.length == 0) {return;}

    let p1 =null;
    let p2 = null;

    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].Section == inA) {p1 = i;}
        if(MTFlexRow[i].Section == inB) {p2 = i;}
    }
    if(p1 == null || p2 == null) {return;};
    MTP = [];
    MTP.isHeader = true;
    MTP.IgnoreShade = true;
    MTP.Section = inNew;
    MTP.BasedOn = inBasedOn;
    MF_QueueAddRow(MTP);
    MTFlexRow[MTFlexCR][MTFields] = inName;
    for (let j = 1; j < MTFlexTitle.length; j += 1) {
        if(MTFlexTitle[j].Format > 0) {
            MTFlexRow[MTFlexCR][MTFields+j] = MTFlexRow[p1][MTFields+j] - MTFlexRow[p2][MTFields+j];
        } else {
            MTFlexRow[MTFlexCR][MTFields+j] = '';
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
            }
        }
       if(OnFocus == true) {
           MenuReportsDataset();
           MenuReportBreadcrumbListener();
           MenuReportsCustom();
           r_spawn = 1;
        }
    }
}

// [ Trends Menu ]
function MenuReportsCustom() {

    let cMenus = [];
    cMenus[0] = document.querySelector('a.MTTrendsMenu');
    if(!cMenus[0]) {
        let div = document.querySelector('[class*="ReportsHeaderTabs__Root"]');
        if(div) {
            cMenus[0] = cec('a','MTTrendsMenu ' + div.lastChild.className,div,'Trends','/reports/trends','','');
            cMenus[1] = cec('a','MTAccountsMenu ' + div.lastChild.className,div,'Accounts','/reports/accounts','','');
        }
    }
    for (let i = 0; i < cMenus.length; i += 1) {
         cMenus[i].className = cMenus[i].className.replace(' tab-nav-item-active','')
    }
    if(SaveLocationPathName.endsWith('/reports/trends')) {
        cMenus[0].className = cMenus[0].className + ' tab-nav-item-active';
        MenuReportsPanels('display:none;');
        MenuReportsTrendsGo();
    } else if (SaveLocationPathName.endsWith('/reports/accounts')) {
        cMenus[1].className = cMenus[1].className + ' tab-nav-item-active';
        MenuReportsPanels('display:none;');
        MenuReportsAccountsGo();
    } else {
        removeAllSections('.MTFlexContainer');
        MenuReportsPanels('');
    }
}

function MenuReportsPanels(inType) {

    let div = document.querySelector("div.MTdropdown");
    if(div) {div.parentNode.style=inType;}
    div = document.querySelector('[class*="Grid__GridStyled-"]');
    if(div) {div.style=inType;}
}

async function MenuReportsAccountsGo() {

    let useBalance = 0;

    await MF_GridInit('MTAccounts');
    let snapshotData = await getAccountsData();
    let useDate = formatQueryDate(getDates('d_StartofMonth'));
    let snapshotData2 = await getDisplayBalanceAtDateData(useDate);

    MTFlex.Title1 = 'Accounts';
    MTFlex.Title2 = 'as of ' + getDates('s_FullDate');
    MTFlex.Title3 = '';
    MTFlex.TriggerEvent = false;
    MTFlex.TriggerEvents = false;
    MTFlex.Button1Options = ['Show Subtotals','Hide Subtotals'];
    MTFlex.Subtotals = MTFlex.Button1;

    MTP = [];
    MTP.Column = 0;
    MTP.Title = 'Account';
    MTP.isSortable = 1;
    MTP.Format = 0;
    MF_QueueAddTitle(MTP);
    MTP.Column = 1;
    MTP.Title = 'Type';
    MF_QueueAddTitle(MTP);
    MTP.Column = 2;
    MTP.Title = 'Last Updated';
    MF_QueueAddTitle(MTP);
    MTP.Column = 3;
    MTP.Title = getDates('s_ShortDate',getDates('d_StartofMonth')) + ' Balance';
    MTP.isSortable = 2;
    MTP.Format = 1;
    //MTP.ShowPercent = 2;
    MF_QueueAddTitle(MTP);
    MTP.Column = 4;
    MTP.Title = 'Current Balance';
    MTP.isSortable = 2;
    MTP.Format = 1;
    //MTP.ShowPercent = 2;
    MF_QueueAddTitle(MTP);
    MTP.Column = 5;
    MTP.Title = 'Net Change';
    MTP.isSortable = 2;
    MTP.Format = 1;
    MTP.ShowPercent = 1;
    MF_QueueAddTitle(MTP);
    for (let i = 0; i < snapshotData.accounts.length; i += 1) {
        MTP = [];
        MTP.isHeader = false;
        MTP.UID = snapshotData.accounts[i].id;
        useBalance = snapshotData.accounts[i].displayBalance;
        if(snapshotData.accounts[i].isAsset == true) {
            MTP.BasedOn = 1;
            MTP.Section = 2;
        } else {
            MTP.BasedOn = 2;
            MTP.Section = 4;
        }
        MTP.PK = snapshotData.accounts[i].subtype.display;
        MTP.SKHRef = '/accounts/details/' + snapshotData.accounts[i].id;
        MF_QueueAddRow(MTP);
        MTFlexRow[MTFlexCR][MTFields] = snapshotData.accounts[i].displayName;
        MTFlexRow[MTFlexCR][MTFields+1] = snapshotData.accounts[i].subtype.display;
        MTFlexRow[MTFlexCR][MTFields+2] = snapshotData.accounts[i].displayLastUpdatedAt.substring(0, 10) + ' ' + snapshotData.accounts[i].displayLastUpdatedAt.substring(11, 16);
        MTFlexRow[MTFlexCR][MTFields+3] = 0;
        MTFlexRow[MTFlexCR][MTFields+4] = useBalance;
        MTFlexRow[MTFlexCR][MTFields+5] = 0;
        for (let j = 0; j < snapshotData2.accounts.length; j += 1) {
            if(snapshotData2.accounts[j].id == snapshotData.accounts[i].id) {
                MTFlexRow[MTFlexCR][MTFields+3] = snapshotData2.accounts[j].displayBalance;
                MTFlexRow[MTFlexCR][MTFields+5] = MTFlexRow[MTFlexCR][MTFields+4] - MTFlexRow[MTFlexCR][MTFields+3];
                break;
            }
        }
    }
    MT_GridRollup(1,2,1,'Assets');
    MT_GridRollup(3,4,2,'Liabilities');
    MT_GridRollDifference(5,1,3,1,'Net Worth');
    MTFlexReady = true;
}

async function MenuReportsTrendsGo() {

    TrendQueue = [];
    await MF_GridInit('MTTrend');
    let TrendFullPeriod = getCookie('MT_TrendFullPeriod',true);

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

    MTFlex.Title1 = 'Net Income Trend Report';
    MTFlex.Title2 = getDates('s_FullDate',lowerDate) + ' - ' + getDates('s_FullDate',higherDate);
    if(TrendFullPeriod == 1) { MTFlex.Title3 = '* Comparing to End of Month'; }
    MTFlex.TriggerEvent = true;
    MTFlex.TriggerEvents = true;
    MTFlex.Button1Options = ['By group','By category','By both'];
    MTFlex.Button2Options = ['By Last Month','By same month','By same quarter'];
    if(MTFlex.Button1 == 2) {MTFlex.Subtotals = true;}

    MTP = [];
    MTP.Column = 0;
    MTP.Title = ['Group','Category','Group/Category'][MTFlex.Button1];
    MTP.isSortable = 1;
    MTP.Format = 0;
    MF_QueueAddTitle(MTP);

    // this year
    MTP = [];
    MTP.Column = 5;
    MTP.Title = 'YTD ' + year;
    MTP.isSortable = 2;
    MTP.Width = '14%';
    MTP.Format = 1;
    if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
    MTP.ShowPercentShade = false;
    MF_QueueAddTitle(MTP);
    await BuildTrendData('cp',MTFlex.Button1,'year',lowerDate,higherDate,'');

    // last year
    year-=1;
    lowerDate.setFullYear(year);
    higherDate.setFullYear(year);
    MTP = [];
    MTP.Column = 4;
    MTP.Title = 'YTD ' + year;
    MTP.isSortable = 2;
    MTP.Format = 1;
    MTP.Width = '14%';
    if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
    MTP.ShowPercentShade = false;
    MF_QueueAddTitle(MTP);
    MTP.Column = 6;
    MTP.Title = 'Difference';
    MTP.Format = 1;
    MTP.Width = '14%';
    if(getCookie('MT_TrendHidePer2',true) != true) {MTP.ShowPercent = 1;}
    MTP.ShowPercentShade = true;
    MF_QueueAddTitle(MTP);
    await BuildTrendData('lp',MTFlex.Button1,'year',lowerDate,higherDate,'');

    // This Period
    let useTitle = '';
    year+=1;
    month = month2;
    lowerDate.setFullYear(year,month,1);
    higherDate.setFullYear(year2,month2,day2);

    if(MTFlex.Button2 == 2) {
        const QtrDate = getDates('ThisQTRs',TrendTodayIs);
        month = parseInt(QtrDate.substring(0,2)) - 1;
        lowerDate.setMonth(month);
        if(month != month2) {useTitle = getMonthName(month,true) + ' - ';}
    }
    if(MTFlex.Button2 == 1) {
        day2 = daysInMonth(month2,year2);
        higherDate.setDate(day2);
    }

    useTitle = useTitle + getMonthName(month2,true) + ' ' + year;
    MTP = [];
    MTP.Column = 2;
    MTP.Title = useTitle;
    MTP.isSortable = 2;
    MTP.Width = '14%';
    MTP.Format = 1;
    if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
    MTP.ShowPercentShade = false;
    MF_QueueAddTitle(MTP);
    await BuildTrendData('cm',MTFlex.Button1,'year',lowerDate,higherDate,'');

    // Last Period --------------
    useTitle = '';
    if(MTFlex.Button2 == 0) {
        month-=1;
        if(month < 0) { month = 11; year = year - 1;}
        month2 = month;
        year2 = year;
        lowerDate.setFullYear(year,month,1);
        higherDate.setFullYear(year2,month2,1);

        let x = daysInMonth(month,year);
        if(day2 > x) {day2 = x;}
        higherDate.setDate(day2);
        MTFlex.TitleShort = 'Last Month';
        useTitle = getMonthName(month2,true) + ' ' + year;
    }
    if(MTFlex.Button2 == 1) {
        year-=1;
        lowerDate.setFullYear(year,month,1);
        higherDate.setFullYear(year,month,1);
        higherDate.setDate(day2);
        MTFlex.TitleShort = 'Last ' + getMonthName(month);
        useTitle = getMonthName(month,true) + ' ' + year;
    }
    if(MTFlex.Button2 == 2) {
        year-=1;
        lowerDate.setFullYear(year);
        higherDate.setFullYear(year);
        if(month == month2) {
            useTitle = getMonthName(month2,true) + ' ' + year;
        } else {
            useTitle = getMonthName(month,true) + ' - ' + getMonthName(month2,true) + ' ' + year;
        }
        MTFlex.TitleShort = useTitle;
    }

    if(TrendFullPeriod == 1) {
        day2 = daysInMonth(month2,year2);
        higherDate.setDate(day2);
        useTitle = useTitle + ' *';
    }
    MTP = [];
    MTP.Column = 1;
    MTP.Title = useTitle;
    MTP.isSortable = 2;
    MTP.Format = 1;
    MTP.Width = '14%';
    MTP.Format1 = true;
    if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
    MTP.ShowPercentShade = false;
    MF_QueueAddTitle(MTP);
    MTP = [];
    MTP.Column = 3;
    if(getCookie('MT_TrendHidePer2',true) != true) {MTP.ShowPercent = 1;}
    MTP.ShowPercentShade = true;
    MTP.Title = 'Difference';
    MTP.isSortable = 2;
    MTP.Format = 1;
    MTP.Width = '14%';
    MF_QueueAddTitle(MTP);

    await BuildTrendData('lm',MTFlex.Button1,'year',lowerDate,higherDate,'');
    await WriteTrendData();
    MTFlexReady = true;
}

async function WriteTrendData() {

    let useCards = [0,'',0,'',0,'',0,''];
    let useDesc = '';

    for (let i = 0; i < TrendQueue.length; i += 1) {
        MTP = [];
        let retGroup = await getCategoryGroup(TrendQueue[i].ID);
        if(retGroup.TYPE == 'expense' || retGroup.TYPE == 'income') {
             if(retGroup.TYPE == 'expense') {
                 TrendQueue[i].N_CURRENT = TrendQueue[i].N_CURRENT * -1;
                 TrendQueue[i].N_LAST = TrendQueue[i].N_LAST * -1;
                 TrendQueue[i].N_CURRENTM = TrendQueue[i].N_CURRENTM * -1;
                 TrendQueue[i].N_LASTM = TrendQueue[i].N_LASTM * -1;
                 MTP.BasedOn = 2;
                 MTP.Section = 4;
             }
             if(retGroup.TYPE == 'income') {
                 MTP.BasedOn = 1;
                 MTP.Section = 2;
                 MTP.IgnoreShade = true;
             }
             MTP.isHeader = false;
             if(MTFlex.Button1 > 0) {
                 if(MTFlex.Button1 == 2) {
                     MTP.PK = retGroup.GROUPNAME;
                     MTP.PKHRef = '/category-groups/' + retGroup.GROUP;
                     MTP.PKTriggerEvent = 'category-groups|' + retGroup.GROUP;
                 }
                 MTP.SKHRef = '/categories/' + retGroup.ID;
                 MTP.SKTriggerEvent = 'categories|' + retGroup.ID;
                 useDesc = retGroup.NAME;
             } else {
                 useDesc = retGroup.GROUPNAME;
                 MTP.SKHRef = '/category-groups/' + retGroup.GROUP;
                 MTP.PKTriggerEvent = '';
                 MTP.SKTriggerEvent = 'category-groups|' + retGroup.GROUP;
             }
            MTP.Icon = retGroup.ICON;
            MTP.SKExpand = '';
            MF_QueueAddRow(MTP);
            MTFlexRow[MTFlexCR][MTFields] = useDesc;
            MTFlexRow[MTFlexCR][MTFields+1] = TrendQueue[i].N_LASTM;
            MTFlexRow[MTFlexCR][MTFields+2] = TrendQueue[i].N_CURRENTM;
            MTFlexRow[MTFlexCR][MTFields+3] = TrendQueue[i].N_CURRENTM - TrendQueue[i].N_LASTM;
            MTFlexRow[MTFlexCR][MTFields+4] = TrendQueue[i].N_LAST;
            MTFlexRow[MTFlexCR][MTFields+5] = TrendQueue[i].N_CURRENT;
            MTFlexRow[MTFlexCR][MTFields+6] = TrendQueue[i].N_CURRENT - TrendQueue[i].N_LAST;
            if(retGroup.TYPE == 'expense') {
                if(MTFlexRow[MTFlexCR][MTFields+3] > 0 && MTFlexRow[MTFlexCR][MTFields+3] > useCards[2]) {
                    useCards[2] = MTFlexRow[MTFlexCR][MTFields+3];
                    useCards[3] = MTP.Icon + ' ' + useDesc;
                }
                if(MTFlexRow[MTFlexCR][MTFields+3] < 0 && MTFlexRow[MTFlexCR][MTFields+3] < useCards[4]) {
                    useCards[4] = MTFlexRow[MTFlexCR][MTFields+3];
                    useCards[5] = MTP.Icon + ' ' + useDesc;
                }
                if(MTFlexRow[MTFlexCR][MTFields+6] > 0 && MTFlexRow[MTFlexCR][MTFields+6] > useCards[0]) {
                    useCards[0] = MTFlexRow[MTFlexCR][MTFields+6];
                    useCards[1] = MTP.Icon + ' ' + useDesc;
                }
                if(MTFlexRow[MTFlexCR][MTFields+6] < 0 && MTFlexRow[MTFlexCR][MTFields+6] < useCards[6]) {
                    useCards[6] = MTFlexRow[MTFlexCR][MTFields+6];
                    useCards[7] = MTP.Icon + ' ' + useDesc;
                }
            }
         }
    }
    MT_GridRollup(1,2,1,'Income');
    MT_GridRollup(3,4,2,'Spending');
    MT_GridRollDifference(5,1,3,1,'Savings');

    if(useCards[2] != 0) {
        WriteTrendCard(1,useCards[2] * -1,useCards[3],'Over spending in','Over spending in');
    } else {
        WriteTrendCard(1,useCards[4] * -1,useCards[5],'Saved most in','Saved most in');
    }
    if(useCards[0] != 0) {
        WriteTrendCard(2,useCards[0] * -1,useCards[1],'Over spent most in','Over spent most in');
    } else {
        WriteTrendCard(2,useCards[6] * -1,useCards[7],'Saved most in','Saved most in');
    }
    WriteTrendCard(3,MTFlexRow[MTFlexCR][MTFields+3],MTFlexTitle[1].Title,'Saved more than','Spent more than');
    WriteTrendCard(4,MTFlexRow[MTFlexCR][MTFields+6],'last year','Saved more than','Spent more than');

    function WriteTrendCard(inCol,inValue,inTitle,inSub1,inSub2) {
        MTP = [];
        MTP.Col = inCol;
        MTP.Title = getDollarValue(Math.abs(inValue));
        if(inValue > 0) {
            MTP.Subtitle = inSub1;
            MTP.Style = css_green;
        } else {
            MTP.Subtitle = inSub2;
            MTP.Style = css_red;
        }
        MTP.Subtitle = MTP.Subtitle + '\n' + inTitle;
        MF_QueueAddCard(MTP);
    }
}

async function BuildTrendData (inCol,inGrouping,inPeriod,lowerDate,higherDate,inID) {

    const firstDate = formatQueryDate(lowerDate);
    const lastDate = formatQueryDate(higherDate);

    let useID = '';
    let useType = '';
    let snapshotData = null;
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
                break;
            case 3:
                useID = snapshotData.aggregates[i].groupBy.category.id;
                retGroups = getCategoryGroup(useID);
                useID = retGroups.GROUP;
                useType = retGroups.TYPE;
                break;

        }
        if(inID == '' || inID == useID) {
            let useAmount = Number(snapshotData.aggregates[i].summary.sum);
            if(inID) {
                let useDate = snapshotData.aggregates[i].groupBy.month;
                let yy = useDate.substring(0,4);
                let mm = useDate.substring(5,7);
                if(useType == 'expense') { useAmount = useAmount * -1;}
                TrendQueue2.push({"YEAR": yy, "MONTH": mm,"AMOUNT": useAmount, "DESC": retGroups.NAME});
            } else { Trend_UpdateQueue(useID,useAmount,inCol); }
        }
    }
    console.log(version,firstDate,lastDate,inGrouping,inPeriod,inID,'Data Len: ' + snapshotData.aggregates.length,'Queue Len: ' + TrendQueue.length);
    if(inCol == 'hs') {MTFlexReady = 2;}
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
            TrendQueue.push({"ID": useID,"N_CURRENT": useAmount,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": 0});
            break;
        case 'lp':
            TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": useAmount, "N_CURRENTM": 0, "N_LASTM": 0});
            break;
        case 'cm':
            TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": useAmount, "N_LASTM": 0});
            break;
        case 'lm':
            TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": useAmount});
            break;
    }
}
// =======================================
function MenuReportsHistory(inType,inID) {

    let topDiv = document.getElementById('root');
    if(topDiv) {

        const lowerDate = new Date("2022-01-01");
        const higherDate = new Date();

        let retGroups = getCategoryGroup(inID);
        let inGroup = 1;

        topDiv = topDiv.childNodes[0];
        let div = cec('div','MTHistoryPanel',topDiv,'','','','');
        let div2 = cec('div','MTSideDrawerRoot',div,'','','tabindex','0');
        let div3 = cec('div','MTSideDrawerContainer',div2,'','','','');
        let div4 = cec('div','MTSideDrawerMotion',div3,'','','grouptype',inType);
        div4.setAttribute('cattype',retGroups.TYPE);
        div = cec('span','MTSideDrawerHeader',div4,'','','','');
        div2 = cec('button','MTTrendCellArrow',div,'','','style','float:right;');
        if(inType == 'category-groups') {
            div2 = cec('button','MTTrendCellArrow2',div,['',''][getCookie('MTC_div.TrendHistoryDetail',true)],'','style','float:right;margin-right: 16px;');
        }
        div2 = cec('div','MTFlexBig',div,'Monthly Summary');
        div = cec('span','MTSideDrawerHeader',div4,'','','','');
        div2 = cec('div','MTFlexSmall',div, retGroups.TYPE,'','style','float:right;');

        if(inType == 'category-groups') {
            div2 = cec('a','MThRefClass',div,retGroups.ICON + ' ' + retGroups.GROUPNAME ,'/' + inType + '/' + retGroups.GROUP ,'','' );
            inGroup = 3;
        } else {
            div2 = cec('a','MThRefClass',div,retGroups.ICON + ' ' + retGroups.GROUPNAME + ' / ' + retGroups.NAME,'/' + inType + '/' + retGroups.ID,'','' );
        }
        TrendQueue2 = [];
        BuildTrendData('hs',inGroup,'month',lowerDate,higherDate,inID);

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

        let div2 = cec('div','MTSideDrawerItem',div,'','','style',os2);
        let div3 = cec('span','MTSideDrawerDetail',div2,'Month','','style',os);
        for (let j = startYear; j <= curYear; j++) {
            if(skiprow == false || j > startYear) {
                div3 = cec('span','MTSideDrawerDetail',div2,j,'','','');
            }
        }

        div3 = cec('span','MTSideDrawerDetail3',div2,'','','','');
        div3 = cec('span','MTSideDrawerDetail',div2,'Average for Month','','','');
        div2 = cec('div','MTSideDrawerItem',div,'','','style',os2);
        div3 = cec('span','MTSpacerClass',div2,'','','','');

        let T = ['Total',0,0,0,0];

        for (let i = 0; i < 12; i++) {
            if(i > 0 && i == curMonth) {
                div2 = cec('div','MTSideDrawerItem',div,'','','style',os2);
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
            div2 = cec('div','MTSideDrawerItem',div,'','','','');
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

        div2 = cec('div','MTSideDrawerItem',div,'','','style',os2);
        div3 = cec('span','MTSpacerClass',div2,'','','');
        div2 = cec('div','MTSideDrawerItem',div,'','','style',os2);

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
            let div2 = cec('div','TrendHistoryDetail MTSideDrawerItem',inDiv,'','','style',os4);
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
        let div2 = cec('div','TrendHistoryDetail MTSideDrawerItem',inDiv,'','','style',os4);
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
                }
            }
        }
    }
}

function MenuFilter() {

    let eID = document.getElementById("MTDropdown");
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
            MenuDisplay_Input('Monarch Money Tweaks - ' + version,'','header');
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
        r_PlanGridActive = 2;
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
        r_PlanGridActive = 2;
        return;
    }

    // get current page year
    r_PlanYear = hed.innerText.substring(0,4);
    if(hed.innerText[5] == '-') {
        r_PlanGridActive = 2;
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
        r_PlanGridActive = 2;
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
                        r_PlanGridActive = 2;
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

    r_PlanGridActive = 2;
}

function MenuCheckSpawnProcess() {

    if(r_DatePickerActive == true) {
        MM_FixCalendarYears();
    }

    switch(MTFlexReady) {
        case true:
            MTFlexReady = false;
            MT_GridDraw(0);
            break;
        case 2:
            MTFlexReady = false;
            MenuReportsHistoryDraw();
            break;
    }

    switch (r_PlanGridActive) {
        case true:
            MenuPlanUpdate();
            break;
        case 2:
            if(SaveLocationHRefName != window.location.href) {
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
    // console.log(cn,event.target,pcn,event.target.parentNode);

    switch (cn) {
        case 'MTSideDrawerRoot':
            removeAllSections('div.MTSideDrawerRoot');
            return;
        case 'MTTrendCellArrow':
            removeAllSections('div.MTSideDrawerRoot');
            return;
        case 'MTTrendCellArrow2':
            flipAllSections('div.TrendHistoryDetail');
            event.target.innerText = ['',''][getCookie('MTC_div.TrendHistoryDetail',true)];
            return;
        case 'MTlink':
            if(pcn == 'MTSideDrawerHeader') {MenuReportsHistoryExport();}
            return;
        case 'MTFlexBig MThRefClass':
            onClickMTFlexBig();
            return;
        case 'MTFlexButton1':
            flipCookie(MTFlex.Name + 'Button1',MTFlex.Button1Options.length-1);
            if(MTFlex.Name == 'MTTrend') {MenuReportsTrendsGo();}
            if(MTFlex.Name == 'MTAccounts') {MenuReportsAccountsGo();}
            return;
        case 'MTFlexButton2':
            flipCookie(MTFlex.Name + 'Button2',MTFlex.Button2Options.length-1);
            if(MTFlex.Name == 'MTTrend') {MenuReportsTrendsGo();}
            return;
        case 'MTFlexButtonExport':
            MT_GridExport();
    }
    switch (pcn) {
        case 'MTFlexGridTitleRow':
            onClickGridSort();
            return;
        case 'MTFlexCellArrow':
            onClickMTFlexArrow();
            return;
        case 'MTdropdown':
            onClickFilter();
            return;
    }
    if(r_DatasetActive == true) {onClickFilter();}
};

function onClickMTFlexBig() {

  if(MTFlex.Name == 'MTTrend') {
      if(TrendTodayIs.getMonth() == getDates('n_CurMonth') && TrendTodayIs.getDate() == getDates('n_CurDay') && TrendTodayIs.getFullYear() == getDates('n_CurYear')) {
          TrendTodayIs = getDates('d_EndofLastMonth');

      } else {
          TrendTodayIs = getDates('d_CurDate');
      }
      MenuReportsTrendsGo();
  }
}

function onClickMTFlexArrow() {

    let p = event.target.parentNode.getAttribute("triggers").split('|');
    if(p == null) {return;}
    if(MTFlex.Name == 'MTTrend') {
        MenuReportsHistory(p[0],p[1]);
    }
}

function onClickGridSort() {

    let Column = event.target.getAttribute("column")
    if(Column != '') {
        let elSelected = Number(Column);
        let elCurrent = getCookie(MTFlex.Name + "Sort",true);
        if(Math.abs(elCurrent) == Math.abs(elSelected)) { elSelected = elCurrent * -1; }
        setCookie(MTFlex.Name + "Sort",elSelected);
        MT_GridDraw(1);
    }
}

function onClickFilter() {

    let isShowing = document.getElementById("MTDropdown").classList.toggle("show");
    if(isShowing == true) {
        MenuFilter();
        r_DatasetActive = true
    } else {
        r_DatasetActive = false;
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

function cec(e,c,r,it,hr,a1,a2) {

    let div = document.createElement(e);
    if(it) {div.innerText = it;}
    if(hr) {div.href = hr;}
    if(c) {div.className = c;}
    if(a1) {div.setAttribute(a1,a2);}
    const x = r.appendChild(div);
    return x;
}

function removeAllSections(inDiv) {

    const divs = document.querySelectorAll(inDiv);
    for (let i = 0; i < divs.length; ++i) { divs[i].remove(); }
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
    } else{
        return months[inValue];
    }
}

function getDates(InValue,InDate) {

    let d = null;
    if(InDate) { d = new Date(InDate);} else { d = new Date(); }
    let month = d.getMonth();
    let day = d.getDate();
    let year = d.getFullYear();

    if(InValue == 'n_CurYear') {return(year);}
    if(InValue == 'n_CurMonth') {return(month);}
    if(InValue == 'n_CurDay') {return(day);}
    if(InValue == 'd_CurDate') {return d;};
    if(InValue == 's_FullDate') {return(getMonthName(month,true) + ' ' + day + ', ' + year );}
    if(InValue == 's_ShortDate') {return(getMonthName(month,true) + ' ' + day);}

    if(InValue == 'Today') {
    } else {
        d.setDate(1);day = 1;
        switch (InValue) {
            case 'd_StartofMonth':
                return(d);
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
    if(OldValue > spin) { setCookie(inCookie,0); } else {setCookie(inCookie,OldValue); }
}

function getDisplay(InA,InB) {
    if(InA == 1) {return 'none;';} else {return InB;}
}

function getStyle() {
    const cssObj = window.getComputedStyle(document.querySelector('[class*=Page__Root]'), null);
    const bgColor = cssObj.getPropertyValue('background-color');
    if (bgColor === 'rgb(8, 32, 67)') { return 0; } else { return 1; }
}

function addStyle(aCss) {

    if(r_headStyle == null) { r_headStyle = document.getElementsByTagName('head')[0]; }
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    r_headStyle.appendChild(style);

};

(function() {

    setInterval(() => {

        if(r_spawn > -1) {

            if(SaveLocationHRefName != window.location.href) { MM_MenuFix();}

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
    }).catch((error) => { console.error(version,error); });
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
    }).catch((error) => { console.error(version,error); });
}

async function getDisplayBalanceAtDateData(date) {
    const options = callGraphQL({
    operationName: 'Common_GetDisplayBalanceAtDate',
    variables: {date: date, },
      query: "query Common_GetDisplayBalanceAtDate($date: Date!) {\n    accounts {\n      id\n      displayBalance(date: $date)\n      includeInNetWorth\n      type {\n        name\n      }\n    }\n  }\n"
      });

  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    }).catch((error) => { console.error(version,error); });
}

async function getAccountsData() {
    const options = callGraphQL({
    operationName: 'GetAccounts',
    variables: { },
      query: "query GetAccounts {\n accounts {\n id\n displayName\n deactivatedAt\n isHidden\n isAsset\n mask\n displayLastUpdatedAt\n currentBalance\n displayBalance\n hideFromList\n hideTransactionsFromReports\n order\n icon\n logoUrl\n deactivatedAt \n subtype {\n name\n display\n }\n }}\n"
      });

  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    }).catch((error) => { console.error(version,error); });
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
    }).catch((error) => { console.error(version,error); });
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
