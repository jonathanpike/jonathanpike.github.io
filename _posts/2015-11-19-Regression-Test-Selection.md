---
layout: post
title:  "Regression Test Selection"
date:   2015-11-19 6:52:00
---

On Tuesday, I watched a [really great talk about Ruby and Rails performance](https://www.youtube.com/watch?v=JMGmaRZtgM8) by [Aaron 'Tenderlove' Patterson](http://tenderlovemaking.com), the famous Ruby and Rails contributor.  While there were many ideas and concepts in the talk that sparked my curiousity, the concept of regression test selection really stuck in my brain. What is it, and how does it work?

From my understanding, regression test selection is a simple idea. Consider the following scenario: you are a developer on an web application that has a great test suite and all of the tests pass. When you make a change to a small portion of your code base, you want to make sure that you haven't introduced any bugs, so you'll want to re-run your test suite.  Running the full test suite can take a long time, and you only made changes to one small part. Why do you have to test those portions that weren't changed and will surely pass? Regression test selection is the solution to this dilemma. Instead of running the whole test suite, you will only run the subset of tests that deals directly with whatever you changed. This will reduce the cost of running your tests and make sure that no bugs have been introduced. Amazing idea, right? 

During his talk, Tenderlove demonstrated a regression test selector for Minitest and Rspec he wrote, which you can view [here](http://tenderlovemaking.com/2015/02/13/predicting-test-failues.html).  It works with built in Ruby code coverage tools[^1] to figure out what code a particular test executes, then looks at your git repository to see which files and lines were changed. Skipping all of the implementation details that you can read for yourself, it will end up spitting out the tests that are likely to fail with the change that you made. 

[Dyego Costa](https://github.com/DyegoCosta) has taken Tenderlove's idea and packaged it into a gem called [What To Run](https://github.com/DyegoCosta/what_to_run) to make it easy to integrate into your projects. 

Regression test selection isn't necessary for every project, especially if your test suite is fast. It is a real boon for projects with large, slow test suites, and the very idea itself really demonstrates the creativity and problem-solving mindset that draws me towards being a developer.

If you want a deep-dive into this concept, consider reading [An Empirical Study of Regression Test Selection Techniques](https://www.cs.umd.edu/~aporter/Docs/p184-graves.pdf), which analyzes several different regression test selection techniques and discusses the cost and benefits of each.

<hr /> 

[^1]: Code coverage is "a measure used to describe the degree to which the source code of a program is tested by a particular test suite" ([source](https://en.wikipedia.org/wiki/Code_coverage))