---
layout: post
title:  "Recursion"
date:   2015-10-17 11:50:00
permalink: /2015/10/17/Recursion.html
---

Recursion is a topic that has greatly confused me since I learned about it.  After all, the joke goes _"in order to understand recursion, you must understand recursion"_.  I knew that, stated simply, recursion is calling a method from within itself, but I had no idea how to implement a recursive method or how a recursive method worked.  That all had to change when I was required to write a recursive function to return the fibonacci number given an index for one of the job prep challenges in the [Firehose](http://www.thefirehoseproject.com) curriculum.  Here is the code I came up with: 

{% highlight ruby %}
def recursive_fib(num)
    if num <= 1
        return num
    else
        answer = recursive_fib(num - 2) + recursive_fib(num - 1)
    end
    
    return answer.abs
end

def iterative_fib(num)
    fib = [0, 1]
    
    (num - 1).times do 
        nextnum = fib[-2] + fib[-1]
        fib << nextnum
    end
    
    fib.last
end
{% endhighlight %}

Having begun learning programming seriously with [Python](http://learnpythonthehardway.org) (an object-oriented language), my mind seems to work naturally in loops.  As such, the iterative solution was much easier to conceptualize (ie. initialize an array for the fibonacci numbers, create a loop that executes n - 1 times to fill out the array, and then return the last value) and much easier to write.  

The recursive solution, as I figured out, works because of how fibonacci numbers work: the next number in the sequence is the sum of the two previous. And so, the recursive solution sums the fibonacci number of the previous 2 indices and returns the answer. After figuring it out, this solution seems trivially easy.  

That explanation leaves something to be desired, though: how does the recursive method know what the fibonacci number at the two previous indices is?  How does it know the fibonacci sequence at all?  That’s the mystery of recursion. 

After reading a [fantastic article](https://www.cs.umd.edu/class/fall2002/cmsc214/Tutorial/recursion.html) from the University of Maryland Computer Science Department, I believe I have a good enough grasp on recursion to answer that.  The key to understanding recursion is realizing that you require two parts, at minimum: a base case and the recursive call.  In the fibonacci sequence problem, the base case is line 2 -- if ```num``` (the index) is less than or equal to 1, the fibonacci number you are looking for is 1. Everything stems from the base case, generating each successive fibonacci number by running through the base case up to the asked for index. Breaking the problem into its smallest element and then calling that element over and over again until you get the desired result is recursion. 

The point of this exercise, in part, was to show that recursion, in some situations, can be extraordinarily inefficient.  The iterative solution performs many times faster than the recursive solution, and given a high enough index, the recursive solution will actually cease to function (it runs out of memory).  It’s an eye opening exercise and a very different way of thinking.  

I still prefer iteration, though! 