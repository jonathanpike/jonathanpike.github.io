---
layout: post
title:  "Check Your Assumptions"
date:   2015-10-01
---

*This post details some of my experience in [the Firehose Project](http://thefirehoseproject.com).*

I finished [Nomster](http://nomster-jonathan-pike.herokuapp.com) last week and was ready to keep learning at a break-neck pace.  The Object Oriented Programming lessons appeared on my dashboard and I got coding along with [Ken](https://github.com/kenmazaika).  After the finishing the videos, I wanted to test out my newly learned skills and started work on the first Image Blur coding challenge.  

From the description, it seemed like a light warm up compared to what was going to come in Image Blur 2 and 3, and I thought I would breeze through it in a matter of minutes.  After all, I had been doing similar (and many more difficult) challenges for weeks through both [Code Abbey](http://www.codeabbey.com/) and [Code Wars](http://www.codewars.com/).  Instead, I spent a frustrating hour trying to figure out what I was doing wrong.  

Image Blur 1 was the first time that I built a class to solve a problem.  Normally, I would just create a method or two and go from there.  I built the Image class, defined my `initialize` and `output_image` methods in the class, created a new instance of Image, called `output_image` on it, and then got this error: 

```wrong number of arguments (1 for 0)```

What do you mean, wrong number of arguments?!  I fiddled around with my code, I googled, I banged my head in frustration against my desk.  What was wrong?! What had I missed??

I stepped away from my code for a few minutes, hoping for some subconscious clarity.  Upon returning, I finally realized the fatal flaw: I hadn't defined `initialize`, I defined `initalize`.  Notice the slight, one letter difference.  I fixed it and the code ran perfectly. 

I believe it was on [Reconcilable Differences](https://www.relay.fm/rd/7) that [John Siracusa](http://hypercritical.co/) mentioned that it's often the variables or elements that you are most sure of that cause the errors in your code.  After I experienced this, I fully agree with him. If you're getting an error, always check what you are most sure of.  I bet you'll find something you missed. 