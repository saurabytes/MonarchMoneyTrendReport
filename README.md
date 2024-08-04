# Monarch Money Tweaks
Tweaks for Monarch Money

* Ability to turn ON/OFF menu items.

* Ability to hide Report Tooltip Difference 

* Ability to hide Hide Create Rule Tooltip


# Monarch Money Trend Report
Trend Report (Compare This Period/Last Period) for Monarch Money


Being a former Mint User and needing a Trend Report bad, I decided to learn JavaScript and create one myself this past weekend. I use a Trend Report to simply pace my Total Savings comparing where I am this year (end of month) to where I was last year (end of month) - "Should I tone it down or can I spend more" type of report. I'm able to just keep myself quickly on pace without the work of Goals or Budget setups, just go against last year how I want to throttle my spending & savings.

This past weekend I was able to learn JavaScript and write a program to do what I needed. I am not a JavaScript programmer so don't laugh at the code. I added some extra work to have the same look and feel, so I used the current styles for both Light & Dark Mode.

To use - On the Sankey Diagram:

1. Run the Sankey Diagram for a Compare Period you want ("Last Year" or say "1/1/2023 to 3/31/2023") and then press Trend Compare
2. Run the Sankey Diagram again for a new/current period you want ("This Year") and press Trend Report

That's it.

**Figures in GREEN are Good!   You made more, Green.  You spent less, Green.  You saved more, Green.**

Things I've learned along the way:

"BOTH" Sankey does not work - only use Categories & Groups. I have not worked on it at all to work for "BOTH"

The information is pulled not from a Query (graphql) and is really screen scraped - so it's really their data, just reformatted with some small tweaks. 

This is JavaScript that I run using Tampermonkey.  Tampermonkey is available for Chrome, Microsoft Edge, Safari, Opera Next, and Firefox. (I use Firefox).

I welcome any comments.

Enjoy!
