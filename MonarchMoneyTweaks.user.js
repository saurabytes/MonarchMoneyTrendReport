// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      2.19
// @description  Monarch Tweaks
// @author       Robert P
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// ==/UserScript==

const version = '2.19';
const css_currency = 'USD';
const css_green = 'color: #2a7e3b;',css_red = 'color: #d13415;';
const graphql = 'https://api.monarchmoney.com/graphql';
let SaveLocationHRefName = '', SaveLocationPathName = '';
let r_headStyle = null, r_DatasetActive = false, r_FlexButtonActive = false;
let accountGroups = [], accountBalances = [];
let AccountsTodayIs = new Date(), TrendTodayIs = new Date();
let TrendQueue = [], TrendQueue2 = [];

// flex container
const MTFields = 13;
let MTFlex = [], MTFlexTitle = [], MTFlexRow = [], MTFlexCard = [];
let MTFlexCR = 0, MTFlexDetails = null, MTFlexReady = false, MTP = null;
let MTFlexSum = [0,0];

function MM_Init() {

    const a = isDarkMode();
    const panelBackground = 'background-color: ' + ['#FFFFFF;','#222221;'][a];
    const panelText = 'color: ' + ['#777573;','#989691;'][a];
    const standardText = 'color: ' + ['#22201d;','#FFFFFF;'][a];
    const sidepanelBackground = 'background: ' + ['#def7f9;','#222221;'][a];
    const selectBackground = 'background-color: ' + ['#def7f9;','#082c36;'][a];
    const selectForground = 'color: ' + ['#107d98;','#4ccce6;'][a];
    const lineForground = ['#F6F5F3','#363532'][a];
    const borderColor = ['#e4e1de','#62605D'][a];
    const accentColor = ['#ff692d;','#ff692d;'][a];

    MM_MenuFix();
    MM_RefreshAll();

    if(getCookie('MT_PlanCompressed',true) == 1) {addStyle('.joBqTh, .jsBiA-d {padding-bottom: 0px; padding-top: 0px; !important;}'); addStyle('.earyfo, .fxLfmT {height: 42px;}'); addStyle('.dVgTYt, .exoRCJ, .bgDnMb, .zoivW {font-size: 15px;}');}
    if(getCookie('MT_CompressedTx',true) == 1) {addStyle('.oRgik, .bVcoEc, .XbVLi, .erRzVO, .dEMbMu {font-size: 14px;}');addStyle('.XbVLi {padding-top: 1px; padding-bottom: 1px;}');}
    if(getCookie('MT_PendingIsRed',true) == 1) {addStyle('.cxLoFP {color:' + accentColor + '}');}
    addStyle('.MTBub {margin-bottom: 12px;}');
    addStyle('.MTBub1 {cursor: pointer;float: right; margin-left: 12px;font-size: 13px; margin-bottom: 10px;padding: 2px;border: 1px solid #e4e1de; box-shadow: rgba(8, 40, 100, 0.1) 0px 1px 2px;border-radius: 8px;width: 150px;text-align: center;font-weight: 500;}');
    addStyle('.MTWait { width: 40%; margin-left: auto; margin-top: 100px;margin-right: auto;justify-content: center; align-items: center;}');
    addStyle('.MTWait2 {font-size: 18px; font-weight: 500; font: "Oracle", sans-serif; ' + panelBackground + ' padding: 20px;border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);text-align: center;}');
    addStyle('.MTWait2 p {' + standardText + 'font-family:  MonarchIcons, sans-serif, "Oracle" !important; font-size: 15px; font-weight: 200;}');
    addStyle('.MTlink, .MTlink3 {background-color: transparent; color: rgb(50, 170, 240); font-weight: 500; font-size: 14px; cursor: pointer; border-radius: 4px; border-style: none; padding: 15px 1px 1px 16px; display:inline-block;}');
    addStyle('.MTlink2 {background-color: transparent; font-size: 14px; font-weight: 500; padding: 0px 0px 0px 16px;}');
    addStyle('.MTCheckboxClass, .MTFlexCheckbox {width: 19px; height: 19px; margin-right: 10px;float: inline-start; color: #FFFFFF; accent-color: ' + accentColor + '}');
    addStyle('.MTSpacerClass {margin-top: 4px; margin-bottom: 4px; border-bottom: 1px solid ' + lineForground +';}');
    addStyle('.MTSpacerClassTR {padding: 0px 0px 0px 0px;}');
    addStyle('.MTSpacerClass2 {margin-bottom: 0px;border-bottom: 1px solid ' + borderColor +';}');
    addStyle('.MThRefClass {' + standardText + '}');
    addStyle('.MTFlexButtonExport, .MTFlexButton1, .MTFlexButton2 {' + panelBackground + standardText + 'margin-left: 20px; font-weight: 500; border: 1px solid ' + borderColor + '; box-shadow: rgba(8, 40, 100, 0.1) 0px 1px 2px; font-size: 14px; padding: 7.5px 12px;cursor: pointer;border-radius: 4px;line-height: 150%;}');
    addStyle('.MTFlexContainer {display:block; padding: 20px;}');
    addStyle('.MTFlexContainer2 {margin: 0px;  gap: 20px;  display: flex; }');
    addStyle('.MTFlexContainerPanel { display: flex; flex-flow: column; place-content: stretch flex-start; ' + panelBackground + 'border-radius: 8px; box-shadow: rgba(8, 40, 100, 0.04) 0px 4px 8px;}');
    addStyle('.MTFlexContainerCard {  display: flex; flex: 1 1 0%; justify-content: space-between; padding: 16px 24px; align-items: center;' + panelBackground + 'border-radius: 8px; box-shadow: rgba(8, 40, 100, 0.04) 0px 4px 8px;}');
    addStyle('.MTFlexGrid {' + panelBackground + 'padding: 20px;border-spacing: 8px;}');
    addStyle('.MTFlexGrid th, td { padding-right: 8px;}');
    addStyle('.MTFlexTitle2 {display: flex; flex-flow: column;}');
    addStyle('.MTFlexGridTitleRow { font-size: 16px; font-weight: 500; height: 56px; position: sticky; top: 0; ' + panelBackground + '}');
    addStyle('.MTFlexGridTitleCell { border-bottom: 1px solid ' + borderColor + ';}');
    addStyle('.MTFlexGridTitleCell2 { text-align: right; border-bottom: 1px solid ' + borderColor + ';}');
    addStyle('.MTFlexGridTitleCell:hover, .MTFlexGridTitleCell2:hover, .MTFlexGridDCell:hover, .MTFlexGridSCell:hover, .MThRefClass:hover, .MTSideDrawerDetail2:hover {cursor:pointer; color: rgb(50, 170, 240);}');
    addStyle('.MTFlexGridRow { font-size: 14px; font-weight: 500; height: 40px; vertical-align: bottom;}');
    addStyle('.MTFlexGridItem { font-size: 14px; ; height: 26px }');
    addStyle('.MTFlexGridHCell { font-size: 15px;}');
    addStyle('.MTFlexGridHCell2 { text-align: right; font-size: 15px;}');
    addStyle('.MTFlexGridDCell, .MTFlexGridD3Cell {' + standardText +' }');
    addStyle('.MTFlexGridDCell2 { text-align: right; }');
    addStyle('.MTFlexGridSCell,.MTFlexGridS3Cell { padding-bottom: 18px; vertical-align:top; height: 36px;' + standardText + ' font-weight: 500; border-top: 1px solid ' + borderColor + ';}');
    addStyle('.MTFlexGridSCell2 { text-align: right; padding-bottom: 18px; vertical-align:top; height: 36px;' + standardText + ' font-weight: 500; border-top: 1px solid ' + borderColor + ';}');
    addStyle('.MTFlexCardBig {font-size: 20px; ' + standardText + 'font-weight: 500; padding-top: 8px;}');
    addStyle('.MTFlexBig {font-size: 18px; ' + standardText + 'font-weight: 500; padding-top: 8px;}');
    addStyle('.MTFlexSmall {font-size: 12px;' + panelText + 'font-weight: 600; padding-top: 8px; text-transform: uppercase; line-height: 150%; letter-spacing: 1.2px;}');
    addStyle('.MTFlexLittle {font-size: 10px;' + panelText + 'font-weight: 600; padding-top: 8px; text-transform: uppercase; line-height: 150%; letter-spacing: 1.2px;}');
    addStyle('.MTFlexCellArrow, .MTTrendCellArrow, .MTTrendCellArrow2 {' + panelBackground + standardText + 'width: 24px; height:24px; font-size: 18px; font-family: MonarchIcons, sans-serif; transition: 0.1s ease-out; cursor: pointer; border-radius: 100%; border-style: none;}');
    addStyle('.MTFlexCellArrow:hover {border: 1px solid ' + sidepanelBackground + '; box-shadow: rgba(8, 40, 100, 0.1) 0px 1px 2px;}');
    addStyle('.MTIcons {font-family: MonarchIcons; margin-left: 4px; vertical-align:middle;}');
    addStyle('.MTSideDrawerRoot {position: absolute;  inset: 0px;  display: flex;  -moz-box-pack: end;  justify-content: flex-end;}');
    addStyle('.MTSideDrawerContainer {overflow: hidden; padding: 12px; width: 640px; -moz-box-pack: end; ' + sidepanelBackground + ' position: relative; overflow:auto;}');
    addStyle('.MTSideDrawerMotion {display: flex; flex-direction: column; transform:none;}');
    addStyle('.MTSideDrawerHeader { ' + standardText + ' padding: 12px; }');
    addStyle('.MTSideDrawerItem { font-size: 14px;  margin-bottom: 10px;  place-content: stretch space-between;  display: flex;');
    addStyle('.MTSideDrawerDetail { ' + standardText + ' width: 24%; text-align: right; font-size: 13px; }');
    addStyle('.MTSideDrawerDetail2 { ' + standardText + ' width: 24%; text-align: right; font-size: 12px; }');
    addStyle('.MTSideDrawerDetail3 { ' + standardText + ' width: 13px; text-align: center; font-size: 13px; font-family: MonarchIcons, sans-serif !important; }');
    addStyle('.dropbtn {' + panelBackground + standardText + '; border: none; cursor: pointer;}');
    addStyle('.dropbtn:hover, .dropbtn:focus {' + selectBackground + selectForground + '}');
    addStyle('.MTdropdown {float: right;  position: relative; display: inline-block; font-weight: 200;}');
    addStyle('.MTdropdown-content div {font-size: 0px; line-height: 2px; background-color: #ff7369;}');
    addStyle('.MTdropdown-content {' + panelBackground + standardText + ';display:none; position: absolute; min-width: 300px; overflow: auto; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px; right: 0; z-index: 1;}');
    addStyle('.MTdropdown-content a {' + panelBackground + standardText + ';font-size: 16px; padding: 10px 10px; display: block;}');
    addStyle('.MTFlexdown {float: right;  position: relative; display: inline-block; font-weight: 200;}');
    addStyle('.MTFlexdown-content div {font-size: 0px; line-height: 2px; background-color: #ff7369;}');
    addStyle('.MTFlexdown-content {' + panelBackground + standardText + ';display:none; margin-top: 12px; padding: 12px; position: absolute; min-width: 260px; overflow: auto; border-radius: 8px; border: 1px solid ' + borderColor + '; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px; right: 0; z-index: 1;}');
    addStyle('.MTFlexdown-content a {' + panelBackground + standardText + ';font-size: 16px; text-align: left; border-radius: 8px; font-weight: 200; padding: 10px 10px; display: block;}');
    addStyle('.MTdropdown a:hover {' + selectBackground + selectForground + ' }');
    addStyle('.show {display: block;}');
    addStyle('.Toast__Root-sc-1mbc5m5-0 {display: ' + getDisplay(getCookie("MT_HideToaster",false),'block;') + '}');
    addStyle('.ReportsTooltipRow__Diff-k9pa1b-3 {display: ' + getDisplay(getCookie("MT_HideTipDiff",false),'block;') + '}');
    addStyle('.AccountNetWorthCharts__Root-sc-14tj3z2-0 {display: ' + getDisplay(getCookie("MT_HideAccountsGraph",false),'block;') + '}');
}

function MM_MenuFix() {
    MM_hideElement("[href~='/settings/referrals']",getCookie('MT_Ads',true));
    MM_hideElement("[href~='/advice']",getCookie('MT_Advice',true));
    MM_hideElement("[href~='/investments']",getCookie('MT_Investments',true));
    MM_hideElement("[href~='/objectives']",getCookie('MT_Goals',true));
    MM_hideElement("[href~='/recurring']",getCookie('MT_Recurring',true));
    MM_hideElement("[href~='/plan']",getCookie('MT_Budget',true));
}

function MM_RefreshAll() {
    if (localStorage.getItem('MT:LastRefresh') != getDates('s_FullDate')) {
        if(getCookie('MT_RefreshAll',true) == 1) {refreshAccountsData();}}}

function MM_hideElement(InList,InValue) {
    const els = document.querySelectorAll(InList);
    for (const el of els) { InValue == 1 ? el.style.display = 'none' : el.style.display = ''; }}

