// ==UserScript==
// @name         MonarchMoneyTrendReport
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  Enhance Sankey information into Trend format
// @author       Robert
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// @grant        none
// ==/UserScript==

let r_Init = false;
let SaveLocationPathName = "";
let TrendActive = false;
let TrendIsCompressed=0;
let TrendButton = null;
let TrendButtonP = null;
let TrendButtonA = null;
let TrendButtonN = null;
let TrendButtonE = null;
let TrendButtonC = '';
let ShareButton = null;
let TrendStartP = "";
let TrendEndP = "";
let TrendClipboard = '';
let CRLF = String.fromCharCode(13,10);

const css_green = 'color:rgb(25,210,165)';
const css_currency = 'USD';

let css_table0 = 'hvKFU0';
let css_table1 = 'jznQAl';
let css_table2 = 'eGiVnj';
let css_grid = 'jLxdcY';
let css_items = 'eqYSVV';
let css_itemsB = 'HcakD';
let css_itemsD = 'dhlTnX';

let TrendQueue = [];

function Sankey_Trends(InExec) {

    let CI_n = 0;
    let CE_n = 0;
    let LI_n = 0;
    let LE_n = 0;

    switch (InExec) {
        case 1:
            TrendQueue = [];
            Trend_BuildReport(1);
            Trend_SetButton();
            break;
        case 2:
            Trend_ClearCurrent();
            Trend_BuildReport(2);
            Trend_BreakdownReport();
            Sankey_HideChartControls();
            Sankey_HideTrendControls(false);
            Sankey_UnHideTrendControls();
            TrendActive = true;
            break;
    }

    function Trend_ClearCurrent() {

        for (let i = TrendQueue.length - 1; i >= 0; i--) {
            TrendQueue[i].N_CURRENT = 0;
            TrendQueue[i].CURRENT = '';
            if(TrendQueue[i].CURRENT == '' && TrendQueue[i].LAST == '') {
                TrendQueue.pop()
            }
        }
    }

    function Trend_BreakdownReport() {

        let Hrow = null;
        let row = null;
        let useStyle = "";
        let HeaderStr = "";
        if(TrendStartP != '') {
            HeaderStr = 'Compared to: ' + Trend_ConvertDate(TrendStartP) + ' - ' + Trend_ConvertDate(TrendEndP);
            TrendClipboard = 'Trend Report,Comparison,This Period,Difference' + CRLF;
        } else {
            TrendClipboard = 'Trend Report,,This Period,' + CRLF;
        }

        TrendQueue.sort((a, b) => b.N_CURRENT - a.N_CURRENT);

        Hrow = Trend_TableC('.Row__Root-sc-18oidwc-0','.Column__Root-r51fj9-0');
        row = Trend_Table1(Hrow,'',HeaderStr,'Comparison','This Period','Difference');
        row = Trend_DumpTotal(Hrow,'Income');
        row = Trend_DumpData(row,'Income');
        row = Trend_DumpTotal(Hrow,'Expense');
        row = Trend_DumpData(row,'Expense');
        row = Trend_DumpTotal(Hrow,'Savings');
    }

    function Trend_ConvertDate(InDate) {

        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec'];
        let mm = Number(InDate.slice(0,2));
        let dd = Number(InDate.slice(3,5));
        let yy = InDate.slice(6,10);

        let FullDate = months[mm-1] + ' ' + dd + ', ' + yy
        return FullDate

    }

    function Trend_DumpTotal(InRow,InType) {

        let C_n = 0;
        let L_n = 0;
        let D_n = 0;

        if(InType == "Savings") {
            C_n = CI_n - CE_n;
            L_n = LI_n - LE_n;
        } else {
            for (let i = 0; i < TrendQueue.length; i++) {
                if(TrendQueue[i].TYPE == InType) {
                    C_n += TrendQueue[i].N_CURRENT;
                    L_n += TrendQueue[i].N_LAST;
                }
                if(InType == "Income" && TrendQueue[i].TYPE == 'Income') {
                    CI_n += TrendQueue[i].N_CURRENT;
                    LI_n += TrendQueue[i].N_LAST;
                }
                if(InType == "Expense" && TrendQueue[i].TYPE == 'Expense') {
                    CE_n += TrendQueue[i].N_CURRENT;
                    LE_n += TrendQueue[i].N_LAST;
                }
            }
        }

        D_n = C_n - L_n;
        let useStyle = Trend_GetColor(InType,D_n);
        let LS = L_n.toLocaleString("en-US", {style:"currency", currency:css_currency});
        let CS = C_n.toLocaleString("en-US", {style:"currency", currency:css_currency});
        let DS = D_n.toLocaleString("en-US", {style:"currency", currency:css_currency});

        TrendClipboard = TrendClipboard + InType + "," + L_n.toFixed(2) + "," + C_n.toFixed(2) + "," + D_n.toFixed(2) + CRLF;

        return Trend_Table1(InRow,useStyle,InType,LS,CS,DS)
    }

    function Trend_DumpData(InRow,InType) {

        let row = InRow;

        for (let i = 0; i < TrendQueue.length; i++) {
            if(TrendQueue[i].TYPE == InType) {
                let difamt_n = TrendQueue[i].N_CURRENT - TrendQueue[i].N_LAST;
                let difamt = difamt_n.toLocaleString("en-US", {style:"currency", currency: css_currency});
                let useStyle = Trend_GetColor(TrendQueue[i].TYPE,difamt_n);
                let DescStr = TrendQueue[i].DESC.replaceAll("&amp;","&");
                DescStr = DescStr.replaceAll("&quot;",'"');
                DescStr = DescStr.replaceAll("&#39;","'");
                TrendClipboard = TrendClipboard + "  " + DescStr + "," + TrendQueue[i].N_LAST.toFixed(2) + "," + TrendQueue[i].N_CURRENT.toFixed(2) + "," + difamt_n.toFixed(2) + CRLF;
                row = Trend_Table4(row,useStyle,TrendQueue[i].DESC,TrendQueue[i].LAST,TrendQueue[i].CURRENT,difamt);
            }
        }
        return row;
    }

    function Trend_GetColor(InType,InAmount) {

        let useStyle = "";
        switch (InType) {
            case "Income":
                if(InAmount >= 0) { useStyle = css_green; };
                break;
            case "Savings":
                if(InAmount >= 0) { useStyle = css_green; };
                break;
            case "Expense":
                if(InAmount <= 0) { useStyle = css_green; };
                break;
        }
        return useStyle;
    }

    function Trend_Table4(InRow,InStyle,a,b,c,d) {

        let div = document.createElement('div');
        div.setAttribute('class', css_items);
        let el = InRow.appendChild(div);

        div = document.createElement('span');
        div.setAttribute('style', 'width: 40%;');
        div.innerHTML = a;
        let elx = el.appendChild(div);
        if(TrendStartP != "") {
            div = document.createElement('span');
            div.setAttribute('style', 'text-align: right; width: 20%;');
            div.setAttribute('class', css_itemsD);
            div.innerHTML = b;
            elx = el.appendChild(div);
        }
        div = document.createElement('span');
        div.setAttribute('style', 'text-align:right; width: 20%;');
        div.setAttribute('class', css_itemsD);
        div.innerHTML = c;
        elx = el.appendChild(div);
        if(TrendStartP != "") {
            div = document.createElement('span');
            div.setAttribute('style', 'text-align:right; width: 20%; ' + InStyle);
            div.setAttribute('class', css_itemsD);
            div.innerHTML = d;
            elx = el.appendChild(div);
        }

        return InRow;
    }

    function Trend_Table1(InRow,InStyle,a,b,c,d) {

        let div = document.createElement('div');
        div.setAttribute('class', css_table2);
        let el = InRow.appendChild(div);

        let elx = Trend_Table1W(el,a,'width: 40%;');
        if(TrendStartP != "") {
            elx = Trend_Table1W(el,b,'font-size: 16px; text-align: right; width: 20%;')
        }
        elx = Trend_Table1W(el,c,'font-size: 16px; text-align:right; width: 20%;');
        if(TrendStartP != "") {
            elx = Trend_Table1W(el,d,'font-size: 16px; text-align:right; width: 20%; ' + InStyle);
        }
        div = document.createElement('div');
        div.setAttribute('class', css_grid);
        if(TrendIsCompressed == 1) {
            div.style.display = 'none';
        }
        elx = InRow.appendChild(div);
        return elx;
    }

    function Trend_Table1W(InRow,abcd,InStyle) {

        let div = document.createElement('span');
        div.setAttribute('class',css_itemsB);
        div.setAttribute('style', InStyle);
        div.innerHTML = abcd;
        return InRow.appendChild(div);
    }

    function Trend_TableC(InStart,InRemove) {
        const elements = document.querySelectorAll(InRemove);
        for (const el of elements) {
            el.remove();
        }
        const elements2 = document.querySelector('span.CardTitle-sc-1yuvwox-0');
        elements2.innerHTML = 'Net Income Trend Report';
        let el = document.querySelector(InStart);
        el.setAttribute('style','display:contents;');

        let div = document.createElement('div');
        div.setAttribute('class', css_table0);
        let elx = el.appendChild(div);
        div = document.createElement('div');
        div.setAttribute('class', css_table1);
        div.setAttribute('style', 'display:flow-root;');
        el = elx.appendChild(div);
        return el;
    }

    function Trend_SetButton() {
        const element=document.getElementById('date-picker-input--start');
        TrendStartP = element.getAttribute("value").trim();
        const element2=document.getElementById('date-picker-input--end');
        TrendEndP = element2.getAttribute("value").trim();
        TrendButtonP.textContent = "Trend Compare +";
        alert('Trend Report Comparison Loaded:\n\nStart Date: ' + TrendStartP + '\n\nEnd Date: ' + TrendEndP + '\n\nSelect another period and run Trend Report.');
    }

    // not used, but sets date range to exact period last year for single click run (does not work)
    function Trend_SetPast() {
        const element=document.getElementById('date-picker-input--start');
        let Start_Date = element.getAttribute("value").trim();
        const element2=document.getElementById('date-picker-input--end');
        let End_Date = element2.getAttribute("value").trim();
        if(Start_Date != null && End_Date != null) {
            const d = new Date();
            let End_Year = d.getFullYear();
            let New_Start = '01/01/' + End_Year;
            let New_End = '12/31/' + End_Year;
            element.value = New_Start;
            element2.value = New_End;
        }
    }

    function Trend_UpdateQueue(InAnchor,InDesc,InAmount,InCuramount) {
        let update=false;
        for (let i = 0; i < TrendQueue.length; i++) {
            if(TrendQueue[i].TYPE == InAnchor && TrendQueue[i].DESC == InDesc) {
                TrendQueue[i].CURRENT = InAmount;
                TrendQueue[i].N_CURRENT = InCuramount;
                update=true;
                break;
            }
        }
        if(update == false){
            TrendQueue.push({"TYPE": InAnchor,"DESC": InDesc,"CURRENT": InAmount,"N_CURRENT": InCuramount,"LAST": "", "N_LAST": 0});
        }
    }

    function Trend_BuildReport(InExec) {
        const elements=document.querySelectorAll('g.node');
        if(elements) {
            for (const el of elements) {
                let d_anchor = "";
                let d_desc = "";
                let d_amount = "";
                let d_rawamount = "";
                let d_curamount = 0;
                const nodeList = el.childNodes;
                for (const elc of nodeList) {
                    if(elc.getAttribute("text-anchor") != null) {d_anchor = elc.getAttribute("text-anchor")};
                    if(elc.getAttribute("class") == "node-label") {d_desc = elc.innerHTML.trimStart()};
                    if(elc.getAttribute("class") == "fs-exclude") {d_amount = elc.innerHTML.trimStart()};
                }
                if(d_amount != "") {
                    let d_rawamount = d_amount.slice(1);
                    let ndx = d_rawamount.indexOf("(");
                    d_rawamount = d_rawamount.slice(0,ndx-1);
                    d_rawamount = d_rawamount.replace(/,/g,"");
                    d_rawamount = d_rawamount.trim();
                    d_curamount = Number(d_rawamount);
                }
                if(d_amount != "") {
                    if(d_anchor == 'start') { d_anchor = 'Income' } else { d_anchor = 'Expense'} ;
                    if(d_desc != "Savings") {
                        if(InExec == 1) {
                            TrendQueue.push({"TYPE": d_anchor,"DESC": d_desc,"CURRENT": "","N_CURRENT": 0,"LAST": d_amount, "N_LAST": d_curamount});
                        }
                        if(InExec == 2) {
                            Trend_UpdateQueue(d_anchor,d_desc,d_amount,d_curamount);
                        }
                    }
                }
            }
        }
    }
}

