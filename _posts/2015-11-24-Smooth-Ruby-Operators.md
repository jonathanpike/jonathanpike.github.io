---
layout: post
title:  "Smooth (Ruby) Operators"
date:   2015-11-24 7:15:00
---

It will be no surprise to you that I do a lot of research.  One topic that has stood out to me in the research that I’ve done has been Ruby operators.  While I may have encountered the term in high school math, I’ve since forgotten it in the intervening years.  The more I read, the more of these operators I came across, some easy to understand and some inscrutable (at least at first). To make things more confusing, there are different categories of operators, too: unary, binary, and ternary.

My curiosity was piqued, but finding a list and explanation of all of these the operators in Ruby seems to be hard to come by.  And as for a breakdown of what the different categories of operators are and how they differ?  It wasn’t until I started reading [Eloquent Javascript](http://eloquentjavascript.net/01_values.html#h_ygn12/ieo+) that I truly understood the relation between unary, binary, and ternary operators.

To help solidify all that I’ve read, researched, and learned, here is the most comprehensive rundown of all of the Ruby operators that I can provide.  There is missing information (see [_“What I Didn’t Cover”_](#didntcover) below), but none of the included information should be wrong[^1].<br/><br/>

**Operators in General**

As far as I am aware, the term “operators” and the concept of operations comes from the world of mathematics.  For example, when doing a simple calculation such as 1 + 1, + is the operator, and each 1 is known as an “operand”, or the value on which the operation is being performed.

Operators perform the same function in Ruby -- they combine or act on inputs to produce an output.  For example, something like `!true` (which uses the `!` unary operator)  returns `false`.  The number of operands an operator acts on is called the operator’s *arity*. 

Other important concepts are *precedence* and *associativity*, which both relate to the order of operations in a given expression.  You may remember the acronym “PEMDAS” (**P**arentheses, **E**xponents, **M**ultiplication, **D**ivision, **A**ddition, **S**ubtraction) from math class, which is a simple way of remembering the precedence of these operators.  If you have an expression such as (1 + 2) * 3, you know that 1 + 2 will be calculated first, as it is in parentheses, and the result will be multiplied by 3.  If you remove the parentheses from the expression so it is 1 + 2 * 3, you know that 2 * 3 will be calculated first, and the result will have 1 added to it.

Associativity deals with which direction the expression will be evaluated given operators with the same precedence.  For example, mathematical operators are often left-associative, which means they are evaluated from left to right.  1 + 2 - 3 is evaluated (1 + 2) - 3, not 1 + (2 - 3). <br/><br/>

**Unary Operators** *(operators with an arity of 1)*

Unary operators perform a function on a single operand.  In my experience, unary operators are by far the hardest to understand.  

- `!` -- Boolean Not. This one is simple -- it simply produces the boolean opposite of the operand.  In the case of the example above, `!true` evaluates to `false`. An equivalent operator is `not`, although it has a lower precedence than `!`. 
- `-` -- Unary Minus.  Also simple, as it works exactly like you would expect -- it changes the operand to negative, as in `-1`. 
- `+` -- Unary Plus.  The opposite of the Unary Minus, but less useful.  It simply returns the value of the operand (which is what you would expect). 
- `&` -- Unary Ampersand. So far, the operators that have been mentioned have not been confusing.  What did I mean when I said that the unary operators in Ruby were the hardest to understand?  The unary ampersand almost solely is responsible for my difficulty, because it works like magic. 

	Starting from the beginning, Ruby has three different types of closures: blocks, procs, and lambdas.  For this discussion, we’re going to just focus on blocks and procs.  The big difference between blocks and procs is that blocks are second class citizens and are one of the few things that aren’t objects, whereas procs are objects.  Blocks cannot be assigned to variables, for one thing, whereas procs can be.  

	Many methods in Ruby accept blocks, which is great.  You know a block when you see it: either between `do...end` or between curly braces (`{ }`) at the end of a method call.  Inside of your method, you can yield to that block, which means that the block will be evaluated inside the context of the method.  

	Going back to the difference between blocks and procs, what if you want to store one of these blocks as a variable?  Tough luck, as blocks are not objects.  However, you can store a proc as a variable and use the `&` operator in the method call, like so `method(&proc)`. This will convert the proc to a block, which will then be handled by your method. 

	Confusingly enough, the unary ampersand will also go the other way, converting blocks to procs so that you can store them in a variable and then `.call` them later, like so: 

	```
	class Sample
  		def initialize(&block)
    		@block = block
  		end
  
  		def method
    		@block.call
  		end
	end
	```

	Finally, `&` has one last trick up its sleeve. If you pass an object that is not a proc to a method that expects a block, it will also convert it from whatever it is to a proc, and then to a block for the method.  This is insanity!  It is also how amazing useful method chains like the following work: 

	`”1 2 3”.split(“”).map(&:to_i)`

	The method `#to_i` is being called as a block in map, changing each of the `String` objects in the array to `Fixnum` objects.  Wow. I told you it was confusing. For a much more thorough examination, please see [this article by Reginald Braithwaite](http://weblog.raganwald.com/2008/06/what-does-do-when-used-as-unary.html). 

- `*` -- Splat Operator. You thought the unary ampersand was weird?  You ain’t seen nothin’ yet! Essentially, it expands *either* an array or an object that can call `#to_a` and returns an array.  Instead of explain it poorly myself (as I’ve never actually used it), I will point you to [this great article by Adam Sanderson](https://endofline.wordpress.com/2011/01/21/the-strange-ruby-splat/).<br/><br/>

**Binary Operators** *(operators with an arity of 2)*

Binary operators are generally the most familiar operators to anyone who stayed awake in math class.  In fact, many of the binary operators are mathematical operators, and they work the same way as when you use a pencil and paper and don’t need much explanation! 

- `**` - Exponentiation. 
- `*` - Multiplication.
- `/` - Division.
- `+` - Addition.
- `-` - Subtraction.
- `%` - Modulo or Remainder Division.  Returns the remainder of a division operation rather than the result. Great for testing if a number is even (ie. `4 % 2 == 0`).
- `< > <= >=` - Less Than, Greater Than, Less Than or Equal To, and Greater Than or Equal To.
- `<=>` - Comparison.  This one is a little different from the rest, as it’s less self explanatory. If both left and right operands are equal, the Comparison operator returns 0 (`3 <=> 3`).  If the left operand is greater than the right operand, the Comparison operator returns 1 (`4 <=> 3`).  And if the right operand is greater than the left operand, the Comparison operator returns -1 (`3 <=> 2`). 
- `== !=` - Equal To and Not Equal To.

One interesting implementation detail is that these operators are actually methods and can be called like any other method.  For example, `3.+(3)` == 6. That looks weird, though, so you shouldn’t do it. 

Then comes the boolean binary operators: 

- `&&` - Boolean And. Both sides of the expression have to evaluate to `true` for the expression to be `true`.  For example, `true && false` returns `false`, whereas `true && true` evaluates to `true`. 
- `||` - Boolean Or. Only one side of the expression has to evaluate to `true` for the expression to be `true`.  For example, `true || false` returns `true`. 

These operators are not implemented as methods like the other binary operators. 

Finally, there are the assignment operators: 

- `=` - Regular assignment. 
- `+=` - Shortcut for `variable = variable + a`
- `-=` - Shortcut for `variable = variable - a`
- `*=` - Shortcut for `variable = variable * a`
- `/=` - Shortcut for `variable = variable / a`
- `%=` - Shortcut for `variable = variable % a`
- `||=` - Or Equals.  That’s my name for it, as those are the other two operators it combines.  This one is a little bit tricky, and it’s best explained with an example. Take the following code: `variable ||= []`.  This means that if `variable` is not specified elsewhere, it automatically gets assigned as an empty array.  It is a shortcut for `variable = variable || []`, which makes a lot of sense when you expand it out.<br/><br/>

**Ternary Operator** *(operators with an arity of 3)*

`? :` is the only ternary operator in Ruby.  This is often known as the *conditional* operator and is a really slick way of making an `if...else...end` statement into a one-liner. In use, the ternary operator looks like this: 

`statement ? true condition : false condition`

If the statement evaluates to true, the true condition will be evaluated, and vice versa. You can even link ternary operators together, such as: 

`statement ? second statement as first true condition ? second true condition : second false condition : first false condition`


While this is nice for brevity, it is not as clear as simply doing a nested `if...else...end` statement, and generally confuses new Ruby programmers.<br/>

<a name="didntcover"></a>
**What I Didn’t Cover**

If you look through this post, you’ll see one glaring omission[^2]: bitwise operators.  Why haven’t I included these?  Because I don’t understand them yet!  I’m still researching and trying to figure these out, but rest assured: once I do figure them out, I’ll post about them here! 

Another omission is the idea of mixins and being able to redefine/implement some of these operators in your own classes.  This is an OOP paradigm (composition) that I haven’t fully grasped yet, but I’m also researching and learning more about this.  I intend to write a post about mixins as soon as I get a firm handle on them.<br/><br/>

**Credits**

While some of the knowledge included here comes from trial and error, I have to thank the following sources for teaching me: 

- [The Ruby Programming Language - Chapter 4 (Operators)](https://www.safaribooksonline.com/library/view/The+Ruby+Programming+Language/9780596516178/ch04s06.html#ftn.id3275483)
- [Ruby’s Unary Operators - Ruby Inside](http://www.rubyinside.com/rubys-unary-operators-and-how-to-redefine-their-functionality-5610.html)
- [What is the Difference Between a Block, a Proc, and a Lambda in Ruby?](http://awaxman11.github.io/blog/2013/08/05/what-is-the-difference-between-a-block/)

<hr/>

[^1]: That said, I’m not perfect!  If you find a mistake, please [let me know](https://twitter.com/jonathanpike). 
[^2]: And, most likely, a lot of little omissions.
