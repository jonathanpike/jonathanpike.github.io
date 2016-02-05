---
layout: post
title:  "ActiveSupport::TestCase vs. Minitest: Explaining the Differences"
date:   2016-02-03 10:57:14
permalink: /2016/02/03/ActiveSupport-vs-Minitest.html
---

[Testing is important](http://jonathanpike.net/2016/01/12/Beginners-Guide-to-TDD.html), no matter what framework or methodology you use.  Once that is internalized, you need to make some practical decisions, such as _"What testing framework do I learn?"_ I learned how to test my Rails apps using [Minitest](https://github.com/seattlerb/minitest) because it's the Rails default. I continue using it because Minitest syntax is just Ruby instead of a complicated DSL, but that's another story. If you've ever used Rails' implementation of Minitest, you'll be familiar with tests looking like this: 

```ruby
test "the truth" do
  assert true
end
```

Since I've started writing [scripts with Ruby](http://jonathanpike.net/2015/12/20/Scripting-in-Ruby.html), I've used Minitest to provide test coverage.  Since Minitest isn't baked into Ruby like it is in Rails, you have to add install the gem and `require` it in your test files.  Imagine my surprise when, looking at the [documentation for Minitest](http://docs.seattlerb.org/minitest/), I saw syntax that looked like this: 

```ruby
def test_the_truth
    assert true
end
```

While it isn't incredibly different, it's different enough that it raised some questions.  Why was Rails' Minitest syntax different from standard Minitest syntax? 

Until yesterday, that question remained unanswered. Even the [Rails guide](http://guides.rubyonrails.org/testing.html) didn't seem to mention anything.  Puzzling over this difference, I found a link to the [Rails edge guide for testing](http://edgeguides.rubyonrails.org/testing.html), which must have recently been updated. [Section 2.3](http://edgeguides.rubyonrails.org/testing.html#rails-meets-minitest) opened my eyes, which reads: 

> Any method defined within a class inherited from `Minitest::Test` (which is the superclass of `ActiveSupport::TestCase`) that begins with test_ (case sensitive) is simply called a test. So, methods defined as test_password and test_valid_password are legal test names and are run automatically when the test case is run.

>Rails also adds a test method that takes a test name and a block. It generates a normal `Minitest::Unit` test with method names prefixed with test_.

So, `ActiveSupport::Testcase` adds functionality to `Minitest`, which includes this new syntax.  Determined to figure out what was going on under the hood, I went spelunking in Rails' source code.  Looking through the `ActiveSupport` directory, I found the [following file](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/testing/declarative.rb): 

```ruby

module ActiveSupport
  module Testing
    module Declarative
      unless defined?(Spec)
        # Helper to define a test method using a String. Under the hood, it replaces
        # spaces with underscores and defines the test method.
        #
        #   test "verify something" do
        #     ...
        #   end
        def test(name, &block)
          test_name = "test_#{name.gsub(/\s+/,'_')}".to_sym
          defined = method_defined? test_name
          raise "#{test_name} is already defined in #{self}" if defined
          if block_given?
            define_method(test_name, &block)
          else
            define_method(test_name) do
              flunk "No implementation provided for #{name}"
            end
          end
        end
      end
    end
  end
end
```

This one little method in this one little module is responsible for the slight syntax change.  It uses Ruby's awesome metaprogramming abilities to transform the Rails Minitest syntax into the standard Minitest syntax.  If you read that method and are scratching your head, let me go through it line by line using the following test as an example: 

```ruby
test "the truth" do
  assert true
end
```

1. This test actually uses the `test` method defined in `ActiveSupport::Testing::Declarative`.  The `name` argument is `"the truth"` and the block (ie. the  code between `do` and `end`) is `assert true`. 
2. `test_name = test_#{name.gsub(/\s+/,'_')}".to_sym` transforms the name argument into the appropriate Minitest syntax.  It prepends the name you provide with `test_`, then uses `gsub` to replace the spaces with underscores.  Finally `.to_sym` returns the symbol corresponding to the object (which is important later), resulting in  `:test_the_truth`. 
3.  `defined = method_defined? test_name` checks to see whether the name of the test you've written has already been used elsewhere. If so, an exception is raised.
4. `if block_given?` evaluates if you've provided a block. In this case, we have. Here's where the metaprogramming magic really happens -- `define_method` is called with the test name (as a symbol) and the block.  `define_method` takes a symbol for the name of the method (hence, why the name you provide is transformed into a symbol) and a block, which then becomes the body of the method.  Using `define_method`, the above sample method is transformed into the standard Minitest syntax: 

```ruby
def test_the_truth
    assert true
end
```

A couple of lessons learned: 

1. Metaprogramming is **really cool**.  Ruby made it really easy for the Rails team to slightly simplify the Minitest syntax all through using the standard library.  I need to learn more about Metaprogramming. 
2. When I don't know how something works, it's not nearly as hard as I imagined to figure it out.  Rails is incredibly well organized, and it only took me a couple of minutes of looking around to find the `Declarative` module.  Actually understanding it took a little more research, but it was also very doable. Don't be scared to dive into the source of something you don't quite understand! 