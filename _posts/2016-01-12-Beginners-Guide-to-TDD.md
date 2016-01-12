---
layout: post
title:  "A Beginner to TDD's Guide to TDD for Beginners"
date:   2016-01-12 09:35:32
---

Software testing is necessary, but software testing is hard for beginners.  

Before I was introduced to automated software testing, it seemed impossible to actually make sure everything worked in the apps that I made.  Opening a browser and clicking around takes forever, especially in development mode in a Rails app.  And what about that one weird edge case? Do these methods work together like I expect them to?  Automated testing is only as good as your test suite, but it takes the manual labour out of figuring out if things work as expected. 

The most important thing in this post: you should be writing tests for your code.  If you're not already doing so, I highly suggest that you stop reading right now and learn how to use one of the testing frameworks for your language of choice.  If you use Ruby, check out [Minitest](https://github.com/seattlerb/minitest).  If you use Javascript (node), check out [Tape](https://github.com/substack/tape). 

Since my experience is with Rails apps, the easiest way to find out what to test is simply read the [Rails Guide on testing](http://guides.rubyonrails.org/testing.html).  Rails, by default, uses [Minitest](https://github.com/seattlerb/minitest) as its testing framework, which is easy to pick up because it’s just Ruby code.  Another popular framework is [Rspec](http://rspec.info/), which provides a DSL that allows you to write your tests in a way that looks more like english, although that means you need to learn the DSL to use it.  [Thoughtbot](https://robots.thoughtbot.com/how-we-test-rails-applications) has a guide up that describes how they test with Rspec. 

Aside from the testing frameworks themselves, there are several different testing methodologies that developers follow.  One of the most popular, and the one that I’ll focus on today, is Test Driven Development (TDD).

**What is TDD?**

TDD is the idea that you should write tests first (which should fail -- test that they do!), then write the code to pass those tests, then make that code better while it still passes the tests. In other (buzz) words: red, green, refactor. This is a tall order if you’re new to testing.  In my case, a few months ago I hardly knew how to write tests, never mind write them before I wrote any code.  

If you are new to testing, it can be helpful to write your tests after you’ve written your code, at least until you’re more comfortable with testing.  Even if they’re written afterwards, your tests will still make sure your code works as expected.

**Why use TDD?**

Testing is important, but why does the order that tests are written matter?  TDD will not make you a better programmer and not using TDD doesn’t mean you’re a terrible programmer.  TDD is a tool that you can use that can aid in the design and implementation of your code.  I use TDD because it helps me with:

1. Clarity of Design: When I’m forced to write tests first, I have to really think about the problem I’m trying to solve.  What is the problem and what should the outcome be?  When that is clarified in my mind, I write tests that make sure that outcome happens.  All of that thinking is done and settled before I write a single line of code to solve that problem. 
2. Instant Feedback: When writing tests second, there was always a feeling of “will it work...” before writing the tests. When writing tests first, the second I finish writing my problem-solving code, I can see if it works.  There’s no waiting with bated breath, hoping and praying that my code solves the problem.  

While there may be other benefits, these are the most important ones that lead me to try TDD in the first place.

**How do I get started?**

You are writing tests, right?  Okay, good.  Once you have writing tests down, the only step you need to follow is to write those tests before you write any other code.  This will mean that you need to sit down and come up with a specification to the problem you’re trying to solve prior to solving anything.  Then, put that specification into code with tests.  Make sure those tests fail.  Finally, write code to make those tests pass.  Once they pass, make that code better.  

A benefit of writing code to make tests pass is that you generally will only write enough code to make the test pass, and no more.  Less code is often better code. 

**Some Caveats**

While I’ve had some good experiences with TDD, I don’t think that it’s a perfect methodology and I don’t think that you should always follow it.  DHH (the creator of Rails) himself has declared that [TDD is dead](http://david.heinemeierhansson.com/2014/tdd-is-dead-long-live-testing.html).  While I wouldn't go as far as DHH, I do see some drawbacks to following it too closely.

The biggest one is that you’re often blind to edge cases when you’re first thinking out a specification to a problem.  If you declare your test suite done prior to writing any code, and then don’t go back and add to it when you find a weird edge case, you will never know if a more recent change has caused a regressions.  Regressions are never fun!  When you find a weird edge case, write a test for it.

Another downside to TDD is that it can limit creativity in solving problems.  If you’re just doing enough work to slip by the test, you could end up never putting the work in to find a much better solution.  For beginners, like me, you’re also limited by your knowledge and ability with your testing framework.  

Implementing TDD in my own workflow has been a net win for how I think and how I write code.  You should give it a try and see how it can help you, too! 