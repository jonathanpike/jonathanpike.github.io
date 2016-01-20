---
layout: post
title:  "Scripting in Ruby"
date:   2015-12-20 09:55:20
---

Just over half a year ago, I tweeted the following: 

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">I love reading about automation, but I really can’t think of anything to automate. A curse of not using my own computer all day?</p>&mdash; Jonathan Pike (@jonathanpike) <a href="https://twitter.com/jonathanpike/status/592752223161049089">April 27, 2015</a></blockquote>

I love reading blog posts where clever people describe the scripts that they write to make their work (and, by proxy, their life) easier by automating boring, repetitive tasks.  Back in April, I guessed that I didn't automate because I couldn't think of anything to automate. I've now realized that the boring, repetitive tasks that I have to do at work fundamentally _can’t_ be automated because they are tasks that need a human touch.  The tools and systems that I have at my disposal are very much a product of another time -- a time where humans were the only “computers” that existed in an office. 

Philosophizing aside, writing on this blog has actually produced a boring, repetitive task that was a perfect candidate for me to automate!  Letting people know when I write something new is something that a computer is perfectly suited for.  And so, I give you [Pikebot](https://github.com/jonathanpike/pikebot/blob/master/pikebot).  It’s just a simple Ruby script that fetches a blog RSS feed, determines if something new has been posted in the last hour, and, if so, posts the title and a link to that blog entry to Twitter.  Couldn’t be simpler.

Through writing this little script, I learned a couple of things: 

- An idea for automation doesn’t always need to be executed in the most grandiose way.  I had visions of a command line Twitter utility that would allow users to specify their blog RSS feeds and set up cron jobs to handle the feed fetching automatically.  While all of this is definitely technically possible, this idea wasn’t worth executing (for me, at least).  Pikebot, in its current form, is perfectly capable at doing exactly what I want with minimal effort on my part. 

- A Ruby script can be made much easier to execute by making it [executable and putting it in a location in your PATH](http://commandercoriander.net/blog/2013/02/16/making-a-ruby-script-executable/).  This way, all I do is type `pikebot` in any Terminal window and it runs. 

- Dealing with time is hard.  When I was initially testing my script, it kept telling me “No new posts to tweet about” even though I had just posted something a minute ago.  It took me a few minutes to realize that it was because my blog’s time zone is UTC (for whatever reason) and I was checking the time using `Time.now` (which was using EST).  A quick and dirty fix was to change Pikebot to use UTC. Since I live in EST, converting to UTC was a pain, so I have my computer do it for me with another script called [utcnow](https://github.com/jonathanpike/pikebot/blob/master/utcnow), which is included in the Pikebot repository. 

Go forth and automate! 