// [ Flex Queue ]
function MF_QueueAddTitle(p) {
    if(p.isHidden == undefined || p.isHidden == null) {p.isHidden = false;}
    MTFlexTitle.push({"Col": p.Column, "Title": p.Title,"isSortable": p.isSortable, "Width": p.Width, "Format": p.Format, "ShowPercent": p.ShowPercent, "ShowPercentShade": p.ShowPercentShade, "ShowSort": p.ShowSort, "isHidden": p.isHidden});
    MTFlexTitle.sort((a, b) => (a.Col - b.Col));}

function MF_QueueAddRow(p) {
    MTFlexCR = MTFlexRow.length;
    if(p.PK == undefined || p.PK == null) {p.PK = '';}
    if(p.SK == undefined || p.SK == null) {p.SK = '';}
    MTFlexRow.push({"Num": MTFlexCR, "isHeader": p.isHeader, "BasedOn": p.BasedOn, "IgnoreShade": p.IgnoreShade, "Section": p.Section, "PK": p.PK, "SK": p.SK, "UID": p.UID,"PKHRef": p.PKHRef, "PKTriggerEvent": p.PKTriggerEvent, "SKHRef": p.SKHRef, "SKTriggerEvent": p.SKTriggerEvent, "Icon": p.Icon });
    for (let j = 1; j < MTFlexTitle.length; j += 1) {if(MTFlexTitle[j].Format > 0) {MTFlexRow[MTFlexCR][MTFields+j] = 0;}}}

function MF_QueueAddCard(p) {
    MTFlexCard.push({"Col": p.Col, "Title": p.Title,"Subtitle": p.Subtitle, "Style": p.Style});}

async function MF_GridInit(inName, inDesc) {

    document.body.style.cursor = "wait";
    let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
    if(topDiv) {
        let div = cec('div','MTWait',topDiv,'','','','');
        div = cec('div','MTWait2',div,'Please Wait','','','');
        div = cec('p','',div,' Loading ' + inDesc + ' ...','','','');
    }
    MTFlex = [];MTFlexTitle = [];MTFlexRow = []; MTFlexCR = 0;MTFlexCard = [];
    MTFlexReady = false;MTFlex.Name = inName;

    if(window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const getButton1 = params.get('MTButton1');
        const getButton2 = params.get('MTButton2');
        if(getButton1 != null) {setCookie(inName + 'Button1',getButton1);}
        if(getButton2 != null) {setCookie(inName + 'Button2',getButton2);}
    }

    MTFlex.Button1 = Number(getCookie(inName + 'Button1',true));
    MTFlex.Button2 = Number(getCookie(inName + 'Button2',true));
    MTFlex.Button3 = getCookie(inName + 'Button3',false);
    await buildCategoryGroups();
}

function MT_GridDraw(inRedraw) {

    removeAllSections('div.MTWait');
    removeAllSections(['div.MTFlexContainer','table.MTFlexGrid'][inRedraw]);
    if(inRedraw == false) {MT_GridDrawContainer();}
    MT_GridDrawSort();
    MT_GridDrawDetails();
    MTFlexSum = [0,0];
    if(inRedraw == false) {MT_GridDrawCards();}
    document.body.style.cursor = "";
}

function MT_GridDrawDetails() {

    let el = null, elx = null;
    let Header = null, pct = null;
    let useDesc = '', useStyle = '', useStyle2 = '';
    let useValue = 0, useValue2 = '', workValue = 0;
    let rowNdx = 0, RowI = 0;
    let Subtotals = [], Grouptotals = [], SubtotalsNdx = 0;
    let ArrowSpacing = 'width: 34px; padding-left: 0px;';
    let hide = getChecked(MTFlex.Button3,'');

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

    function MT_GridDrawClear() { for (let j=0; j < MTFlexTitle.length; j += 1) {Grouptotals[j] = 0;}}

    function MT_GridDrawTitles() {

        Header = cec('table','MTFlexGrid',MTFlexDetails,'','','','');
        el = cec('tr','MTFlexGridTitleRow',Header,'','','','');
        for (RowI = 0; RowI < MTFlexTitle.length; RowI += 1) {
            if(MTFlexTitle[RowI].isHidden != true) {
                if(MTFlexTitle[RowI].Format > 0) {useStyle = 'MTFlexGridTitleCell2'; } else {useStyle = 'MTFlexGridTitleCell'; }
                elx = cec('td',useStyle,el,MTFlexTitle[RowI].Title + ' ' + MTFlexTitle[RowI].ShowSort,'','Column',RowI.toString());
                if(MTFlexTitle[RowI].Width != '') {elx.style = 'width: ' + MTFlexTitle[RowI].Width;}
            }
        }
        if(MTFlex.TriggerEvents) { elx = cec('td',useStyle,el,'','','style',ArrowSpacing);}
    }

    function MT_GridDrawRow(isSubTotal) {

        let useRow = Object.assign({}, MTFlexRow[RowI]);
        if(isSubTotal == false) {
            if(useRow.isHeader == true) {
                el = cec('tr','MTFlexGridRow',Header);
                useStyle = 'MTFlexGridHCell';
                Subtotals[SubtotalsNdx] = RowI;
                SubtotalsNdx+=1;
            } else {
                let el2 = cec('tr','MTSpacerClassTR',Header,'','','style',hide);
                let el3 = cec('td','MTSpacerClassTR',el2,'','','colspan',MTFlexTitle.length);
                cec('div','MTSpacerClass2',el3);
                el = cec('tr','MTFlexGridItem',Header);
                useStyle = 'MTFlexGridDCell';
            }
            useDesc = useRow[MTFields];
            if(useRow.Icon) {useDesc = useRow.Icon + ' ' + useDesc;}
            if(useRow.SKHRef) {
                elx = cec('td',useStyle,el);
                elx = cec('a',useStyle,elx,useDesc,useRow.SKHRef);
            } else {
                elx = cec('td',useStyle,el,useDesc);
            }
        } else {
            if(useRow.isHeader == true) {return;}
            if(MTFlex.Subtotals != true) {return;}
            for (let j = 0; j < MTFlexTitle.length; j += 1) {useRow[MTFields + j + 1] = Grouptotals[j];}
            useRow.IgnoreShade = true;
            useDesc = useRow.PK;
            el = cec('tr','MTFlexGridItem',Header);
            if(useRow.PKHRef) {
                elx = cec('td','MTFlexGridSCell',el);
                elx = cec('a','MTFlexGridDCell',elx,useDesc,useRow.PKHRef);
            } else {
                elx = cec('td','MTFlexGridS3Cell',el,useDesc);
            }
            useStyle = 'MTFlexGridSCell';
        }

        useStyle = useStyle + '2';
        for (let j = 1; j < MTFlexTitle.length; j += 1) {
            if(MTFlexTitle[j].isHidden != true) {
                useValue = useRow[j + MTFields];
                if(MTFlexTitle[j].Format == 0) {
                    if(isSubTotal == false) {
                        cec('td','MTFlexGridD3Cell',el,useValue,'','','');
                    } else {
                        cec('td',useStyle,el,useValue,'','','');
                    }
                } else {
                    if(MTFlexTitle[j].Format == 2) { useValue2 = getDollarValue(useValue,true);} else {useValue2 = getDollarValue(useValue,false);}
                    useStyle2 = '';
                    if((MTFlexTitle[j].ShowPercent) > 0) {
                        switch (MTFlexTitle[j].ShowPercent) {
                            case 1:
                                pct = MT_GridPercent(useRow[j + MTFields - 2],useRow[j + MTFields - 1],MTFlexTitle[j].ShowPercentShade,1,useRow.IgnoreShade);
                                break;
                            case 3:
                                pct = MT_GridPercent(useRow[j + MTFields - 5],useRow[j + MTFields - 1],MTFlexTitle[j].ShowPercentShade,1,useRow.IgnoreShade);
                                break;
                            case 2:
                                rowNdx = useRow.BasedOn -1;rowNdx = Subtotals[rowNdx];workValue = MTFlexRow[rowNdx][j + MTFields];
                                pct = MT_GridPercent(workValue,useValue,MTFlexTitle[j].ShowPercentShade,2,useRow.IgnoreShade);
                                break;
                        }
                        useValue2 = useValue2 + ' ' + pct[0];
                        useStyle2 = pct[1];
                    }
                    if(useStyle2 == '') { useStyle2 = MT_GridDrawEmbed(useRow.Section,j,useValue,useDesc);}
                    if(useStyle2) {elx = cec('td',useStyle,el,useValue2,'','style',useStyle2);} else {elx = cec('td',useStyle,el,useValue2,'','','');}
                    Grouptotals[j-1] += useValue;
                }
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

    let cn = MTFlex.Name + 'Sort' + (MTFlex.SortSeq ? MTFlex.SortSeq[MTFlex.Button2] : '');
    let useSort = getCookie(cn, true);
    useSort = Math.abs(useSort) > MTFlexTitle.length ? 0 : useSort;
    const useCol = MTFields + Math.abs(useSort);

    MTFlexRow.forEach(row => { row.SK = row[useCol]; });
    MTFlexTitle.forEach((title, i) => {title.ShowSort = (i == useSort) ? '▲' : (i == Math.abs(useSort)) ? '▼' : '';});

    const sortable = MTFlexTitle[useCol - MTFields].isSortable;
    MTFlexRow.sort((a, b) => {
        const sectionDifference = a.Section - b.Section || a.PK.localeCompare(b.PK);
        const sortValue = useSort < 0 ? -1 : 1;
        switch (sortable) {
            case 1:
                return sectionDifference || sortValue * (a.SK.localeCompare(b.SK));
            case 2:
                return sectionDifference || sortValue * (b.SK - a.SK);
            default:
                return sectionDifference;
        }
    });
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
        } else {div2 = cec('span','MTFlexBig',div,MTFlex.Title2,'','','');}
        div2 = cec('span','MTFlexLittle',div,MTFlex.Title3,'','','');

        let tbs = cec('span','MTFlexButtonContainer',cht);

        div2 = cec('span','',tbs,'','','style','height: 38px; display: block; align-content: end;');
        MTFlex.bub = cec('div','MTBub',div2,'','','style','display: none;');
        MTFlex.bub5 = cec('div','MTBub1',MTFlex.bub,'','','','');
        MTFlex.bub2 = cec('div','MTBub1',MTFlex.bub,'','','','');
        MTFlex.bub1 = cec('div','MTBub1',MTFlex.bub,'','','','');

        div2 = cec('div','MTdropdown',tbs,'','','','');
        div2 = cec('button','MTFlexButtonExport',div2,'Export','','','');
        if(MTFlex.Button1Options) {
            div2 = cec('div','MTdropdown',tbs,'','','','');
            div2 = cec('button','MTFlexButton1',div2,MTFlex.Button1Options[MTFlex.Button1],'','','');
            let div3 = cec('span','MTIcons',div2,'','','','');
            let divContent = cec('div','MTFlexdown-content',div2,'','','id','MTDropdown1');
            for (let i = 0; i < MTFlex.Button1Options.length; i++) {
                div2 = cec('a','',divContent,MTFlex.Button1Options[i],SaveLocationPathName + "?MTButton1=" + i,'','');
            }
        }
        if(MTFlex.Button2Options) {
            div2 = cec('div','MTdropdown',tbs,'','','','');
            div2 = cec('button','MTFlexButton2',div2,MTFlex.Button2Options[MTFlex.Button2],'','','');
            let div3 = cec('span','MTIcons',div2,'','','','');
            let divContent = cec('div','MTFlexdown-content',div2,'','','id','MTDropdown2');
            for (let i = 0; i < MTFlex.Button2Options.length; i++) {
                div2 = cec('a','',divContent,MTFlex.Button2Options[i],SaveLocationPathName + "?MTButton2=" + i,'','');
            }
        }
        div2 = cec('div','MTdropdown',tbs,'','','','');
        div2 = cec('div','',div2,'Compress Grid','','style','margin-top: 12px; font-size: 14px; font-weight:500');
        div2 = cec('input','MTFlexCheckbox',div2,'','','style','margin-top: 2px;');
        div2.type = 'checkbox';if(MTFlex.Button3 == 'true') {div2.checked = 'true';}
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
            cec('span','MTFlexCardBig',div2,MTFlexCard[i].Title,'','style',MTFlexCard[i].Style);
            cec('span','MTFlexSmall',div2,MTFlexCard[i].Subtitle,'','style','text-align:center');
        }
    }
}
function MT_GridPercent(inA, inB, inHighlight, inPercent, inIgnoreShade) {

    if(isNaN(inA)) {inA = 0;}
    if(isNaN(inB)) {inB = 0;}

    let p = ['', ''];
    if (inA === 0 && inB === 0) return p;

    p[0] = inA > 0 ? (inPercent === 1 ? (inB - inA) / inA : Math.max(inB / inA, 0)) : 1;
    p[0] = Math.round(p[0] * 1000) / 10;

    if (inHighlight && !inIgnoreShade) {
        if (p[0] > 100) p[1] = 'background-color: #f7752d; color: black;';
        else if (p[0] > 50) p[1] = 'background-color: #f89155; color: black;';
        else if (p[0] > 25) p[1] = 'background-color: #fde0cf; color: black;';
        if (p[1]) p[1] += 'border-radius: 6px;';
    }

    p[0] = (p[0] > 1000) ? '(>1,000%)' :
            (p[0] < -1000) ? '(<1,000%)' :
            ` (${p[0].toFixed(1)}%)`;

    return p;
}

