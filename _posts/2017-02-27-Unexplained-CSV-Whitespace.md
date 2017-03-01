---
layout: post
Title: Unexplained CSV Whitespace
Description: Have unexplained whitespace in your CSV output from Rails?  This may solve your problem!
Date: 2017-02-27 14:30:00
---

**TLDR**: Blank lines in a `.csv.erb` template render as whitespace in the final CSV output.

Using the method I [described](https://jonathanpike.net/2016/09/Exporting-CSV-From-Rails) for exporting CSV, I created a new template and was testing it.  When I downloaded the CSV file and opened it, it appeared that the file was empty.  What was going on? I noticed that the scroll bar was rather long, so I started scrolling… and scrolling… and scrolling, down 1369 lines.  There’s the data. Then, I looked at the total lines in the file:  2738, which is double 1369.  It appears that, somewhere, I was inserting 1368 blank lines into the file prior to the data being written.  

I started debugging my `.csv.erb` template to see where this whitespace was coming from.  First, I set a breakpoint in the template right before rendering the CSV.  Ruby’s CSV library wraps a string in a CSV object, and I could verify that the string had no whitespace.  

Next, I started removing elements from the CSV template until I found the culprit.  What I found was that an entire section of the CSV document was where the problem was happening. No matter what subsection of that section I removed, the issue would still persist.  If I removed the entire thing, the output would begin at line one. 

Finally, I decided to try something that I thought was crazy: I had defined a few variables in ERB tags earlier in the document, and I had inserted a blank line between each of these for readability.  What if I removed those?  The output began at line one. Bingo! Not so crazy after all!

If you have more whitespace than you bargained for in CSV output and are using a `.csv.erb` view template, check for blank lines. These could be the culprit. 
