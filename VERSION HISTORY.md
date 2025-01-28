# Monarch Money Tweaks - Version History
Here are a list of Open Issues, Unreleased changes and past changes:

Email any issues directly:  robert @ paresi.net

**Version 2.19 (beta):**

• NEW:  Reports / Trends Monthly Summary can now link to Income & Spending when expanding detail. 

**Version 2.18:**

• NEW: Reports / Trends now goes to Reports Income & Spending rather than the old Cash-Flow screen.

• NEW: Ability to always hide decimals in Reports / Accounts

• NEW: Added "Last three years with average" to Reports / Accounts

**Version 2.17:**

• NEW: Automatic Calculations - click on multiple cells to get SUM, AVG and CNT.  Click on each bubble to copy the value to your clipboard.

• REGRESSION: Reports / Accounts - Drop-Down for Time-Frame was not setting properly.

**Version 2.16:**

• NEW: Display Current year, last 12 months or last 6 months of Account Balances with Average in Reports / Accounts 

• NEW: New and more streamlined Cards with more information in Reports / Trends

**Version 2.15:**

• NEW: "Refresh All" accounts the first time logging in for the day (Settings / Display / Accounts)

• NEW: Ability to always hide decimals in Reports / Trends

• NEW: Ability to show Pending total and Projected balance amounts by account in Reports / Accounts

• NEW: Ability to hide Net Change percent in Reports / Accounts

**Version 2.14:**

• NEW: Transactions grid can have smaller font & compressed grid. (Settings / Display)

• NEW: Budget grid can have smaller font & compressed grid. (Settings / Display)

**Version 2.13:**

• NEW: Ability to compress Reports / Trends & Accounts grid.

• FIX: Export History Grid might throw exception creating file name.

• CHANGE: Better styling with new color style.

**Version 2.12:**

• REGRESSION: Reports / Trends - Left two columns were comparing to End of Month regardless of setting.

• REGRESSION: The calendar was not always working properly (Last 12 months, Last year YTD, This quarter) depending on Calendar "include full month" configuration.

• FIX: Some rounding could be $1 different between the screen of data versus export of data. (Export was not rounding)

**Version 2.11:**

• CHANGE: Reports / Trends & Accounts - Better font sizes, faster, less flicker

• FIX: Clicking on outside border of "Date" button would not load custom three date ranges.


**Version 2.10:**

• CHANGE: Reports / Trends - When on last day of current month (11/30) and comparing to last month, last month will now compare to last day of month (10/31 instead of 10/30).

• FIX: Monarch new color scheme corrections.

• DEPRECATED: Reports Breadcrumbs and compressed transaction grid functionality removed.  Monarch Money now does it.  Yea!


**Version 2.07-2.09:**

• NEW: Reports / Accounts - Ability to select which total cards to show at top (Checking, Savings, Credit Card, Investments) - Unused cards will be filled with individual credit card accounts.

• FIX: Reports / Accounts - If beginning balance for account was zero and ending balance was also zero, but there were transfers for the current month, the account would not show in the list.  

• FIX: Reports [Datasets] button stopped appearing in Safari browser.

• CHANGE: Nicer Settings / Display menu

• FIX: Reports / Accounts - Going back to previous month would duplicate Cards

• FIX: Reports / Accounts - Fixed Accounts that may not appear with pastBalance <> 0

**Version 2.04-2.06:**

• FIX: Reports / Trends - If YTD previous was negative and current year positive, shading would not occur.

• CHANGE: Reports / Accounts - Added percentage to Difference column.

• CHANGE: Reports / Trends - Better column header formatting.

• ADDED: Reports / Trends - Added "All years by year" to Trends to see all your Trend history by year.


**Version 2.03:**

• NEW: Report options now have easier drop-down selections

• NEW: Reports / Accounts Net Difference now allows flexible options (This week, Two Weeks, This month, 3 months, 6 months, This Year, etc.)

• NEW: Reports / Trends now has Monthly Grid (Jan-Dec) display with full column sorting and exporting.