function MT_GridExport() {

    const CRLF = String.fromCharCode(13,10),c = ',';
    const MTFieldsEnd = MTFields + MTFlexTitle.length;
    let csvContent = '',useValue = '',k = 0;

    for (let i = 0; i < MTFlexTitle.length; i += 1) {
        if(MTFlexTitle[i].isHidden == false) { csvContent = csvContent + '"' + MTFlexTitle[i].Title + '"' + c;}
    };
    csvContent = csvContent + CRLF;

    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(i > 0 && MTFlexRow[i].Section != MTFlexRow[i-1].Section) { csvContent = csvContent + c + CRLF; }
        k = 0;
        for (let j = MTFields; j < MTFieldsEnd; j += 1) {
            if(MTFlexTitle[k].isHidden == false) {
                useValue = '';
                if(MTFlexRow[i][j] != undefined) {
                    switch(MTFlexTitle[k].Format) {
                        case 1: useValue = Number(MTFlexRow[i][j]).toFixed(2); break;
                        case 2: useValue = Math.round(Number(MTFlexRow[i][j])).toFixed(0); break;
                        default: useValue = MTFlexRow[i][j];
                    }
                }
                csvContent = csvContent + useValue + c;
            }
            k+=1;
        }
        csvContent = csvContent + CRLF;
    }
    downloadFile( MTFlex.Title1 +' - ' + MTFlex.Title2,csvContent);
}

function MT_GridDrawEmbed(inSection,inCol,inValue, inDesc) {
    switch (MTFlex.Name) {
        case 'MTTrend':
            if(MTFlex.Option2 < 3) {
                if((inSection == 2) && (inCol == 3 || inCol == 6)) {if(inValue > 0) {return css_green;}}
                if((inSection == 4) && (inCol == 3 || inCol == 6)) {if(inValue < 0) {return css_green;}}
            }
            break;
        case 'MTAccounts':
            if(MTFlex.Button2 < 7) {
                if((inSection == 2) && inCol == 8 ) {if(inValue < 0) {return css_red;}}
                if((inSection == 2) && inCol == 8 ) {if(inValue > 0) {return css_green;}}
                if((inSection == 2) && inCol == 10 ) {if(inValue < 0) {return css_red;}}
                if((inSection == 4) && inCol == 8 ) {if(inValue > 0) {return css_red;}}
                if((inSection == 4) && inCol == 8 ) {if(inValue < 0) {return css_green;}}
                if((inSection == 4) && inCol == 10 ) {if(inValue < 0) {return css_red;}}
            }
            break;
    }
    return '';
}

function MT_GridGetUID(inSec,inUID,inCol) {
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].UID == inUID && MTFlexRow[i].Section == inSec) {
            return MTFlexRow[i][MTFields + inCol];
    }}
    return 0;
}

function MT_GridUpdateUID(inUID,inCol,inValue) {
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].UID == inUID) {
            MTFlexRow[i][MTFields + inCol] = inValue;
            return;
    }}
    let p = [];
    p.UID = inUID;
    MF_QueueAddRow(p);
    MTFlexRow[MTFlexCR][MTFields + inCol] = inValue;
}

function MT_GridRollup(inSection,inRoll,inBasedOn,inName) {

    if(MTFlexRow.length == 0) {return;}
    let Subtotals = [];
    for (let i = 0; i < MTFlexTitle.length; i += 1) {Subtotals[i] = 0;}
    for (let i = 0; i < MTFlexRow.length; i += 1) {
         if(MTFlexRow[i].Section == inRoll) {
             for (let j = 1; j < MTFlexTitle.length; j += 1) { if(MTFlexTitle[j].Format > 0) {Subtotals[j] += MTFlexRow[i][MTFields + j];} }
    }}
    MTP = [];
    MTP.isHeader = true; MTP.IgnoreShade = true;MTP.Section = inSection;MTP.BasedOn = inBasedOn;MF_QueueAddRow(MTP);
    MTFlexRow[MTFlexCR][MTFields] = inName;
    for (let j = 1; j < MTFlexTitle.length; j += 1) {
        if(MTFlexTitle[j].Format > 0) {MTFlexRow[MTFlexCR][MTFields+j] = Subtotals[j];} else {MTFlexRow[MTFlexCR][MTFields+j] = '';}
    }
}

function MT_GridRollDifference(inSection,inA,inB,inBasedOn,inName,inOp) {

    let p1 = null, p2 = null;
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].Section == inA) {p1 = i;}
        if(MTFlexRow[i].Section == inB) {p2 = i;}
    }
    if(p1 == null || p2 == null) {return;}
    MTP = [];
    MTP.isHeader = true; MTP.IgnoreShade = true; MTP.Section = inSection; MTP.BasedOn = inBasedOn; MF_QueueAddRow(MTP);
    MTFlexRow[MTFlexCR][MTFields] = inName;
    for (let j = 1; j < MTFlexTitle.length; j += 1) {
        if(MTFlexTitle[j].Format > 0) {
            if(inOp == 'Add') {
                MTFlexRow[MTFlexCR][MTFields+j] = MTFlexRow[p1][MTFields+j] + MTFlexRow[p2][MTFields+j];
            } else {
                MTFlexRow[MTFlexCR][MTFields+j] = MTFlexRow[p1][MTFields+j] - MTFlexRow[p2][MTFields+j];
            }
            MTFlexRow[MTFlexCR][MTFields+j] = parseFloat(MTFlexRow[MTFlexCR][MTFields+j].toFixed(2));
        } else { MTFlexRow[MTFlexCR][MTFields+j] = ''; }
    }
}

function MT_GridCalcDifference(inSection,in1,in2,inCols,inOp) {

    let p1 = null, p2 = null, p3 = null;

    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].Section == inSection) {p1 = i;}
        if(MTFlexRow[i].Section == in1) {p2 = i;}
        if(MTFlexRow[i].Section == in2) {p3 = i;}
    }
    if(p1 == null || p2 == null || p3 == null) {return;}
    for (let i = 0; i < inCols.length; i += 1) {
        if(inOp == 'Add') {
            MTFlexRow[p1][MTFields + inCols[i]] = MTFlexRow[p2][MTFields + inCols[i]] + MTFlexRow[p3][MTFields + inCols[i]];
        } else { MTFlexRow[p1][MTFields + inCols[i]] = MTFlexRow[p2][MTFields + inCols[i]] - MTFlexRow[p3][MTFields + inCols[i]]; }
        MTFlexRow[p1][MTFields + inCols[i]] = parseFloat(MTFlexRow[p1][MTFields + inCols[i]].toFixed(2));
    }
}
function MT_GridCalcRange(inColumn,inStart,inEnd,inOp) {

    let useValue = 0, useCols = 0;
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        useValue = 0;useCols = 0;
        for ( let j = inStart; j <= inEnd; j += 1) {
            if(MTFlexTitle[j].isHidden == false && MTFlexRow[i][MTFields + j] != null ) {
                useCols +=1;
                if(inOp == 'Sub') {
                    useValue = useValue - MTFlexRow[i][MTFields + j];
                } else {
                    useValue = useValue + MTFlexRow[i][MTFields + j];
                }
            }
        }
        if(inOp == 'Avg') {
            if(useCols > 0) {MTFlexRow[i][MTFields + inColumn] = useValue / (useCols);} else {MTFlexRow[i][MTFields + inColumn] = 0;}
        } else { MTFlexRow[i][MTFields + inColumn] = useValue;}
    }
}

function MT_GridAddCard (inSec,inStart,inEnd,inOp,inPosMsg,inNegMsg,inPosColor,inNegColor,inAddRow,inAddCol) {
    let useValue = 0,useCells = 0,useRow='',useCol='';
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].Section == inSec) {
            for ( let j = inStart; j <= inEnd; j += 1) {
                if(MTFlexTitle[j].isHidden == false && MTFlexRow[i][MTFields + j] != null) {
                    useCells +=1;
                    if(inOp == 'HV') {
                        if(useValue == 0 || MTFlexRow[i][MTFields + j] > useValue) {useValue = MTFlexRow[i][MTFields + j];useCol = MTFlexTitle[j].Title;useRow=MTFlexRow[i][MTFields];}
                    } else {
                        if(useValue == 0 || MTFlexRow[i][MTFields + j] < useValue) {useValue = MTFlexRow[i][MTFields + j];useCol = MTFlexTitle[j].Title;useRow=MTFlexRow[i][MTFields];}
                    }
                }
            }
        }
    }
    if(useCells > 0 && useValue != 0) {
        if((useValue > 0 && inPosMsg != '') || (useValue < 0 && inNegMsg != '')) {
            let useMsg = '',useStyle='';
            if(useValue < 0) {useMsg = inNegMsg;useStyle=inNegColor;useValue = useValue * -1;} else {useMsg = inPosMsg;useStyle=inPosColor;}
            if(MTFlexTitle[inStart].Format == 2) {useValue = getDollarValue(useValue,true);} else {useValue = getDollarValue(useValue,false);}
            MTP = [];MTP.Col = MTFlexCard.length+1;
            if(inAddRow) {useMsg = useMsg + inAddRow + useRow;}
            if(inAddCol) {useMsg = useMsg + inAddCol + useCol;}
            MTP.Title = useValue;MTP.Subtitle = useMsg;MTP.Style = useStyle;
            MF_QueueAddCard(MTP);
            return 1;
        }
    }
    return 0;
}

// [ Reports Menu ]
function MenuReports(OnFocus) {

    if (SaveLocationPathName.startsWith('/reports/')) {
        if(OnFocus == false) {
            const pn = window.location.pathname;
            if(pn.startsWith('/reports/') == false) {
            }
        }
       if(OnFocus == true) {
           MenuReportsDataset();
           MenuReportsCustom();
        }
    }
}

function MenuReportsSetFilter(inType,inCategory,inGroup) {

    let reportsObj = localStorage.getItem('persist:reports');
    let startDate = formatQueryDate(getDates('d_Minus3Years'));
    let endDate = formatQueryDate(getDates('d_Today'));
    let useCats = '';
    if(inGroup) {useCats = getCategoryGroupList(inGroup);} else {useCats = '\\"' + inCategory + '\\"';}
    reportsObj = replaceBetweenWith(reportsObj,'"filters":"{','}','"filters":"{\\"startDate\\":\\"' + startDate + '\\",\\"endDate\\":\\"' + endDate + '\\",\\"categories\\":[' + useCats + ']}');
    reportsObj = replaceBetweenWith(reportsObj,'"groupByTimeframe":',',','"groupByTimeframe":"\\"month\\"",');
    reportsObj = replaceBetweenWith(reportsObj,'"' + inType + '":"{','}",','"' + inType + '":"{\\"viewMode\\":\\"changeOverTime\\",\\"chartType\\":\\"stackedBarChart\\"}",');
    if(inCategory) {reportsObj = replaceBetweenWith(reportsObj,'"groupBy":',',','"groupBy":"\\"category\\"",');
    } else {reportsObj = replaceBetweenWith(reportsObj,'"groupBy":',',','"groupBy":"\\"category_group\\"",');}
    localStorage.setItem('persist:reports',reportsObj);
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
    } else { cMenus[1] = document.querySelector('a.MTAccountsMenu');}
    for (let i = 0; i < cMenus.length; i += 1) {
         cMenus[i].className = cMenus[i].className.replace(' tab-nav-item-active','');
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

    await MF_GridInit('MTAccounts', 'Accounts');
    MTFlex.Title1 = 'Accounts';
    MTFlex.SortSeq = ['1','1','1','1','1','1','1','2','3','4','5'];
    MTFlex.TriggerEvent = true;
    MTFlex.TriggerEvents = false;
    MTFlex.Button1Options = ['Hide subtotals','Show subtotals'];
    MTFlex.Button2Options = ['This month','3 months', '6 months', 'This year', '1 year', '2 years', '3 years','Last 6 months with average','Last 12 months with average','This year with average','Last 3 years with average'];
    MTFlex.Subtotals = MTFlex.Button1;
    MTP = [];
    MTP.Column = 0; MTP.Title = 'Account';MTP.isSortable = 1; MTP.Format = 0; MF_QueueAddTitle(MTP);
    MTP.Column = 1; MTP.Title = 'Type'; MF_QueueAddTitle(MTP);
    if(MTFlex.Button2 > 6) {await MenuReportsAccountsGoExt();} else {await MenuReportsAccountsGoStd();}
    MTFlexReady = true;
}

