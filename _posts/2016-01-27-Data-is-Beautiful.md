---
layout: post
title:  "Data is Beautiful"
date:   2016-01-27 09:58:40
permalink: /2016/01/27/Data-is-Beautiful.html
---

[Jer Thorp's](http://blog.blprnt.com/)[^1] talk at Chris Hadfield's Generator has been rattling around in my brain since the end of October.  He focused on the idea that *"data holds story"*; the data we collect and is automatically collected by our devices is not a series of random points but a log of our life.  Data has a human element, because each piece of data that we collect has meaning in the real world.  Data can be truly beautiful.  

These are some thoughts on data that I've had over the past few weeks.

**Fitbit**

I bought a [Fitbit](fitbit.com/ca) at the beginning of January because I couldn't stop thinking about data.  I wanted to collect motion data just because I thought it would be interesting.  My wife initially questioned why I would even want a Fitbit, as the data I collected probably wouldn't change my behaviour.

After receiving my Fitbit and getting a baseline for my activity level, something strange started happening.  I started paying more and more attention to my daily step count, wanting to reach the goal that my Fitbit defaulted with (10,000 steps per day).  Reaching that goal takes a conscious effort to move more.  In the past two weeks, I started reaching it on a regular basis.

My wife also got a Fitbit shortly after I received mine, and she decided to challenge me to see who can get the most steps between Monday and Friday.  My competitive nature kicked in, and all of a sudden I was travelling up to the 4th floor to use the washroom via the stairs (my office is on the 2nd floor).  Having fitness data showed me the problem of inactivity and offered a way to test for the solution of activity.  

**Server Logs**

Just after pushing (what I thought was) the last commit for [Endgame Chess](endgame-chess.herokuapp.com) (my capstone project for the Firehose Project), I decided to make sure everything was working right on Heroku. I visited the app, made an account, logged in, and created a new game.  Everything worked flawlessly so far.  Then, I tried viewing the game.  The request took a really, really long time.  And then it happened: 

> <strong>Application Error</strong>
> An error occurred in the application and your page could not be served. Please try again in a few moments.
> 
>If you are the application owner, check your logs for details.

A glitch, I thought.  I refresh the page and the same error appears again.  *What's going on*, I wonder. I head over to view the Heroku logs (data!) and I see an error code: [H12](https://devcenter.heroku.com/articles/error-codes#h12-request-timeout).  I looked it up and discovered that [the Heroku router will terminate a request that takes longer than 30 seconds to complete](https://devcenter.heroku.com/articles/request-timeout).  

To get more data on what was happening on the server, I opened up a local version of the app and requested the same page as I did on Heroku.  Through looking at the console output (data!), I found a couple of problems: 

1. We were calling our `Game#stalemate?` and `Game#checkmate` methods multiple times in the request.  These methods are expensive, since they each run potentially hundreds of SQL queries. 
2. In order to generate the board, we were querying both `Game.pieces.all` and `Game.pieces.find_by(row_position: row, col_position: col)`, resulting in multiple SQL queries to fetch the pieces. 

Together, all of these SQL queries were resulting in a > 30s response from our server.  Ouch!  

Having this data showed the problem and lead me to a solution: remove the additional `Game#stalemate?` and `Game#checkmate` method calls and optimize the query to generate the board. Doing this resulted in making generating the board 95% faster than it was before (original time: 44.2ms, optimized time: 2.2ms). You can see the [PR on GitHub](https://github.com/teamendgame/endgame-chess/pull/82) to see what changed. 

The more you notice and use data, interesting and sometimes unexpected things happen.  Data gives you the power of context, a reason why something is the way it is, even if it isn't obvious.  Try to see the beauty of the data we collect, and then see why its so valuable. 

<hr />

[^1]: You can see a [TED talk by Jer](https://www.ted.com/talks/jer_thorp_make_data_more_human) on a similar topic. 