function Sankey_UnhideTrends() {

    TrendActive = false;

    if(document.querySelector('button.TrendButton') == null) {
        let BMode = document.querySelector('button.DefaultButton-sc-13c1sod-0');
        if(BMode != null) {
            TrendButtonC = BMode.className;
            TrendButtonC.replace('btn-active', '');
        }
        let ReportControlsEl = document.querySelector('div.ReportsChartCardControls__Root-sc-1w5c9v1-0');
        TrendButtonE = document.createElement('button');
        TrendButtonE.style.display = "none";
        TrendButtonE.className = 'TrendButtonE ' + TrendButtonC;
        ReportControlsEl.before(TrendButtonE);
        Sankey_ExpandText();
        TrendButtonE.addEventListener('click', () => {
            Sankey_Expand();
        });
        TrendButtonN = document.createElement('button');
        TrendButtonN.style.display = "none";
        TrendButtonN.textContent = 'Clipboard';
        TrendButtonN.className = 'TrendButtonN ' + TrendButtonC;
        TrendButtonE.before(TrendButtonN);
        TrendButtonN.addEventListener('click', () => {
            Sankey_ToClipboard();
        });
        TrendButtonP = document.createElement('button');
        if(TrendStartP == "") {
            TrendButtonP.textContent = 'Trend Compare';}
        else {
            TrendButtonP.textContent = 'Trend Compare +';}
        TrendButtonP.className = 'TrendButtonP ' + TrendButtonC;
        ShareButton.after(TrendButtonP);
        TrendButtonP.addEventListener('click', () => {
            Sankey_LoadStyles();
            Sankey_Trends(1);
        });
        TrendButton = document.createElement('button');
        TrendButton.textContent = 'Trend Report';
        TrendButton.className = 'TrendButton ' + TrendButtonC;
        ShareButton.after(TrendButton);
        TrendButton.addEventListener('click', () => {
            Sankey_LoadStyles();
            Sankey_Trends(2);
        });
    } else {
        TrendButtonA = document.querySelector('div.ReportsChartCardControls__Root-sc-1w5c9v1-0');
        if(TrendButtonA != null) {
            TrendButtonA.style.display = "";
        }
        TrendButtonN = document.querySelector('button.TrendButtonN');
        if(TrendButtonN != null) {
            TrendButtonN.style.display = 'none';
        }
        TrendButtonE = document.querySelector('button.TrendButtonE');
        if(TrendButtonE != null) {
            TrendButtonE.style.display = 'none';
        }
        if(TrendButtonP != null) { TrendButtonP.style.display = ""; }
        if(TrendButton != null) { TrendButton.style.display = ""; }
    }
    let elements2 = document.querySelector('span.CardTitle-sc-1yuvwox-0');
    if(elements2 != null) {
        elements2.innerHTML = 'SANKEY DIAGRAM';
    }
}

