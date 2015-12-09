---
layout: post
title:  "Get (Bit)Wise"
date:   2015-12-09 11:25:00
---

[Previously on jonathanpike.net](http://jonathanpike.net/2015/11/24/Smooth-Ruby-Operators.html), I gave a run-down of most of the operators in Ruby, with the promise that I would cover certain omissions.  The day has come, my friends, to address… bitwise operators!  

Bitwise operators are not hard to understand but they’re also not intuitive.  The key to understanding them is realizing that they work on a _bit_ level.  Bitwise operators work because Ruby stores integers in memory as a sequence of bits, which allows bitwise operators to manipulate these bits.  Bitwise operators _only_ work with Integers. 

**Binary Refresher**

Understanding bitwise operators requires a basic understanding of binary numbers.  Let’s use this variable as an example: `a = 21`.  `21` is an integer, which is immediately recognizable to us (given our [decimal/base 10](https://en.wikipedia.org/wiki/Decimal) number system).  Computers, on the other hand, work in [binary/base 2](https://en.wikipedia.org/wiki/Binary_number).  We can use the `Integer#to_s` method to convert a base 10 number to a base 2 number as follows: 

{% highlight ruby %}
a.to_s(2)
# => "10101"
{% endhighlight %}

If you’ve never been introduced to binary numbers, that may look a little confusing.  A simple way of thinking about binary numbers is in terms of “columns”: each column represents a certain number and each column can be either a 0 or a 1.  The columns go like this (from right to left): `one | two | four | eight | sixteen | thirty-two | sixty-four … etc`.  If the bit in the column is 1, add the value of the column to the total, and if the bit in the column is 0, don’t add the value of the column to the total. 

In our example, the ones column is 1, so we add 1 to our total.  The twos column is 0, so we skip it.  The fours column is 1, bringing our total to 5.  Skip the eights column, which leaves us with the sixteens column. 16 + 5 = 21. 

_Bonus Content:  [here’s a super easy way](http://www.zenoli.net/2007/03/quickly-convert-binary-to-decimal-in-your-head/) to convert binary numbers to decimal numbers in your head without having to think of them in columns!_

**Back to Bitwise Operators**

There are 6 bitwise operators in ruby, almost of which are binary operators (operators that work with 2 operands), as follows: 

`&` - the AND operator
`|` - the OR operator
`^` - the XOR (exclusive or) operator
`~` - the NOT operator -- _this is the only unary operator in the bunch_
`>>` - the right shift operator
`<<` - the left shift operator

A few of these look exactly like the boolean operators that I addressed last time and it turns out they work in a similar way.

**AND**

The `&` operator will look at the binary representation of both numbers and will return `1` when both numbers have a `1` bit in the same column.  We’ll use our variable `a` as defined before, and we’ll define another variable to use as an example: 

{% highlight ruby %}
a #=> “10101”

b = 18
b.to_s(2)
# => “10010”

(a & b).to_s(2) 
# => “10000”
{% endhighlight %}

Since the only column that `a` and `b` had in common was the sixteens column, that is the only column that returned `1`. 

**OR**

The `|` operator works in a similar way to the `&` operator, but will set any bit that is `1` in either number to `1` in the return value: 

{% highlight ruby %}
(a | b).to_s(2)
# => “10111”
{% endhighlight %}

**XOR**

The `^` operator is the opposite to the `&`, and will only set a bit as `1` if that bit is `1` in only one of the two compared numbers: 

{% highlight ruby %}
(a ^ b).to_s(2)
# => “00111”
{% endhighlight %}

**NOT**

The `~` operator does exactly what you think it does: it  flips all of the bits of the number (if they were `1`, they are now `0`).  Strangely, the `Integer#to_s` method produces some odd output: 

{% highlight ruby %}
(~a).to_s(2)
# => “-10110”
{% endhighlight %}
  
What’s going on here?  Shouldn’t it be `01010`? The answer comes from how binary numbers handle negatives, and how the `Integer#to_s` method deals with negative binary numbers. 

Binary numbers don’t natively have a negative sign to deal with negative numbers.  Instead, they are represented through a method called [two’s compliment](https://en.wikipedia.org/wiki/Two%27s_complement).  A really great explanation of how it works can be seen [here](https://www.youtube.com/watch?v=ZLA0Ahymiv8).  In a nutshell, to convert to two’s complement notation, the leftmost bit becomes the sign value (which reduces the range that your binary number represents), all of the bits are flipped (with the bitwise NOT), and you add 1.  

Secondly, the `Integer#to_s` method does not actually return a true representation of binary numbers when dealing with negatives.  Instead, it returns a representation of the number prepended with a negative sign.  In this example: 

{% highlight ruby %}
~a #=> -22
(22).to_s(2) #=> “10110”

(~a).to_s(2) #=> “-10110”
{% endhighlight %}

Using the `Fixnum#Fix[n]` method, we can see the binary representation of each bit in our number, which shows NOTs true colours: 

{% highlight ruby %}
a = 21
b = ~a

5.downto(0).map { |n| a[n] }.join #=> “010101”
5.downto(0).map { |n| b[n] }.join #=> “101010”
{% endhighlight %}

**<< and >>**

The right and left shift operators simply shift an integer’s bits in the direction you specify.  It will add 0s if shifting left and remove bits if shifting right, as per how many spaces you tell it to shift.  For example: 

{% highlight ruby %}
a.to_s(2) #=> “10101”
(a >> 1).to_s(2) #=> “1010”
(a >> 4).to_s(2) #=> “1”

(a << 1).to_s(2) #=> “101010”
(a << 4).to_s(2) #=> “101010000”
{% endhighlight %}

**So What?**

All of this is interesting at an academic level, but it’s hard to think of a use for bitwise operators in day to day Ruby programming.  Why have a feature that isn’t all that useful?  The answer is that while this functionality may be specialized, it does have uses.  

Calle Erlandsson [wrote an article](http://www.calleerlandsson.com/2015/02/16/flags-bitmasks-and-unix-file-system-permissions-in-ruby/) showing how bitwise operators are useful when dealing with file system permissions.  Additionally, [this Stack Overflow post](http://stackoverflow.com/questions/2096916/real-world-use-cases-of-bitwise-operators) shows several real-world uses for bitwise operators. 

**Credits**

I owe a deep debt of gratitude to Calle Erlandsson’s article, [Ruby’s Bitwise Operators](http://www.calleerlandsson.com/2014/02/06/rubys-bitwise-operators/).  The content in this article has its foundation in the understanding that I got from his explanations.  
