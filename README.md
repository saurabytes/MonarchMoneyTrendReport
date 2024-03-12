# MonarchMoneyTrendReport
Trend Report (Compare This Period/Last Period) for Monarch Money


Being a former Mint User and needing a Trend Report bad, I decided to learn JavaScript and create one myself this past weekend. I use a Trend Report to simply pace my Total Savings comparing where I am this year to where I was last year same date (or really I use of of this month) "Should I tone it down or can I spend more" type of report. I'm able to just keep myself quickly on pace without the work of Goals or Budget setups, just go against last year how I want to throttle my spending & savings.

This past weekend I was able to learn JavaScript and write a program to do what I needed it to do. I am not a JavaScript programmer so don't laugh at the code, my purpose was to make it do what I needed and I was. I added some extra work to have the same look and feel so I used the current styles for both Light & Dark Mode.

To use - On the Sankey Diagram:

    Run the Sankey Diagram for a Compare Period you want ("Last Year" or say "1/1/2023 to 3/31/2023") and then press Trend Compare
    Run the Sankey Diagram again for a new/current period you want ("This Year") and press Trend Report

That's it.

Things I've learned along the way:

    I used the styles that were in MM so it looked the same, but I'm sure it will break easily since styles are generated. If someone can give me the code to correct this, or at least look at the tags just at the beginning (ie: "TransactionsSummaryCard__ValueText*" it would probably be more stable between releases. (I'll keep it up-to-date at least this year and my MM runs out)

    "BOTH" Sankey does not work - only use Categories & Groups. I have not worked on it at all to work for "BOTH"

The information is pulled not from a Query (graphql) and is really screen scraped - so it's really their data, just reformatted with some small tweaks. It would be great if MM could do something like this internally with their code so I can just remove this and not maintain it. But, again, this is written as a "band-aid" approach.

I welcome any comments.

Enjoy!