async function MenuReportsAccountsGoExt(){

    let snapshotData = null, snapshotData3 = null
    let skipHidden = getCookie('MT_AccountsHidden',true);
    let CurMonth = getDates('n_CurMonth'),CurYear = 0;
    let NumMonths = (MTFlex.Button2 === 7) ? 6 : 12;
    let useDate = getDates('d_Minus1Year');

    MTFlex.Title2 = 'Last ' + NumMonths + ' Months as of ' + getDates('s_FullDate');
    MTFlex.Title3 = '(Based on beginning of each month)';

    if(MTFlex.Button2 == 9) {
        NumMonths = CurMonth;MTFlex.Title2 = 'This year as of ' + getDates('s_FullDate');
    }
    if (MTFlex.Button2 == 10) {
        useDate = getDates('d_ThisQTRs');
        CurMonth = useDate.getMonth();CurYear = useDate.getFullYear() - 3;
        CurMonth+=3; if(CurMonth == 12) {CurMonth = 0;CurYear+=1;}
        useDate.setFullYear(CurYear,CurMonth,1);
        MTFlex.Title2 = 'Last 3 years as of ' + getDates('s_FullDate');
        for (let i = 0; i < 12; i += 1) {
            MTP.Column = i+2; MTP.Title = getMonthName(CurMonth,true) + "'" + CurYear % 100;MTP.isSortable = 2;MTP.Format = 2;MF_QueueAddTitle(MTP);
            CurMonth+=3; if(CurMonth == 12) {CurMonth = 0;CurYear+=1;}
        }
        CurMonth = useDate.getMonth();CurYear = useDate.getFullYear();
    } else {
        for (let i = 0; i < 12; i += 1) {
            if(i < (12-NumMonths)) {MTP.isHidden = true;} else {MTP.isHidden = false;}
            MTP.Column = i+2; MTP.Title = getMonthName(CurMonth,true);MTP.isSortable = 2;MTP.Format = 2;MF_QueueAddTitle(MTP);
            CurMonth+=1; if(CurMonth == 12) {CurMonth = 0;}
        }
    }
    MTP.isHidden = false;
    MTP.Column = 14; MTP.Title = 'Current';MF_QueueAddTitle(MTP);
    MTP.Column = 15; MTP.Title = 'Average';MF_QueueAddTitle(MTP);

    snapshotData = await getAccountsData();
    for (let i = 0; i < snapshotData.accounts.length; i += 1) {
        MTP = [];
        MTP.isHeader = false;
        MTP.UID = snapshotData.accounts[i].id;
        if(snapshotData.accounts[i].isAsset == true) {
            MTP.BasedOn = 1;MTP.Section = 2;
        } else {
            MTP.BasedOn = 2; MTP.Section = 4;
        }
        if(MTFlex.Subtotals == 1) {
            MTP.PK = snapshotData.accounts[i].type.display;
        } else {
            MTP.PK = MTP.BasedOn.toString();
        }
        MTP.SKHRef = '/accounts/details/' + MTP.UID;
        MF_QueueAddRow(MTP);
        MTFlexRow[MTFlexCR][MTFields] = snapshotData.accounts[i].displayName;
        MTFlexRow[MTFlexCR][MTFields+1] = snapshotData.accounts[i].subtype.display;
        MTFlexRow[MTFlexCR][MTFields+14] = Number(snapshotData.accounts[i].displayBalance);
    }

    for (let i = 0; i < 12; i += 1) {
        let used = false;
        snapshotData3 = await getDisplayBalanceAtDateData(formatQueryDate(useDate));
        for (let j = 0; j < snapshotData3.accounts.length; j += 1) {
            MT_GridUpdateUID(snapshotData3.accounts[j].id,i+2,snapshotData3.accounts[j].displayBalance);
            if(snapshotData3.accounts[j].displayBalance != null) {used = true;};
        }
        if(MTFlex.Button2 == 10) {
            if(used == false) {MTFlexTitle[i+2].isHidden = true;}
            CurMonth+=3;
            if(CurMonth > 11) {CurMonth=0;CurYear+=1;}
            useDate.setFullYear(CurYear,CurMonth,1);
        } else {
            CurMonth+=1;
            if(CurMonth == 12) {
                CurMonth=0;
                useDate.setFullYear(useDate.getFullYear() + 1);
            }
            useDate.setMonth(CurMonth);
        }
    }
    if(MTFlex.Button2 == 9 && CurMonth == 0) {MTFlexTitle[2].isHidden = false;}
    MT_GridRollup(1,2,1,'Assets');
    MT_GridRollup(3,4,2,'Liabilities');
    MT_GridRollDifference(5,1,3,1,'Net Worth/Totals','Add');
    MT_GridCalcDifference(5,1,3,[2,3,4,5,6,7,8,9,10,11,12,13,14],'Sub');
    MT_GridCalcRange(15,2,13,'Avg');
    MT_GridAddCard(1,2,13,'HV','Highest Assets\nwere','',css_green,'','',' in ');
    MT_GridAddCard(3,2,13,'HV','Highest Liabilities\nwere','',css_red,'','', ' in ');
    MT_GridAddCard(2,2,13,'HV','Highest Asset','',css_green,'',' was with ', ' in ');
    MT_GridAddCard(4,2,13,'HV','Highest Liability','',css_red,'',' was with ', ' in ');
    MT_GridAddCard(3,15,15,'HV','Average Liabilities','',css_red,'','', '');
}
async function MenuReportsAccountsGoStd(){
    let isToday = getDates('isToday',AccountsTodayIs);
    if(isToday) {accountBalances = [];}

    let snapshotData = null, snapshotData2 = null, snapshotData3 = null,snapshotData4 = null;
    let useDateRange = ['d_StartofMonth','d_Minus3Months','d_Minus6Months','d_StartOfYear','d_Minus1Year','d_Minus2Years','d_Minus3Years','d_Minus4Years','d_Minus5Years'][MTFlex.Button2];
    let useDate = getDates(useDateRange,AccountsTodayIs);
    let useDate2 = AccountsTodayIs;
    let cards = 0,acard=[0,0,0,0,0];

    MTFlex.Title2 = getDates('s_FullDate',useDate) + ' - ' + getDates('s_FullDate',useDate2);

    MTP.Column = 2; MTP.Title = 'Updated';MF_QueueAddTitle(MTP);
    MTP.Column = 3; MTP.Title = 'Beg Balance'; MTP.isSortable = 2; MTP.Format = [1,2][getCookie('MT_AccountsNoDecimals',true)];MF_QueueAddTitle(MTP);
    if(MTFlex.Button2 > 0) { MTP.isHidden = true; }
    MTP.Column = 4; MTP.Title = 'Income'; MF_QueueAddTitle(MTP);
    MTP.Column = 5; MTP.Title = 'Expenses'; MF_QueueAddTitle(MTP);
    MTP.Column = 6; MTP.Title = 'Transfers'; MF_QueueAddTitle(MTP);
    MTP.isHidden = false;
    MTP.Column = 7; MTP.Title = 'Balance';MF_QueueAddTitle(MTP);
    if(getCookie('MT_AccountsHidePer2',true) == 0) {MTP.ShowPercent = 3;}
    MTP.Column = 8; MTP.Title = 'Net Change'; MF_QueueAddTitle(MTP);
    if(getCookie('MT_AccountsHidePending',true) == 1) {MTP.isHidden = true;}
    MTP.Column = 9; MTP.Title = 'Pending'; MTP.ShowPercent = 0; MF_QueueAddTitle(MTP);
    MTP.Column = 10; MTP.Title = 'Proj Balance'; MTP.ShowPercent = 0; MF_QueueAddTitle(MTP);

    let useBalance = 0, pastBalance = 0, useAmount = 0;
    let skipTxs = getCookie('MT_AccountsBalance',true);
    let skipHidden = getCookie('MT_AccountsHidden',true);

    snapshotData = await getAccountsData();
    snapshotData2 = await GetTransactions(formatQueryDate(useDate),formatQueryDate(useDate2),0,false);
    snapshotData3 = await getDisplayBalanceAtDateData(formatQueryDate(useDate));
    snapshotData4 = await GetTransactions(formatQueryDate(getDates('d_StartofLastMonth')),formatQueryDate(useDate2),0,true);

    for (let i = 0; i < 5; i += 1) { if(getCookie('MT_AccountsCard' + i.toString(),true) == 1) {cards+=1;}}
    for (let i = 0; i < snapshotData.accounts.length; i += 1) {

        if(snapshotData.accounts[i].hideFromList == false || skipHidden == 0) {

            MTP = [];
            MTP.isHeader = false;
            MTP.UID = snapshotData.accounts[i].id;
            if(isToday) {
                useBalance = Number(snapshotData.accounts[i].displayBalance);
            } else {
                useBalance = getAccountCacheBalance(MTP.UID);
            }
            if(useBalance == null) {useBalance = 0;}
            pastBalance = getAccountBalance(MTP.UID);
            if(pastBalance == null) {pastBalance = 0;}

            if(useBalance !=0 || getAccountUsed(MTP.UID) == true || pastBalance != 0) {
                if(snapshotData.accounts[i].isAsset == true) {
                    MTP.BasedOn = 1;MTP.Section = 2;
                } else {
                    MTP.BasedOn = 2; MTP.Section = 4;
                }
                if(MTFlex.Subtotals == 1) {
                    MTP.PK = snapshotData.accounts[i].type.display;
                } else {
                    MTP.PK = MTP.BasedOn.toString();
                }
                MTP.SKHRef = '/accounts/details/' + MTP.UID;
                MF_QueueAddRow(MTP);
                MTFlexRow[MTFlexCR][MTFields] = snapshotData.accounts[i].displayName;
                MTFlexRow[MTFlexCR][MTFields+1] = snapshotData.accounts[i].subtype.display;
                MTFlexRow[MTFlexCR][MTFields+2] = snapshotData.accounts[i].displayLastUpdatedAt.substring(0, 10);
                MTFlexRow[MTFlexCR][MTFields+7] = useBalance;

                if(snapshotData.accounts[i].hideTransactionsFromReports == false) {
                    for (let j = 0; j < snapshotData2.allTransactions.results.length; j += 1) {
                        if(snapshotData2.allTransactions.results[j].hideFromReports == false) {
                            if(snapshotData2.allTransactions.results[j].account.id == snapshotData.accounts[i].id) {
                                switch (snapshotData2.allTransactions.results[j].category.group.type) {
                                    case 'income':
                                        MTFlexRow[MTFlexCR][MTFields+4] += snapshotData2.allTransactions.results[j].amount;
                                        break;
                                    case 'expense':
                                        useAmount = snapshotData2.allTransactions.results[j].amount * -1;
                                        MTFlexRow[MTFlexCR][MTFields+5] += useAmount;
                                        MTFlexRow[MTFlexCR][MTFields+5] = parseFloat(MTFlexRow[MTFlexCR][MTFields+5].toFixed(2));
                                        break;
                                    case 'transfer':
                                        MTFlexRow[MTFlexCR][MTFields+6] += snapshotData2.allTransactions.results[j].amount;
                                        break;
                                }
                            }
                        }
                    }
                }
                MTFlexRow[MTFlexCR][MTFields+9] = getAccountPendingBalance(snapshotData.accounts[i].id);
                if(skipTxs == 1 && MTFlex.Button2 == 0 && (snapshotData.accounts[i].subtype.name == 'checking' || snapshotData.accounts[i].subtype.name == 'credit_card')) {
                    if(snapshotData.accounts[i].isAsset == true){
                        MTFlexRow[MTFlexCR][MTFields+3] = useBalance - MTFlexRow[MTFlexCR][MTFields+4] + MTFlexRow[MTFlexCR][MTFields+5] - MTFlexRow[MTFlexCR][MTFields+6];
                    } else {
                        MTFlexRow[MTFlexCR][MTFields+3] = useBalance - MTFlexRow[MTFlexCR][MTFields+4] - MTFlexRow[MTFlexCR][MTFields+5] + MTFlexRow[MTFlexCR][MTFields+6];
                    }
                } else {
                    MTFlexRow[MTFlexCR][MTFields+3] = pastBalance;
                }
                if(isToday) {updateAccountBalance(snapshotData.accounts[i].id,MTFlexRow[MTFlexCR][MTFields+3]);}
                MTFlexRow[MTFlexCR][MTFields+3] = parseFloat(MTFlexRow[MTFlexCR][MTFields+3].toFixed(2));
                MTFlexRow[MTFlexCR][MTFields+8] = useBalance - MTFlexRow[MTFlexCR][MTFields+3];
                MTFlexRow[MTFlexCR][MTFields+8] = parseFloat(MTFlexRow[MTFlexCR][MTFields+8].toFixed(2));
                MTFlexRow[MTFlexCR][MTFields+9] = parseFloat(MTFlexRow[MTFlexCR][MTFields+9].toFixed(2));
                MTFlexRow[MTFlexCR][MTFields+10] = MTFlexRow[MTFlexCR][MTFields+7] + MTFlexRow[MTFlexCR][MTFields+9];

                if(snapshotData.accounts[i].subtype.name == 'checking') {acard[0] = acard[0] + MTFlexRow[MTFlexCR][MTFields+7];}
                if(snapshotData.accounts[i].subtype.name == 'savings') {acard[1] = acard[1] + MTFlexRow[MTFlexCR][MTFields+7];}
                if(snapshotData.accounts[i].subtype.name == 'credit_card') {acard[2] = acard[2] + MTFlexRow[MTFlexCR][MTFields+7];}
                if(snapshotData.accounts[i].type.display == 'Investments') {acard[3] = acard[3] + MTFlexRow[MTFlexCR][MTFields+7];}
                if(snapshotData.accounts[i].subtype.display == '401k') {acard[4] = acard[4] + MTFlexRow[MTFlexCR][MTFields+7];}
                if((snapshotData.accounts[i].subtype.name == 'credit_card') && cards < 5) {
                    MTP = [];MTP.Col = cards;
                    MTP.Title = getDollarValue(MTFlexRow[MTFlexCR][MTFields+7],MTFlexTitle[3].Format == 2 ? true : false);
                    MTP.Subtitle = snapshotData.accounts[i].displayName;
                    MTP.Style = css_red;
                    MF_QueueAddCard(MTP);
                    cards+=1;
                }
            }
        }
    }

    cards=0;
    for (let i = 0; i < 5; i += 1) {
        if(getCookie('MT_AccountsCard' + i.toString(),true) == 1) {
            MTP = [];MTP.Col = cards;MTP.Title = getDollarValue(acard[i],MTFlexTitle[3].Format == 2 ? true : false);MTP.Subtitle = 'Total ' + ['Checking', 'Savings', 'Credit Cards', 'Investments','401k'][i];
            MTP.Style = [css_green,css_green,css_red,css_green,css_green][i];MF_QueueAddCard(MTP);
        }
    }

    MT_GridRollup(1,2,1,'Assets');
    MT_GridRollup(3,4,2,'Liabilities');
    MT_GridRollDifference(5,1,3,1,'Net Worth/Totals','Add');
    MT_GridCalcDifference(5,1,3,[3,7,8,10],'Sub');

    function getAccountBalance(inId) {
        for (let k = 0; k < snapshotData3.accounts.length; k++) {
            if(snapshotData3.accounts[k].id == inId ) { return snapshotData3.accounts[k].displayBalance; }
        }
        return 0;
    }
    function getAccountPendingBalance(inId) {
        let amt = 0;
        for (let j = 0; j < snapshotData4.allTransactions.results.length; j += 1) {
            if(snapshotData4.allTransactions.results[j].account.id == inId) {
                amt = amt + snapshotData4.allTransactions.results[j].amount;
            }
        }
        amt = amt * -1;return amt;
    }
    function getAccountUsed(inId) {
        for (let k = 0; k < snapshotData2.allTransactions.results.length; k++) {
            if(snapshotData2.allTransactions.results[k].account.id == inId) { return true; }
        }
        return false;
    }
}

