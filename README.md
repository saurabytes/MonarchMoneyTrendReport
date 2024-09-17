Hello!

I use **Monarch Money**.  

I found there were opportunities to enhance the Monarch Money web application with more functionality and configuration options using Tampermonkey.  Tampermonkey is a browser extension for Chrome, Microsoft Edge, Safari, Opera Next, and Firefox.  You can install it by going to the following link.

https://www.tampermonkey.net/

Once Tampermonkey is installed, you can next click on **Update MonarchMoneyTweaks.user.js** above and it will automatically install.

# Monarch Money Tweaks

* Compressed / Smaller Transactions grid to show more items

* Ability to Drill Down / connect Groups to Categories in Income & Spending reports
  
* Turn ON/OFF menu items

* Save and Restore different Report Datasets (Save/Restore all settings on Reports page)

* Hide Report Tooltip "Difference Amount" in Reports

* Hide Create Rule Popup in Transactions

* Quickly split a transaction 50/50 by auto-filling the amounts

* Correct Calendar Year pull-down to only be years of data instead of since 2000

* "Last year YTD", "Last 12 months" and "This quarter" to pop-up calendar

* Hide Accounts Net Worth Graph Panel

* Show Pending Transactions in Red


# Monarch Money Trend Report

There is also a optional second extension which recreates a Mint Trends report (Compare This Period/Last Period):

The Trend Report is used to simply pace Total Savings comparing where you are at one period to another period (ie: same time, last year).

To use - On the Reports / Sankey Diagram:

1. Run the Sankey Diagram for a Compare Period you want ("Last Year" or say "1/1/2023 to 3/31/2023") and then press Trend Compare
2. Run the Sankey Diagram again for a new/current period you want ("This Year") and press Trend Report

That's it.

**Figures in GREEN are Good!   You made more, Green.  You spent less, Green.  You saved more, Green.**

Things I've learned along the way:

"BOTH" Sankey does not work - only use Categories & Groups. I have not worked on it at all to work for "BOTH"

The information is pulled not from a Query (graphql) and is really screen scraped - so it's really their data, just reformatted with some small tweaks. 

I welcome any comments.

Enjoy!
