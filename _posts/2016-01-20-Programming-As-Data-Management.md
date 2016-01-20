---
layout: post
title:  "Programming As Data Management"
date:   2016-01-20 09:12:15
---

As I’ve learned more about programming, I’ve gone through several distinct mental models about what I’m doing.  A rough timeline:

1. **Beginner Beginner**: Programming as a black box.  I type a few magic words and out comes math.  Awesome!  
2. **Intermediate Beginner**:  Programming as syntax.  I no longer type incantations to the mighty computer, but syntax that is parsed by an interpreter.  Math still comes out.  
3. **Advanced Beginner**: Programming as data management.

This last mental model formed after researching web APIs.  What is an API? As an acronym, I knew that API meant Application Programming Interface, but what does that mean? I didn’t know.  What did it mean that Twitter had an API?  What did that do for me?  

Surprise, surprise -- [Wikipedia has the answer](https://en.wikipedia.org/wiki/Web_API). An API, when it comes to web applications, means that a programmer has an interface to access the data in that app.  In the example of Twitter’s API, I have access the timelines, tweets, followers, and a lot of other information, of any user that grants me access (via API keys).  

In that regard, I believe can be largely seen as data management and manipulation, both in your own app and in any app that you interface with.  Rendering a page?  Data management.  Accepting user input? Data management.  Accessing a 3rd party app’s API?  Data management.  Any problem that you’re solving is essentially one of data management: where is the data coming from, what type of data am I getting, what do I need to do with it, and where do I store it?  

Breaking the entire field down into these four (and potentially more) questions really simplifies things for me.  A new idea that I’m working on requires me to fetch RSS feeds from blogs.  Prior to this realization, I would just be going about trying to find a gem or library that deals with RSS and not worry about what is actually happening.  Now, I know that the data is coming from RSS feeds from other blogs, the data type is structured XML, and I know what I’m going to do with it. I don’t (yet) know how to write my own XML parser (that’s another topic altogether), so I still have to rely on some sort of external library to do the parsing for me, but I have a slightly deeper understanding of what is going to happen under the hood, so to speak. 

The next time you come across a programming problem, try thinking about it in terms of the data.  