function Sankey_ShowTrends() {

    ShareButton = document.querySelector('div.ReportsChartCardControls__ButtonGroup-sc-1w5c9v1-1');

    // Unhide or try again if failed
    if(ShareButton) {
        Sankey_UnhideTrends();
    } else { SaveLocationPathName = ""; }
}

function Sankey_UnhideChartControls() {
    TrendButtonA = document.querySelector('div.ReportsChartCardControls__Root-sc-1w5c9v1-0');
    if(TrendButtonA != null) { TrendButtonA.style.display = ""; }
}

function Sankey_HideChartControls() {
    TrendButtonA = document.querySelector('div.ReportsChartCardControls__Root-sc-1w5c9v1-0');
    if(TrendButtonA != null) { TrendButtonA.style.display = "none"; }
}

function Sankey_HideTrendControls(IncludeReport) {

    if(TrendButtonN != null) { TrendButtonN.style.display = "none"; }
    if(TrendButtonE != null) { TrendButtonE.style.display = "none"; }
    if(IncludeReport == true) {
        if(TrendButtonP != null) { TrendButtonP.style.display = "none"; }
        if(TrendButton != null) { TrendButton.style.display = "none"; }
    }
}

function Sankey_UnHideTrendControls() {

    if(TrendButtonN != null) { TrendButtonN.style.display = "inline"; }
    if(TrendButtonE != null) {
        TrendButtonE.style.display = "inline";
        Sankey_ExpandText();
    }
}