async function MenuReportsTrendsGo() {

    TrendQueue = [];
    await MF_GridInit('MTTrend', 'Trends');
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

    MTFlex.TriggerEvent = true;
    MTFlex.TriggerEvents = true;
    MTFlex.Button1Options = ['By group','By category','By both'];
    MTFlex.Button2Options = ['Compare last month','Compare same month','Compare same quarter','This year by month','Last year by month','Last 12 months by month', 'Two years ago by month', 'Three years ago by month', 'All years by year'];
    MTFlex.SortSeq = ['1','1','1','2','2','2','2','2','2'];
    if(MTFlex.Button1 == 2) {MTFlex.Subtotals = true;}

    MTP = [];
    MTP.Column = 0; MTP.Title = ['Group','Category','Group/Category'][MTFlex.Button1]; MTP.isSortable = 1; MTP.Format = 0;
    MF_QueueAddTitle(MTP);

    if(MTFlex.Button2 > 2) {
        MTP.isSortable = 2;MTP.Format = 2;
        MTP.Column = 13; MTP.Title = 'Total';
        MF_QueueAddTitle(MTP);
        MTP.Column = 14; MTP.Title = 'Avg';
        MF_QueueAddTitle(MTP);
        MTFlex.Title1 = 'Net Income Trend Report by Month';
        let newCol = 1;
        if(MTFlex.Button2 == 3) {
            if(getCookie('MT_TrendIgnoreCurrent',true) == 1) { MTFlex.Title3 = '* Average ignores Current Month'; }
            for (let i = 0; i < 12; i += 1) {
                MTP.Column = newCol; MTP.Title = getMonthName(i,true);
                newCol+=1;
                if(i > month2) {MTP.isHidden = true;}
                MF_QueueAddTitle(MTP);
            }
        } else if (MTFlex.Button2 == 4 || MTFlex.Button2 == 6 || MTFlex.Button2 == 7) {
            year-=1;
            if(MTFlex.Button2 == 6) {year-=1;}
            if(MTFlex.Button2 == 7) {year-=2;}
            lowerDate.setFullYear(year);
            higherDate.setFullYear(year,11,31);
            for (let i = 0; i < 12; i += 1) {
                MTP.Column = newCol; MTP.Title = getMonthName(i,true);
                newCol+=1;
                MF_QueueAddTitle(MTP);
            }
        } else if (MTFlex.Button2 == 8) {
            lowerDate.setFullYear(year - 12);
            for (let i = year - 11; i <= year; i += 1) {
                MTP.Column = newCol; MTP.Title = i.toString();
                newCol+=1;
                MF_QueueAddTitle(MTP);
            }
        } else if (MTFlex.Button2 == 5) {
            if(getCookie('MT_TrendIgnoreCurrent',true) == 1) { MTFlex.Title3 = '* Average ignores Current Month'; }
            for (let i = month2 + 1; i < 12; i += 1) {
                MTP.Column = newCol; MTP.Title = getMonthName(i,true);
                newCol+=1;
                MF_QueueAddTitle(MTP);
            }
            for (let i = 0; i <= month2; i += 1) {
                MTP.Column = newCol; MTP.Title = getMonthName(i,true);
                newCol+=1;
                MF_QueueAddTitle(MTP);
            }
            if(month2 < 11) {
                month2+=1;
                lowerDate.setMonth(month2);
                year2-=1;
                lowerDate.setFullYear(year2);
            }
        }

        MTFlex.Title2 = getDates('s_FullDate',lowerDate) + ' - ' + getDates('s_FullDate',higherDate);
        if(MTFlex.Button2 == 8) {
            await BuildTrendData('oy',MTFlex.Button1,'year',lowerDate,higherDate,'');
        } else {
            await BuildTrendData('ot',MTFlex.Button1,'month',lowerDate,higherDate,'');
        }
        await WriteByMonthData();
    } else {
        let useFormat = 1;
        if(getCookie('MT_NoDecimals',true) == 1) {useFormat = 2;}
        MTFlex.Title1 = 'Net Income Trend Report';
        MTFlex.Title2 = getDates('s_FullDate',lowerDate) + ' - ' + getDates('s_FullDate',higherDate);
        if(TrendFullPeriod == 1) { MTFlex.Title3 = '* Comparing to End of Month'; }

        // this year
        MTP = [];
        MTP.Column = 5; MTP.Title = 'YTD ' + year; MTP.isSortable = 2; MTP.Width = '14%'; MTP.Format = useFormat; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
        MF_QueueAddTitle(MTP);
        await BuildTrendData('cp',MTFlex.Button1,'year',lowerDate,higherDate,'');

        // last year
        year-=1;
        lowerDate.setFullYear(year);
        higherDate.setFullYear(year);
        MTP = [];
        MTP.Column = 4; MTP.Title = 'YTD ' + year; MTP.isSortable = 2; MTP.Format = useFormat; MTP.Width = '14%'; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
        MF_QueueAddTitle(MTP);
        MTP.Column = 6; MTP.Title = 'Difference'; MTP.Format = useFormat; MTP.Width = '14%';MTP.ShowPercentShade = true;
        if(getCookie('MT_TrendHidePer2',true) != true) {MTP.ShowPercent = 1;}
        MF_QueueAddTitle(MTP);
        await BuildTrendData('lp',MTFlex.Button1,'year',lowerDate,higherDate,'');

        // This Period
        let useTitle = '';
        year+=1;
        month = month2;
        lowerDate.setFullYear(year,month,1);
        higherDate.setFullYear(year2,month2,day2);

        if(MTFlex.Button2 == 2) {
            const QtrDate = getDates('i_ThisQTRs',TrendTodayIs);
            month = parseInt(QtrDate.substring(0,2)) - 1;
            lowerDate.setMonth(month);
            if(month != month2) {useTitle = getMonthName(month,true) + ' - ';}
        }
        if(MTFlex.Button2 == 1) {
            if(TrendFullPeriod == 1) {
                day2 = daysInMonth(month2,year2);
                higherDate.setDate(day2);
            }
        }

        useTitle = useTitle + getMonthName(month2,true) + ' ' + year;
        MTP = [];
        MTP.Column = 2; MTP.Title = useTitle; MTP.isSortable = 2; MTP.Width = '14%'; MTP.Format = useFormat; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
        MF_QueueAddTitle(MTP);
        await BuildTrendData('cm',MTFlex.Button1,'year',lowerDate,higherDate,'');

        // Last Period
        let forceEOM = false;
        if(daysInMonth(month,year) == day2) { forceEOM = true; }

        useTitle = '';
        if(MTFlex.Button2 == 0) {
            month-=1;
            if(month < 0) { month = 11; year = year - 1;}
            month2 = month;year2 = year;
            lowerDate.setFullYear(year,month,1);
            higherDate.setFullYear(year2,month2,1);

            let x = daysInMonth(month,year);
            if(day2 > x) { day2 = x; }
            if(forceEOM == true) {day2 = x;}
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
        MTP.Column = 1; MTP.Title = useTitle; MTP.isSortable = 2; MTP.Format = useFormat; MTP.Width = '14%'; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
        MF_QueueAddTitle(MTP);
        MTP = [];
        MTP.Column = 3; MTP.Title = 'Difference'; MTP.isSortable = 2; MTP.Format = useFormat; MTP.Width = '14%'; MTP.ShowPercentShade = true;
        if(getCookie('MT_TrendHidePer2',true) != true) {MTP.ShowPercent = 1;}
        MF_QueueAddTitle(MTP);

        await BuildTrendData('lm',MTFlex.Button1,'year',lowerDate,higherDate,'');
        await WriteCompareData();
    }
    MTFlexReady = true;
}

async function WriteByMonthData() {

    let useDesc = '',lowestMonth = 13,useURL = '';
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        let retGroup = await getCategoryGroup(MTFlexRow[i].UID);
        if(retGroup.TYPE == 'transfer') {
            MTFlexRow[i].UID = '';
        } else {
            if(retGroup.TYPE == 'expense') {
                MTFlexRow[i].BasedOn = 2;
                MTFlexRow[i].Section = 4;
                for (let j = 1; j < MTFlexTitle.length; j += 1) {
                    if(MTFlexRow[i][MTFields + j] != 0) {
                        if(j < lowestMonth) {lowestMonth = j;}
                        MTFlexRow[i][MTFields + j] = MTFlexRow[i][MTFields + j] * -1;
                    }
                }
                 useURL = '#|spending|';
            } else {
                MTFlexRow[i].BasedOn = 1;
                MTFlexRow[i].Section = 2;
                useURL = '#|income|';
            }
            if(MTFlex.Button1 > 0) {
                if(MTFlex.Button1 == 2) {
                    MTFlexRow[i].PK = retGroup.GROUPNAME;
                    MTFlexRow[i].PKHRef = useURL + '|' + retGroup.GROUP + '|';
                    MTFlexRow[i].PKTriggerEvent = 'category-groups|' + retGroup.GROUP;
                }
                MTFlexRow[i].SKHRef = useURL + retGroup.ID + '|';
                MTFlexRow[i].SKTriggerEvent = 'categories|' + retGroup.ID;
                useDesc = retGroup.NAME;
            } else {
                useDesc = retGroup.GROUPNAME;
                MTFlexRow[i].SKHRef = useURL + '|' + retGroup.GROUP + '|';
                MTFlexRow[i].PKTriggerEvent = '';
                MTFlexRow[i].SKTriggerEvent = 'category-groups|' + retGroup.GROUP;
            }
            MTFlexRow[i].Icon = retGroup.ICON;
            MTFlexRow[i].SKExpand = '';
            MTFlexRow[i][MTFields] = useDesc;
        }
    }
    for(let i = MTFlexRow.length - 1; i >= 0; i--){ if(MTFlexRow[i].UID == '') {const x = MTFlexRow.splice(i, 1);}}
    if(MTFlex.Button2 == 8) {
        for(let i = 1; i <= 12; i++){ if(i < lowestMonth) {MTFlexTitle[i].isHidden = true;}}
        MTFlex.Title2 = MTFlex.Title2.substring(0, 7) + MTFlexTitle[lowestMonth].Title + MTFlex.Title2.substring(11);
        MTFlex.Title1 = 'Net Income Trend Report by Year';
    }
    MT_GridRollup(1,2,1,'Income');
    MT_GridRollup(3,4,2,'Spending');
    MT_GridRollDifference(5,1,3,1,'Savings','Sub');
    MT_GridCalcRange(13,1,12,'Add');

    lowestMonth = 12;
    if(getCookie('MT_TrendIgnoreCurrent',true) == 1) {if(MTFlex.Button2 == 3 || MTFlex.Button2 == 5) {lowestMonth = 11;}}
    if(MTFlex.Button2 == 8) {lowestMonth = 11;}
    MT_GridCalcRange(14,1,lowestMonth,'Avg');
    MT_GridAddCard(1,13,13,'HV','Total Income','',css_green,'','', '');
    MT_GridAddCard(3,13,13,'HV','Total Expenses','',css_red,'','', '');
    MT_GridAddCard(5,13,13,'HV','Total Savings','Total Overspent',css_green,css_red,'', '');
    MT_GridAddCard(2,2,12,'HV','Highest Income','',css_green,'',' was with ', ' in ');
    MT_GridAddCard(4,2,12,'HV','Highest Expense','',css_red,'',' was with ', ' in ');
}