**Version 2.01-2.02:**

• NEW: Added Income, Expenses and Transfers to Reports / Accounts (Checking and Credit Card can use a Calculated balance based on Display / Settings)

• NEW: Added ability to go back to previous month in Reports / Accounts like Trends

• NEW: Added column sorting indicators (ascending & descending)

• FIX:  Reports / Accounts could hang on null balance

**Version 2.00:**

• NEW:  Rewrite of Trends including cleaner percentages and better Trend cards at top.

• NEW: Added Accounts to Reports (display & export)  - More enhancements & flexibility to come for Accounts

**Version 1.28:**

• NEW: Full support for iPad and any external script besides Tampermonkey.


**Version 1.26/1.27:**

• NEW: Trends - Added third grouping for full Group & Category reporting (By Group, By Category, By Both)

• NEW: Trends - Clicking on date header will toggle between Current Date and Last Day of Previous Month

• CHANGE: Trends - Better > button

**Version 1.25:**

• NEW: Trends - Green/Red arrows in Monthly Summary.

• NEW: Trends - Monthly History now has clickable header

• NEW: Trends - Added Percentage Difference Increase/Decrease 

• NEW: Trends - Added ability in Setup to hide different percentages in Trends

• FIX: Reports - Repetitive "Clear Categories" link

• FIX: Trends - Export issues with negative numbers and $NaN if less than one year of data


**Version 1.22/1.23/1.24:**

• NEW: Expanding Monthly History of Group now shows category details

• FIX: Monthly Export would only work if two years of data but not three

• CHANGE: Added sticky header column when scrolling Trends container

• CHANGE: Added auto scrollbars to Monthly History container

**Version 1.21:**

• NEW: **Reports / Trends** module initial release (Uses all data / current date - Future enhancements should allow modifying end date & filters)

• FIX: Returning to Reports Income when breadcrumb is Expense or vice versa will now clear the breadcrumb and no override


**Versions 1.11/1.12:**

• NEW:  Added option to show YTD Actual total and Projected Total in Budget / Forecast / Monthly

• NEW:  Added option to export Budget / Forecast / Monthly to CSV

• NEW:  Added option to compress/make smaller Forecast grid

• NEW:  If Menu Hide Goals, then Goals will be hidden from Forecast

• CHANGE:  Menu and source clean-up 

• FIX: On/Off menu items did not update immediately if using a Login screen 


**Versions 1.10:**

• FIX:  Splits did not always work (Change in MM class)

**Versions 1.09:**

• FIX:  Corrected flicker to Transaction screen during Graphs Drill down

**Versions 1.08:**

• NEW: Reports Graph Breadcrumbs and Drill-down

• NEW: Added "Last 12 months" to Calendar

• FIX: Correct Calendar Year pull-down did not always work on Transactions screen. (more efficient)

**Versions 1.07:**

• NEW: Hide Accounts Net Worth Graph Panel

• NEW: Show Pending Transactions in Red

**Versions 1.06:**

• NEW: Correct Calendar Year pull-down to only be years of data instead of since 2000

• NEW: Added "Last year YTD" and "This Quarter" to pull-down calendar. (See Settings/Display to configue how it behaves)

• NEW: Quickly split a transaction 50/50 by auto-filling the amounts

• NEW: Compressed (smaller) Transactions grid to show more items on screen

• UPDATE: More efficient code for Hiding Popup "Difference" and Hiding Popup "Create New Rule"

**Versions 1.05:**

• NEW: Dataset will now also save/restore which Report (CashFlow/Income/Spending/Sankey)

**Versions 1.01 - 1.04:**

• UPDATE: Display menu options may randomly be lost

• NEW: New Save/Restore filters on Reports page

• UPDATE: More efficient 

• FIX: Cookies would expire 

• UPDATE: Checkboxes will now update automatically for both turning on and off 

• New: Ability to Hide Report Tooltip Difference

• New: Ability to Hide Hide Create Rule Tooltip