function Sankey_ExpandText() {

    if (TrendIsCompressed == 0) {
        TrendButtonE.textContent = 'Compress';}
    else {
        TrendButtonE.textContent = '  Expand  ';}
}

function Sankey_Expand() {

    if (TrendIsCompressed == 1) {
        Sankey_FlexItems('div.TrendGrid','');
        TrendIsCompressed = 0;
    } else {
        Sankey_FlexItems('div.TrendGrid','none');
        TrendIsCompressed = 1;
    }
    Sankey_ExpandText();
    setCookie('Trend_ExpandButton',TrendIsCompressed);

}

function Sankey_FlexItems(InRemove,InStyle) {

    const elements = document.querySelectorAll(InRemove);
    for (const el of elements) {
        el.style.display = InStyle;
    }
}

function Sankey_ToClipboard() {

    if (navigator.clipboard == undefined) {
        alert('Clipboard permissions for "navigator.clipboard.writeText" is not available in your browser.');
    } else
    {
        navigator.clipboard.writeText(TrendClipboard);
        alert('Trend Report data copied to Clipboard!');
    }
}

function Sankey_LoadStyles() {

    let element=document.querySelector('div.Grid__GridItem-s9hcqo-1');
    if(element) { css_table0 = 'Trend_' + element.className; }
    element=document.querySelector('div.Card__CardRoot-sc-1pcxvk9-0');
    if(element) { css_table1 = 'Trend_' + element.className; }
    element=document.querySelector('div.CardHeader__Root-r0eoe3-0');
    if(element) { css_table2 = 'Trend_' + element.className; }
    element=document.querySelector('div.TransactionsSummaryCard__CardInner-sc-10q11ba-1');
    if(element) { css_grid = 'TrendGrid ' + element.className; }
    element=document.querySelector('div.TransactionsSummaryCard__CardItem-sc-10q11ba-0');
    if(element) { css_items = 'Trend_' + element.className; }
    element=document.querySelector('div.CardHeader__Title-r0eoe3-1');
    if(element) { css_itemsB = 'Trend_' + element.className; }
    element=document.querySelector('span.TransactionsSummaryCard__ValueText-sc-10q11ba-7');
    if(element) { css_itemsD = 'TrendItem_' + element.className; }
}

function Init() {

    TrendIsCompressed = getCookie('Trend_ExpandButton');
    r_Init = true;

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
        }
        if(TrendActive == true) {
            if(document.querySelector('div.SankeyDiagram__Root-y9ipuy-0') != null) {
                Sankey_HideTrendControls(false);
                Sankey_UnhideTrends();
            }
        }
        if(window.location.pathname != SaveLocationPathName) {
            TrendActive = false;
            if(SaveLocationPathName == '/reports/sankey') {
                Sankey_UnhideChartControls();
                Sankey_HideTrendControls(true);
            }

            SaveLocationPathName = window.location.pathname;

            if(SaveLocationPathName == '/reports/sankey') {
                Sankey_LoadStyles();
                Sankey_ShowTrends();
            }
        }
    },500);
}());