async function WriteCompareData() {

    let useDesc = '',Numcards=0, useURL = '';
    let useFormat = false;
    if(getCookie('MT_NoDecimals',true) == 1) {useFormat = true;}

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
                 useURL = '#|spending|';
             }
             if(retGroup.TYPE == 'income') {
                 MTP.BasedOn = 1;
                 MTP.Section = 2;
                 MTP.IgnoreShade = true;
                 useURL = '#|income|';
             }
             MTP.isHeader = false;
             if(MTFlex.Button1 > 0) {
                 if(MTFlex.Button1 == 2) {
                     MTP.PK = retGroup.GROUPNAME;
                     MTP.PKHRef = useURL + '|' + retGroup.GROUP + '|';
                     MTP.PKTriggerEvent = 'category-groups|' + retGroup.GROUP + '|';
                 }
                 MTP.SKHRef = useURL + retGroup.ID + '|';
                 MTP.SKTriggerEvent = 'categories|' + retGroup.ID + '|';
                 useDesc = retGroup.NAME;
             } else {
                 useDesc = retGroup.GROUPNAME;
                 MTP.SKHRef = useURL + '|' + retGroup.GROUP + '|';
                 MTP.PKTriggerEvent = '';
                 MTP.SKTriggerEvent = 'category-groups|' + retGroup.GROUP + '|';
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
         }
    }
    MT_GridRollup(1,2,1,'Income');
    MT_GridRollup(3,4,2,'Spending');
    MT_GridRollDifference(5,1,3,1,'Savings','Sub');
    Numcards = Numcards + MT_GridAddCard(4,6,6,'HV','Over spending YTD','',css_red,'','\nmost in ','');
    Numcards = Numcards + MT_GridAddCard(4,3,3,'HV','Over spending ' + ['vs same month','vs last month','vs same quarter'][MTFlex.Button2],'',css_red,'','\nmost in ','');
    if(Numcards < 2) {
        Numcards = Numcards + MT_GridAddCard(3,2,2,'HV','Total Spending','','',css_red,'','');
    }
    if(Numcards < 2) {
        Numcards = Numcards + MT_GridAddCard(4,6,6,'LV','','Saving YTD','',css_green,'\nmost in ','');
    }
    Numcards = Numcards + MT_GridAddCard(1,6,6,'HV','More Total Income YTD','Less Total Income YTD',css_green,css_red,'','');
    Numcards = Numcards + MT_GridAddCard(5,6,6,'HV','Savings YTD','Over spending YTD',css_green,css_red,'','');
}

async function BuildTrendData (inCol,inGrouping,inPeriod,lowerDate,higherDate,inID) {

    const firstDate = formatQueryDate(lowerDate);
    const lastDate = formatQueryDate(higherDate);
    let useID = '', useType = '';
    let snapshotData = null;
    let retGroups = [];
    let s_ndx = 0;
    if(MTFlex.Button2 == 8) {s_ndx = getDates('n_CurYear',lowerDate);} else {s_ndx = getDates('n_CurMonth',lowerDate) + 1;}

    if(inID) { useType = getCategoryGroup(inID).TYPE; }
    inGrouping = Number(inGrouping);

    if(inGrouping == 0) {snapshotData = await getMonthlySnapshotData(firstDate,lastDate,inPeriod);} else {
        snapshotData = await getMonthlySnapshotData2(firstDate,lastDate,inPeriod);}

    for (let i = 0; i < snapshotData.aggregates.length; i += 1) {
        switch(inGrouping) {
            case 0: useID = snapshotData.aggregates[i].groupBy.categoryGroup.id;break;
            case 1: useID = snapshotData.aggregates[i].groupBy.category.id;break;
            case 2: useID = snapshotData.aggregates[i].groupBy.category.id;break;
            case 3: useID = snapshotData.aggregates[i].groupBy.category.id;retGroups = getCategoryGroup(useID);
                useID = retGroups.GROUP;useType = retGroups.TYPE;break;
        }
        if(inID == '' || inID == useID) {
            let useAmount = Number(snapshotData.aggregates[i].summary.sum);
            if(inID) {
                let useDate = snapshotData.aggregates[i].groupBy.month;
                let yy = useDate.substring(0,4);
                let mm = useDate.substring(5,7);
                if(useType == 'expense') { useAmount = useAmount * -1;}
                TrendQueue2.push({"YEAR": yy, "MONTH": mm,"AMOUNT": useAmount, "DESC": retGroups.NAME, "ID": retGroups.ID});
            } else if (inCol == 'oy') {
                let useDate = snapshotData.aggregates[i].groupBy.year;
                let ndx = Number(useDate.substring(0,4));
                ndx = ndx - s_ndx;
                MT_GridUpdateUID(useID,ndx,useAmount);}
            else if (inCol == 'ot') {
                let useDate = snapshotData.aggregates[i].groupBy.month;
                let ndx = Number(useDate.substring(5,7));
                if(MTFlex.Button2 == 5 && s_ndx != 1) {
                    if(ndx >= s_ndx) {
                        ndx = ndx - s_ndx;
                        ndx+=1;
                    } else {
                        ndx = (12 - s_ndx + 1) + ndx;
                    }
                }
                MT_GridUpdateUID(useID,ndx,useAmount);
            } else { Trend_UpdateQueue(useID,useAmount,inCol); }
        }
    }
    if(inCol == 'hs') {MTFlexReady = 2;}
}

