# Monarch Money Tweaks - Version History
Here are a list of Open Issues, Unreleased changes and past changes:

Email any issues directly:  robert @ paresi.net

**Version 3.00 (beta):** 

• NEW: Monarch Money Tweaks no longer uses Cookies - which should help with people losing settings.  
> [!IMPORTANT]
> **Please redo all your settings immediately after this update. - Sorry for this, but it makes things better under the covers going forward.**  

• NEW: Reports / Trends history side panel will now show a Sub Total.

• FIX: When running Accounts report for previous month, the Balance column was showing zero.


**Version 2.46:** 

• REGRESSION: The Export button stopped working in Trends & Accounts.


**Version 2.00-2.45:** 

• FIX: Reports / Accounts could fail if user changed Account Groups to be less than the previous default selection.

• FIX: Filter out "transfers" in Monthly Trends report.

• REGRESSION: Clicking on Date in Reports Accounts & Trends goes back to end of previous month.

• FIX: You can now change Light and Dark mode in Trends/Accounts reports without having to refresh the screen.

• CHANGE: Removed Datasets (Tweaks Saved Reports) - No longer need since Saved Reports as now part of Monarch Money (Yea!)

• CHANGE: Corrected Trends/Account Date/Filter header to be compatible with changes in Monarch Money

• CHANGE: Removed Calendar shortcuts - No longer compatible with changes in Monarch Money 

• NEW: Change Calendar "Last" Number from String to Spinbox

• FIX: Stop Trends & Accounts reports from running twice simultaneously if user double-clicked on menu link.

• CHANGE: Made Househould more generic by calling it "Account Group" and updated screens.

• CHANGE: More streamlined code / Correction of possible duplicate Household information in Account Summary

• NEW: Added "Household" name to Accounts / Edit screen.  (ie: Parents, Kids, etc.)

• NEW: Accounts Summary pane will now show "Household" breakdown of Assets and Liabilities.

• NEW: Added ability to Filter Reports / Accounts by All or by Household group.

• NEW: Ability to change order of Income, Expenses and Contributions in Budgets.

• REGRESSION: Reports / Trends & Reports / Accounts would fail because of changes made by Monarch Money to the Reports menus.

• BUG: Reports / Trends could fail when running Monthly.

• NEW: "Monthly Summary" button goes to three year Monthly Summary when expanding Categories and Category Groups from Transactions & Budgets.

• NEW: Budget Summary Panel removed if Budgets Menu item is turned off.

• CHANGE: Better Trends/Accounts buttons for pull-down.

• REGRESSION:  Changes on Monarch side caused Transaction Compressed Grid not to work.

• REGRESSION:  Changes on Monarch side caused Left to Spend to not always appear during Flex Budget.

• NEW:  "Left to Spend" direct link for Pending Transactions

• NEW:  Added ability to Ignore Rollover Budget remaining and always use Budget minus Spent.

• NEW:  Added "Left to Spend" (Checking - Credit Cards - Pending) to Budget Summary and Budget Dashboard. (Turn on in Display/Settings/Budget)  

• CHANGE:  Ability to do Ignore Budget Income & Ignore Budget Expenses. (2.21)

• FIX:  Left to Spend might not show up if you use Rollover budgets. (2.22)

• NEW:  Reports / Trends Monthly Summary can now link expanded items to Income & Spending charts. 

• NEW: Reports / Trends now goes to Reports Income & Spending rather than the old Cash-Flow screen.

• NEW: Ability to always hide decimals in Reports / Accounts

• NEW: Added "Last three years with average" to Reports / Accounts

• NEW: Automatic Calculations - click on multiple cells to get SUM, AVG and CNT.  Click on each bubble to copy the value to your clipboard.

• REGRESSION: Reports / Accounts - Drop-Down for Time-Frame was not setting properly.

• NEW: Display Current year, last 12 months or last 6 months of Account Balances with Average in Reports / Accounts 

• NEW: New and more streamlined Cards with more information in Reports / Trends

• NEW: "Refresh All" accounts the first time logging in for the day (Settings / Display / Accounts)

• NEW: Ability to always hide decimals in Reports / Trends

• NEW: Ability to show Pending total and Projected balance amounts by account in Reports / Accounts

• NEW: Ability to hide Net Change percent in Reports / Accounts

• NEW: Transactions grid can have smaller font & compressed grid. (Settings / Display)

• NEW: Budget grid can have smaller font & compressed grid. (Settings / Display)

• NEW: Ability to compress Reports / Trends & Accounts grid.

• FIX: Export History Grid might throw exception creating file name.

• CHANGE: Better styling with new color style.

• REGRESSION: Reports / Trends - Left two columns were comparing to End of Month regardless of setting.

• REGRESSION: The calendar was not always working properly (Last 12 months, Last year YTD, This quarter) depending on Calendar "include full month" configuration.

• FIX: Some rounding could be $1 different between the screen of data versus export of data. (Export was not rounding)

• CHANGE: Reports / Trends & Accounts - Better font sizes, faster, less flicker

• FIX: Clicking on outside border of "Date" button would not load custom three date ranges.

• CHANGE: Reports / Trends - When on last day of current month (11/30) and comparing to last month, last month will now compare to last day of month (10/31 instead of 10/30).

• FIX: Monarch new color scheme corrections.

• DEPRECATED: Reports Breadcrumbs and compressed transaction grid functionality removed.  Monarch Money now does it.  Yea!

• NEW: Reports / Accounts - Ability to select which total cards to show at top (Checking, Savings, Credit Card, Investments) - Unused cards will be filled with individual credit card accounts.

• FIX: Reports / Accounts - If beginning balance for account was zero and ending balance was also zero, but there were transfers for the current month, the account would not show in the list.  

• FIX: Reports [Datasets] button stopped appearing in Safari browser.

• CHANGE: Nicer Settings / Display menu

• FIX: Reports / Accounts - Going back to previous month would duplicate Cards

• FIX: Reports / Accounts - Fixed Accounts that may not appear with pastBalance <> 0

• FIX: Reports / Trends - If YTD previous was negative and current year positive, shading would not occur.

• CHANGE: Reports / Accounts - Added percentage to Difference column.

• CHANGE: Reports / Trends - Better column header formatting.

• ADDED: Reports / Trends - Added "All years by year" to Trends to see all your Trend history by year.

• NEW: Report options now have easier drop-down selections

• NEW: Reports / Accounts Net Difference now allows flexible options (This week, Two Weeks, This month, 3 months, 6 months, This Year, etc.)

• NEW: Reports / Trends now has Monthly Grid (Jan-Dec) display with full column sorting and exporting.

• NEW: Added Income, Expenses and Transfers to Reports / Accounts (Checking and Credit Card can use a Calculated balance based on Display / Settings)

• NEW: Added ability to go back to previous month in Reports / Accounts like Trends

• NEW: Added column sorting indicators (ascending & descending)

• FIX:  Reports / Accounts could hang on null balance

• NEW:  Rewrite of Trends including cleaner percentages and better Trend cards at top.

• NEW: Added Accounts to Reports (display & export)  - More enhancements & flexibility to come for Accounts