function Trend_UpdateQueue(useID,useAmount,inCol) {

    for (let i = 0; i < TrendQueue.length; i++) {
        if(TrendQueue[i].ID == useID) {
            switch(inCol) {
                case 'cp':TrendQueue[i].N_CURRENT = useAmount;break;
                case 'lp':TrendQueue[i].N_LAST = useAmount;break;
                case 'cm':TrendQueue[i].N_CURRENTM = useAmount;break;
                case 'lm':TrendQueue[i].N_LASTM = useAmount;break;
            }
            return;
        }
    }
    switch(inCol) {
        case 'cp':TrendQueue.push({"ID": useID,"N_CURRENT": useAmount,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": 0});break;
        case 'lp':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": useAmount, "N_CURRENTM": 0, "N_LASTM": 0});break;
        case 'cm':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": useAmount, "N_LASTM": 0});break;
        case 'lm':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": useAmount});break;
    }
}

function MenuTrendsHistory(inType,inID) {

    let topDiv = document.getElementById('root');
    if(topDiv) {

        const lowerDate = new Date("2023-01-01"),higherDate = new Date();
        let retGroups = getCategoryGroup(inID),inGroup = 1,useURL = '';

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
        div2 = cec('div','MTFlexCardBig',div,'Monthly Summary');
        div = cec('span','MTSideDrawerHeader',div4,'','','','');
        div2 = cec('div','MTFlexSmall',div, retGroups.TYPE,'','style','float:right;');
        if(retGroups.TYPE == 'expense') {useURL = '#|spending|';} else {useURL = '#|income|';}
        if(inType == 'category-groups') {
            div2 = cec('a','MTFlexGridDCell',div,retGroups.ICON + ' ' + retGroups.GROUPNAME ,useURL + '|' + retGroups.GROUP ,'','' );
            inGroup = 3;
        } else {
            div2 = cec('a','MTFlexGridDCell',div,retGroups.ICON + ' ' + retGroups.GROUPNAME + ' / ' + retGroups.NAME,useURL + retGroups.ID + '|','','' );
        }
        TrendQueue2 = [];
        BuildTrendData('hs',inGroup,'month',lowerDate,higherDate,inID);
    }
}

function MenuTrendsHistoryDraw() {

    let sumQue = [], detailQue = [];
    const os = 'text-align:left; font-weight: 600;';
    const os2 = 'font-weight: 600;';
    const os3 = 'text-align:left; font-weight: 200; font-size: 12px;';
    const os4 = 'margin-bottom: 10px; line-height: 10px !important; display: ' + getDisplay(getCookie('MTC_div.TrendHistoryDetail',true),'');
    const startYear = Number(getDates('n_CurYear') - 2);
    const curYear = Number(getDates('n_CurYear'));
    const curMonth = Number(getDates('n_CurMonth'));
    let curYears = 1,skiprow = false,inGroup = 1,useArrow = 0,c_r = 'red', c_g = 'green';
    let topDiv = document.querySelector('div.MTSideDrawerMotion');

    if(topDiv) {
        if(topDiv.getAttribute("grouptype") == 'category-groups') { inGroup = 2;}
        if(topDiv.getAttribute("cattype") == 'income') { c_g = 'red'; c_r = 'green'; }
        let div = cec('div','MTSideDrawerHeader',topDiv,'','','','');

        for (let i = 0; i < 12; i++) {
            sumQue.push({"MONTH": i,"YR1": MTHistoryDraw(i+1,startYear),"YR2": MTHistoryDraw(i+1,startYear + 1),"YR3": MTHistoryDraw(i+1,startYear + 2)});
        }

        if(startYear < getCookie('MT_LowCalendarYear',false)) {skiprow = true;}

        let div2 = cec('div','MTSideDrawerItem',div,'','','style',os2);
        let div3 = cec('span','MTSideDrawerDetail',div2,'Month','','style',os);
        for (let j = startYear; j <= curYear; j++) {
            if(skiprow == false || j > startYear) { div3 = cec('span','MTSideDrawerDetail',div2,j,'','','');}
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
                    if(sumQue[i].YR2 > 0 && sumQue[i].YR3 > sumQue[i].YR2) {useArrow = 0;} else {useArrow = 2;}
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
            T[1] = T[1] + sumQue[i].YR1;T[2] = T[2] + sumQue[i].YR2;T[3] = T[3] + sumQue[i].YR3;
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

        let ms = '0' + inMonth.toString();ms = ms.slice(-2);
        let ys = inYear.toString();
        let amt = 0.00;

        for (let i = 0; i < TrendQueue2.length; i++) {
            if(TrendQueue2[i].MONTH == ms && TrendQueue2[i].YEAR == ys) {
                amt = amt + TrendQueue2[i].AMOUNT;
            }
        }
        return amt;
    }

    function MTHistoryDrawDetail(inMonth,inDiv) {

        let ms = '0' + inMonth.toString();ms = ms.slice(-2);
        detailQue = [];

        for (let i = 0; i < TrendQueue2.length; i++) {
            if(TrendQueue2[i].MONTH == ms ) {
                let result = MTHistoryFind(TrendQueue2[i].DESC);
                detailQue[result].ID = TrendQueue2[i].ID;
                if(TrendQueue2[i].YEAR == startYear) { detailQue[result].YR1 = TrendQueue2[i].AMOUNT;}
                if(TrendQueue2[i].YEAR == startYear+1) { detailQue[result].YR2 = TrendQueue2[i].AMOUNT;}
                if(TrendQueue2[i].YEAR == startYear+2) { detailQue[result].YR3 = TrendQueue2[i].AMOUNT;}
            }
        }

        detailQue.sort((a, b) => b.YR3 - a.YR3 || b.YR2 - a.YR2);
        let useURL = '#|';
        if(topDiv.getAttribute("cattype") == 'expense') {useURL = useURL + 'spending|'} else {useURL = useURL + 'income|';}

        for (let i = 0; i < detailQue.length; i++) {
            let div2 = cec('div','TrendHistoryDetail MTSideDrawerItem',inDiv,'','','style',os4);
            let div3 = cec('a','MTSideDrawerDetail2',div2,' ' + detailQue[i].DESC,useURL + detailQue[i].ID+'|','style',os3);
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
             if(detailQue[i].DESC == inDesc) {return(i);}
         }
        detailQue.push({"DESC": inDesc,"YR1": 0,"YR2": 0,"YR3": 0, "ID": ''});
        return detailQue.length-1;
    }
}

function MenuTrendsHistoryExport() {

    const CRLF = String.fromCharCode(13,10),c = ',';
    let csvContent = '',j = 0,Cols = 0;
    const spans = document.querySelectorAll('span.MTSideDrawerDetail' + [',span.MTSideDrawerDetail2',''][getCookie('MTC_div.TrendHistoryDetail',true)]);
    spans.forEach(span => {
        j=j+1;
        if(Cols == 0) { if(span.innerText.startsWith('Average')) { Cols = j;}}
        csvContent = csvContent + getCleanValue(span.innerText,2);
        if(j == Cols) { j=0;csvContent = csvContent + CRLF;} else {csvContent = csvContent + c;}
    });
    downloadFile('Monarch Trends History ' + getDates('s_FullDate'),csvContent);
}

// Datasets Menu
function MenuReportsDataset() {

    const isFilter = document.querySelector('button.MT_FilterRestore');
    if(isFilter == null) {
        const elements=document.querySelectorAll('div.WithIndicatorContainer__Root-sc-1gqsonh-0');
        if(elements) {
            for (const li of elements) {
                if(li.innerText.includes('Filters') == true) {

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
    while (eID.hasChildNodes()) {eID.removeChild(eID.firstChild);}

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
    let lc = getCookie('MT_LastFilter',false);
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

    const storedStr = getCookie(cn,false);
    localStorage.setItem("persist:reports", storedStr);
    setCookie('MT_LastFilter', cn);

    let PathCookie = cn.replace('MTF_','MTP_');
    SaveLocationPathName = getCookie(PathCookie,false);
    window.location.assign(SaveLocationPathName);

}

// ===[ Calendar Fixes ] ===
function MM_FixCalendarShortcuts() {
    const li = document.querySelectorAll('div.DateRangePickerShortcuts__StyledMenuItem-jr6842-1');
    if (li[6]) {
        const useClass = li[0].className;
        const createShortcut = (text, startDate, endDate) => {
            const div = document.createElement('div');
            div.className = useClass;
            div.innerText = text;
            li[5].nextSibling.after(div);
            div.addEventListener('click', () => {
                inputTwoFields('input.DateInput_input', getDates(startDate), getDates(endDate));
                const sb = findButton('', 'Apply');
                if (sb) {
                    focus(sb);
                    sb.click();
                }
            });
        };
        createShortcut('This quarter', 'i_ThisQTRs', 'i_ThisQTRe');
        createShortcut('Last year YTD', 'i_LastYearYTDs', 'i_LastYearYTDe');
        createShortcut('Last 12 months', 'i_Last12s', 'i_Last12e');
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

    let ii = parseInt(getCookie("MT_LowCalendarYear",false));
    if(ii < 2000) {ii = 2000;}
    ii -= 2000;
    for (let i = 0; i < ii; i++) {
        InList.removeChild(InList.firstChild);
    }
}

function replaceBetweenWith(InValue,InStart,InEnd,InReplaceWith) {

    let result = InValue;
    if(InValue != null) {
        let a = InValue.indexOf(InStart);
        if(a > 0) {
            let b = InValue.indexOf(InEnd,a+1);
            if(b > a) {
                b = b + InEnd.length;
                result = InValue.substring(0, a) + InReplaceWith + InValue.substring(b);
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
    }
}

function MenuLogin(OnFocus) {

    if (SaveLocationPathName.startsWith('/login')) {
        if(OnFocus == false) { MM_MenuFix(); }
    }
}

function MenuDisplay(OnFocus) {

    if (SaveLocationPathName.startsWith('/settings/display')) {
        if(OnFocus == false) { }
        if(OnFocus == true) {
            MenuDisplay_Input('Monarch Money Tweaks - ' + version,'','header');
            MenuDisplay_Input('Lowest Calendar/Data year','','spacer');
            MenuDisplay_Input('','MT_LowCalendarYear','number');
            MenuDisplay_Input('General','','spacer');
            MenuDisplay_Input('Calendar "Last year" and "Last 12 months" include full month','MT_CalendarEOM','checkbox');
            MenuDisplay_Input('Menu','','spacer');
            MenuDisplay_Input('Hide Budget','MT_Budget','checkbox');
            MenuDisplay_Input('Hide Recurring','MT_Recurring','checkbox');
            MenuDisplay_Input('Hide Goals','MT_Goals','checkbox');
            MenuDisplay_Input('Hide Investments','MT_Investments','checkbox');
            MenuDisplay_Input('Hide Advice','MT_Advice','checkbox');
            MenuDisplay_Input('Hide Monarch Ads','MT_Ads','checkbox');
            MenuDisplay_Input('Accounts','','spacer');
            MenuDisplay_Input('"Refresh All" accounts the first time logging in for the day','MT_RefreshAll','checkbox');
            MenuDisplay_Input('Hide Accounts Net Worth Graph panel','MT_HideAccountsGraph','checkbox');
            MenuDisplay_Input('Transactions','','spacer');
            MenuDisplay_Input('Transactions panel has smaller font & compressed grid','MT_CompressedTx','checkbox');
            MenuDisplay_Input('Highlight Pending Transactions (Preferences / "Allow Pending Edits" must be off)','MT_PendingIsRed','checkbox');
            MenuDisplay_Input('Hide Create Rule pop-up','MT_HideToaster','checkbox');
            MenuDisplay_Input('Reports','','spacer');
            MenuDisplay_Input('Hide chart tooltip Difference amount','MT_HideTipDiff','checkbox');
            MenuDisplay_Input('Reports / Trends','','spacer');
            MenuDisplay_Input('Always compare to End of Month','MT_TrendFullPeriod','checkbox');
            MenuDisplay_Input('By Month "Avg" ignores Current Month','MT_TrendIgnoreCurrent','checkbox');
            MenuDisplay_Input('Hide percentage of Income & Spending','MT_TrendHidePer1','checkbox');
            MenuDisplay_Input('Hide percentage of Difference','MT_TrendHidePer2','checkbox');
            MenuDisplay_Input('Always hide decimals','MT_NoDecimals','checkbox');
            MenuDisplay_Input('Reports / Accounts','','spacer');
            MenuDisplay_Input('Use calculated balance (Income, Expenses & Transfers) for Checking & Credit Cards','MT_AccountsBalance','checkbox');
            MenuDisplay_Input('Hide accounts marked as "Hide this account in list"','MT_AccountsHidden','checkbox');
            MenuDisplay_Input('Hide Pending & Projected Balance information','MT_AccountsHidePending','checkbox');
            MenuDisplay_Input('Hide percentage of Net Change','MT_AccountsHidePer2','checkbox');
            MenuDisplay_Input('Show total Checking card','MT_AccountsCard0','checkbox');
            MenuDisplay_Input('Show total Savings card','MT_AccountsCard1','checkbox');
            MenuDisplay_Input('Show total Credit Card Liability card','MT_AccountsCard2','checkbox');
            MenuDisplay_Input('Show total Investments card','MT_AccountsCard3','checkbox');
            MenuDisplay_Input('Show total 401k card','MT_AccountsCard4','checkbox');
            MenuDisplay_Input('Always hide decimals','MT_AccountsNoDecimals','checkbox');
            MenuDisplay_Input('Budget','','spacer');
            MenuDisplay_Input('Budget panel has smaller font & compressed grid','MT_PlanCompressed','checkbox');
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
            qs = document.querySelector('.SettingsCard__Placeholder-sc-189f681-2');
            qs = qs.firstChild.lastChild;
            e1 = document.createElement('div');
            e1.style = 'font-size: 14px; font-weight: 500;margin-left:24px;';
            e1.innerText = inValue;
            qs.after(e1);
            return;
        }

        if(inType == 'header') {
            e1.innerText = inValue;
            e1.style = 'font-size: 18px; font-weight: 500;margin-left:24px;';
        } else {
            e1.style = 'margin: 11px 25px;';
        }
        qs.after(e1);
        let e2 = null,e3 = null;
        const OldValue = getCookie(inCookie,false);
        const d = new Date(),year = d.getFullYear();

        if(inType == 'checkbox') {
            e2 = document.createElement('input');
            e2.type = inType;
            e2.className = 'MTCheckboxClass';
            if(OldValue == 1) {e2.checked = 'checked';}
            e1.appendChild(e2);
            e2.addEventListener('change', () => {
                flipCookie(inCookie,1);
                MM_MenuFix();
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
            });
        }
    }
}

function MenuCheckSpawnProcess() {

    switch(MTFlexReady) {
        case true:
            MTFlexReady = false;
            MT_GridDraw(0);
            break;
        case 2:
            MTFlexReady = false;
            MenuTrendsHistoryDraw();
            break;
    }
}

window.onclick = function(event) {

    const cn = event.target.className;
    const pcn = event.target.parentNode.className;
    //console.log(cn,event.target,pcn,event.target.parentNode);
    if(typeof cn === 'string') {
        switch (cn) {
            case 'MTFlexGridDCell':
            case 'MTSideDrawerDetail2':
                if(event.target.hash != '') {
                    if(event.target.hash.startsWith('#') == true) {
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        event.preventDefault();
                        const p = event.target.hash.split('|');
                        MenuReportsSetFilter(p[1],p[2],p[3]);
                        window.location.replace('/reports/' + p[1]);
                    }
                }
                return;
            case 'MTSideDrawerRoot':
                removeAllSections('div.MTSideDrawerRoot');return;
            case 'MTTrendCellArrow':
                removeAllSections('div.MTSideDrawerRoot');return;
            case 'MTTrendCellArrow2':
                flipAllSections('div.TrendHistoryDetail');
                event.target.innerText = ['',''][getCookie('MTC_div.TrendHistoryDetail',true)];
                return;
            case 'MTlink':
                if(pcn == 'MTSideDrawerHeader') {MenuTrendsHistoryExport();}
                return;
            case 'MTFlexBig MThRefClass':
                onClickMTFlexBig();return;
            case 'MTFlexButton1':
                if(r_FlexButtonActive == 2) {document.getElementById("MTDropdown2").className = 'MTFlexdown-content';}
                if(document.getElementById("MTDropdown1").classList.toggle("show") == true) { r_FlexButtonActive = 1;} else { r_FlexButtonActive = 0;}
                return;
            case 'MTFlexButton2':
                if(r_FlexButtonActive == 1) {document.getElementById("MTDropdown1").className = 'MTFlexdown-content';}
                if(document.getElementById("MTDropdown2").classList.toggle("show") == true) { r_FlexButtonActive = 2;} else { r_FlexButtonActive = 0;}
                return;
            case 'MTFlexCheckbox':
                MTFlex.Button3 = event.target.checked;
                setCookie(MTFlex.Name + 'Button3',MTFlex.Button3);
                if(MTFlex.Button3 == true) {MM_hideElement('tr.MTSpacerClassTR',1);} else {MM_hideElement('tr.MTSpacerClassTR',0);}
                return;
            case 'MTFlexButtonExport':
                MT_GridExport();
        }
        if(cn.includes('AbstractButton')) {
            if(event.target.innerText.startsWith('\uf10b')) {
                MM_FixCalendarShortcuts();return;
            }
        }
        if(cn == 'MTBub1') {
            if(event.target.textContent.startsWith('SUM') == true) {navigator.clipboard.writeText(MTFlexSum[1]);}
            if(event.target.textContent.startsWith('AVG') == true) {navigator.clipboard.writeText(getCleanValue('$' + MTFlexSum[1]/MTFlexSum[0],2));}
            if(event.target.textContent.startsWith('CNT') == true) {navigator.clipboard.writeText(MTFlexSum[0]);}
        }
        if(cn == 'MTFlexGridDCell2') {
            let x = Number(getCleanValue(event.target.textContent,2));
            if(event.target.id != 'selected') {
                event.target.style = 'border: 2px solid green;';event.target.id = 'selected';
                MTFlexSum[0] +=1;
                MTFlexSum[1] += x;
            } else {
                event.target.style = '';event.target.id = '';
                MTFlexSum[0] -=1;
                MTFlexSum[1] -= x;
            }
            if(MTFlexSum[0] < 2) {MTFlex.bub.setAttribute('style','display:none;');} else {
                MTFlex.bub.setAttribute('style','display:block;');
                MTFlex.bub1.textContent = 'SUM: ' + getDollarValue(MTFlexSum[1],false);
                MTFlex.bub2.textContent = 'AVG: ' + getDollarValue(MTFlexSum[1]/MTFlexSum[0],false);
                MTFlex.bub5.textContent = 'CNT: ' + MTFlexSum[0];
            }
        }
    }
     if(typeof pcn === 'string') {
        switch (pcn) {
            case 'MTFlexGridTitleRow':
                onClickGridSort();return;
            case 'MTFlexCellArrow':
                onClickMTFlexArrow();return;
            case 'MTdropdown':
                onClickFilter();return;
        }
        if(pcn.includes('AbstractButton')) {
            if(event.target.parentNode.innerText.startsWith('\uf10b')) {
                MM_FixCalendarShortcuts();return;
            }
        }
        if(cn) {
            if(cn.startsWith('DateInput_') && pcn.startsWith('DateInput')) {
                MM_FixCalendarYears();
            }
            if(cn.includes('Text-qcxgyd-0') == true && pcn.includes('TransactionDrawerBody') == true) {
                if(event.target.innerText == 'Split') { MM_SplitTransaction();}
            }
        }
    }
    if(r_DatasetActive == true) {onClickFilter();}
    if(r_FlexButtonActive > 0) {
        document.getElementById("MTDropdown1").className = 'MTFlexdown-content';
        document.getElementById("MTDropdown2").className = 'MTFlexdown-content';
        r_FlexButtonActive = 0;
    }
};

function onClickMTFlexBig() {

  if(MTFlex.Name == 'MTTrend') {
      if(getDates('isToday',TrendTodayIs)) {
          TrendTodayIs = getDates('d_EndofLastMonth');} else { TrendTodayIs = getDates('d_Today');}
      MenuReportsTrendsGo();
  }
  if(MTFlex.Name == 'MTAccounts') {
      if(getDates('isToday',AccountsTodayIs)) {
          AccountsTodayIs = getDates('d_EndofLastMonth');} else {AccountsTodayIs = getDates('d_Today');}
      MenuReportsAccountsGo();
  }
}

function onClickMTFlexArrow() {

    let p = event.target.parentNode.getAttribute("triggers").split('|');
    if(p == null) {return;}
    if(MTFlex.Name == 'MTTrend') { MenuTrendsHistory(p[0],p[1]); }
}

function onClickGridSort() {

    let Column = event.target.getAttribute("column");
    if(Column != '') {
        let elSelected = Number(Column);
        let cn = MTFlex.Name + 'Sort';
        if(MTFlex.SortSeq != null) {cn = cn + MTFlex.SortSeq[MTFlex.Button2];}
        let elCurrent = getCookie(cn,true);
        if(Math.abs(elCurrent) == Math.abs(elSelected)) { elSelected = elCurrent * -1; }
        setCookie(cn,elSelected);
        MT_GridDraw(1);
    }
}

function onClickFilter() {

    let isShowing = document.getElementById("MTDropdown").classList.toggle("show");
    if(isShowing == true) {
        MenuFilter();
        r_DatasetActive = true;
    } else {
        r_DatasetActive = false;
        const et = event.target.href;
        if(et) {
            let iMTF = et.search("#MTF_");
            if(iMTF > 0) {
                let PathCookie = getCookie('MT_LastFilter',false);
                iMTF+=1;
                let cn = et.substring(iMTF);
                cn = cn.replaceAll('%20',' ');
                switch(cn) {
                    case 'MTF_@':
                        MenuFilter_Save('');break;
                    case 'MTF_#':
                        MenuFilter_Save(getCookie('MT_LastFilter',false));break;
                    case 'MTF_$':
                        deleteCookie(PathCookie);
                        PathCookie = PathCookie.replace('MTF_','MTP_');
                        deleteCookie(PathCookie);
                        setCookie("MT_LastFilter","");
                        break;
                    default:
                        MenuFilter_Restore(cn);break;
                }
            }
        }
    }
}

function cec(e, c, r, it, hr, a1, a2) {
    const div = document.createElement(e);
    if (it) div.innerText = it;
    if (hr) div.href = hr;
    if (c) div.className = c;
    if (a1) div.setAttribute(a1, a2);
    return r.appendChild(div);
}

function removeAllSections(inDiv) {
    const divs = document.querySelectorAll(inDiv);
    for (let i = 0; i < divs.length; ++i) { divs[i].remove(); }
}

function flipAllSections(inDiv) {
    flipCookie('MTC_' + inDiv,1);
    const cv = getCookie('MTC_' + inDiv,true);
    MM_hideElement(inDiv,cv);
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
    if(inShort != null && inShort == true) { return months[inValue].substring(0,3); } else { return months[inValue];}
}

function getDates(InValue,InDate) {

    let d = null;
    if(InDate) { d = new Date(InDate);} else { d = new Date(); }
    let month = d.getMonth(), day = d.getDate(), year = d.getFullYear();
    if(InValue == 'isToday') {
        let todaysDate = new Date();
        if(InDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {return true;} else {return false;}
    }

    switch (InValue) {
        case 'n_CurYear':return(year);
        case 'n_CurMonth':return(month);
        case 'n_CurDay':return(day);
        case 'd_Today':return d;
        case 'd_Yesterday':d.setDate(d.getDate() - 1);return d;
        case 'd_MinusWeek':d.setDate(d.getDate() - 7);return d;
        case 'd_Minus2Weeks':d.setDate(d.getDate() - 14);return d;
        case 'd_Minus3Months':d.setDate(1);d.setMonth(d.getMonth() - 2);return d;
        case 'd_Minus6Months':d.setDate(1);d.setMonth(d.getMonth() - 5);return d;
        case 'd_Minus1Year':d.setDate(1);d.setFullYear(d.getFullYear() - 1);return d;
        case 'd_Minus2Years':d.setDate(1);d.setFullYear(d.getFullYear() - 2);return d;
        case 'd_Minus3Years':d.setDate(1);d.setFullYear(d.getFullYear() - 3);return d;
        case 'd_Minus4Years':d.setDate(1);d.setFullYear(d.getFullYear() - 4);return d;
        case 'd_Minus5Years':d.setDate(1);d.setFullYear(d.getFullYear() - 5);return d;
        case 'd_StartofMonth':d.setDate(1);return d;
        case 'd_EndofMonth':day = daysInMonth(month,year); d.setDate(day);return d;
        case 'd_StartOfYear':d.setDate(1);d.setMonth(0);return d;
        case 's_FullDate':return(getMonthName(month,true) + ' ' + day + ', ' + year );
        case 's_ShortDate':return(getMonthName(month,true) + ' ' + day);
        case 'd_ThisQTRs':
            if(month < 3) {month = 0;}
            if(month == 4 || month == 5) {month = 3;}
            if(month == 7 || month == 8) {month = 6;}
            if(month == 10 || month == 11) {month = 9;}
            d.setFullYear(year,month,1);
            return d;
        case 'd_StartofLastMonth':
            month-=1;
            if(month < 0) {month = 11;year-=1;}
            day = 1;
            d.setFullYear(year, month, day);return d;
        case 'd_EndofLastMonth':
            month-=1;
            if(month < 0) {month = 11;year-=1;}
            day = daysInMonth(month,year);
            d.setFullYear(year, month, day);return d;
        case 'i_Last12s':year-=1;break;
        case 'i_Last12e':if(getCookie('MT_CalendarEOM',true) == 1) {day = daysInMonth(month,year);}break;
        case 'i_LastYearYTDs':month = 0;day = 1;year-=1;break;
        case 'i_LastYearYTDe':year-=1;if(getCookie('MT_CalendarEOM',true) == 1) {day = daysInMonth(month,year); }break;

        case 'i_ThisQTRs':
            if(month < 3) {month = 0;}
            if(month == 4 || month == 5) {month = 3;}
            if(month == 7 || month == 8) {month = 6;}
            if(month == 10 || month == 11) {month = 9;}
            day = 1;
            break;
        case 'i_ThisQTRe':
            if(month < 2) {month = 2;}
            if(month == 3 || month == 4) {month = 5;}
            if(month == 6 || month == 7) {month = 8;}
            if(month == 9 || month == 10) {month = 11;}
            if(getCookie('MT_CalendarEOM',true) == 1) {day = daysInMonth(month,year); }
            break;
        default:
            alert('Invalid Date in getDates. (' + InValue + ')');
            return;
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

function findButton(inValue, inName) {
    const buttons = document.querySelectorAll('button');
    for (const button of buttons) {
        if ((inValue && button.textContent.startsWith(inValue)) || (inName && inName === button.innerText)) {return button;}
    }
    return null;
}

function getCleanValue(inValue,inDec) {

    if(inValue.startsWith('$') || inValue.startsWith('-')) {
        inValue = replaceBetweenWith(inValue,'(',')','');
        const AmtStr = inValue.replace(/[$,]+/g,"");
        let Amt = Number(AmtStr);
        if(inDec > 0) {Amt = Amt.toFixed(inDec);}
        return Amt;
    }
    else { return inValue; }
}

function getDollarValue(InValue,ignoreCents) {

    if(InValue == null) {return '';}
    if(InValue === -0 || isNaN(InValue)) {InValue = 0;}
    if(ignoreCents == true) { InValue = Math.round(InValue);}
    let useValue = InValue.toLocaleString("en-US", {style:"currency", currency:css_currency});
    if(ignoreCents == true) { useValue = useValue.substring(0, useValue.length-3);}
    return useValue;
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
        while (c.charAt(0) == ' ') { c = c.substring(1); }
        if (c.indexOf(name) == 0) { return c.substring(name.length, c.length);}
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
function getChecked(InA,InB) {
    if(InA == 'true') {return 'display: none;';} else {return InB;}
}
function isDarkMode() {
    const cssObj = window.getComputedStyle(document.querySelector('[class*=Page__Root]'), null);
    const bgColor = cssObj.getPropertyValue('background-color');
    if (bgColor === 'rgb(25, 25, 24)') { return 1; } else { return 0; }
}
function addStyle(aCss) {
    if(r_headStyle == null) { r_headStyle = document.getElementsByTagName('head')[0]; }
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    r_headStyle.appendChild(style);
}

(function() {
    MM_Init();
    setInterval(() => {
        if(window.location.pathname != SaveLocationPathName) {

            if(SaveLocationPathName) {
                MenuLogin(false);
                MenuReports(false);
                MenuDisplay(false);
                MenuTransactions(false);
            }

            SaveLocationPathName = window.location.pathname;
            SaveLocationHRefName = window.location.href;

            MenuReports(true);
            MenuDisplay(true);
            MenuTransactions(true);
        }
        MenuCheckSpawnProcess();
    },330);
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
  const options = callGraphQL({operationName: 'GetAggregatesGraph', variables: {startDate: startDate, endDate: endDate, },
        query: "query GetAggregatesGraph($startDate: Date, $endDate: Date) {\n aggregates(\n filters: { startDate: $startDate, endDate: $endDate }\n groupBy: [\"category\", \"" + groupingType + "\"]\n  fillEmptyValues: false\n ) {\n groupBy {\n category {\n id\n }\n " + groupingType + "\n }\n summary {\n sum\n }\n }\n }\n"
      });
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function getMonthlySnapshotData(startDate, endDate, groupingType) {
    const options = callGraphQL({ operationName: 'GetAggregatesGraphCategoryGroup',variables: {startDate: startDate, endDate: endDate, },
          query: "query GetAggregatesGraphCategoryGroup($startDate: Date, $endDate: Date) {\n aggregates(\n filters: { startDate: $startDate, endDate: $endDate }\n groupBy: [\"categoryGroup\", \"" + groupingType + "\"]\n fillEmptyValues: false\n ) {\n groupBy {\n categoryGroup {\n id\n }\n " + groupingType + "\n }\n summary {\n sum\n }\n }\n }\n"
      });
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function GetTransactions(startDate,endDate, offset, isPending) {
    const limit = 1000;
    const filters = {startDate: startDate, endDate: endDate, isPending: isPending};
    const options = callGraphQL({operationName: 'GetTransactions', variables: {offset: offset, limit: limit, filters: filters},
          query: "query GetTransactions($offset: Int, $limit: Int, $filters: TransactionFilterInput) {\n allTransactions(filters: $filters) {\n totalCount\n results(offset: $offset, limit: $limit) {\n id\n amount\n pending\n date\n hideFromReports\n account {\n id } \n category {\n id\n name \n group {\n id\n name\n type }}}}}\n"
    });
    return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => { return data.data; }).catch((error) => { console.error(version,error);});
}

async function getDisplayBalanceAtDateData(date) {
    const options = callGraphQL({ operationName: 'Common_GetDisplayBalanceAtDate',variables: {date: date, },
          query: "query Common_GetDisplayBalanceAtDate($date: Date!) {\n accounts {\n id\n displayBalance(date: $date)\n type {\n name\n}\n }\n }\n"
      });
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function getAccountsData() {
    const options = callGraphQL({ operationName: 'GetAccounts',variables: { },
          query: "query GetAccounts {\n accounts {\n id\n displayName\n deactivatedAt\n isHidden\n isAsset\n isManual\n mask\n displayLastUpdatedAt\n currentBalance\n displayBalance\n hideFromList\n hideTransactionsFromReports\n order\n icon\n logoUrl\n deactivatedAt \n type {\n  name\n  display\n  group\n  }\n subtype {\n name\n display\n }\n }}\n"
      });
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function refreshAccountsData() {
 const options = callGraphQL({operationName:"Common_ForceRefreshAccountsMutation",variables: { },
         query: "mutation Common_ForceRefreshAccountsMutation {\n  forceRefreshAllAccounts {\n    success\n    errors {\n      ...PayloadErrorFields\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PayloadErrorFields on PayloadError {\n  fieldErrors {\n    field\n    messages\n    __typename\n  }\n  message\n  code\n  __typename\n}" });
    return fetch(graphql, options)
    .then((response) => localStorage.setItem('MT:LastRefresh', getDates('s_FullDate')))
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function getCategoryData() {
    const options = callGraphQL({ operationName: 'GetCategorySelectOptions', variables: {},
          query: "query GetCategorySelectOptions {categories {\n id\n name\n order\n icon\n group {\n id\n name \n type}}}"
    });
    return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function buildCategoryGroups() {

    if(accountGroups.length == 0) {
        const categoryData = await getCategoryData();
        for (let i = 0; i < categoryData.categories.length; i += 1) {
            accountGroups.push({"GROUP": categoryData.categories[i].group.id, "GROUPNAME": categoryData.categories[i].group.name, "ID": categoryData.categories[i].id, "NAME": categoryData.categories[i].name, "ICON": categoryData.categories[i].icon, "TYPE": categoryData.categories[i].group.type, "ORDER": categoryData.categories[i].order});
        }
    }
}
function getCategoryGroupList(InId) {
    let cl = '';
    buildCategoryGroups();
    for (let i = 0; i < accountGroups.length; i++) {
        if(accountGroups[i].GROUP == InId) {
            if(cl) {cl=cl+',';}
            cl = cl + '\\"' + accountGroups[i].ID + '\\"';}
    }
    return cl;
}

function getCategoryGroup(InId) {
    for (let i = 0; i < accountGroups.length; i++) {if(accountGroups[i].ID == InId || accountGroups[i].GROUP == InId) {return accountGroups[i];}}
    return [null];
}

function updateAccountBalance(inId,inBalance) {
    accountBalances.push({"ID": inId, "BALANCE": inBalance});
}

function getAccountCacheBalance(inId) {
  for (let i = 0; i < accountBalances.length; i++) {
      if(accountBalances[i].ID == inId ) { return accountBalances[i].BALANCE; }
  }
    return 0;
}
