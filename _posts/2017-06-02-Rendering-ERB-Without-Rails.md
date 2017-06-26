---
layout: post
title: Rendering ERB Templates Without Rails
description: ERB is a powerful and simple templating language that's built right into Ruby. Let's go off the Rails to see how it can be used.
date: 2017-06-26 13:42:40 
---

When creating HTML templates with Rails, my go-to templating language is the default: ERB.  It's an incredibly powerful yet simple way of creating dynamic documents and it's built right in to Ruby.  What's not to like?  Until recently, I had never used ERB templates outside of Rails.  Here are a few things I learned:

**First things first**

Getting started with ERB is easy.  Just initialize a new `ERB` object with a string template, and then call `#result` on the `ERB` object, like so:

```ruby
template = "Hello, today is <%= Time.now.strftime('%A') %>"
ERB.new(template).result
# => "Hello, today is Sunday"
```

**Templates are just strings**

Chances are you don't want to have to define an ERB template in the same file as you render the result.  That was my main hangup: how was `ERB` going to get my template file?  Then, I learned about the `File` library and something clicked: "I'm working with strings!"  The example changes to something like this: 

```erb
# template.erb

Hello, today is <%= Time.now.strftime('%A') %>
```
```ruby
# renderer.rb

template = File.open('template.erb', 'rb', &:read)
ERB.new(template).result
# => "Hello, today is Sunday"
```

**Binding** 

Now that we can read a template from a file, what about being able to call variables and methods from my template?  In Rails, I would define my variables in the Controller and methods in Helpers, but I'm not using Rails.  Then I learned about [`Binding`](https://ruby-doc.org/core-2.4.0/Binding.html), which is the way to pass the "execution context" of some code around. Execution context is just a fancy way of saying variables and methods.  Any variables and methods defined in the class that you call `#binding` on, as well as any methods defined in any included module, get passed to ERB, ready to use.  

```erb
# template.erb

Hello <%= name %>, today is <%= Time.now.strftime('%A') %>.

<%= benediction %>
```
```ruby
# renderer.rb

class Renderer 
  attr_reader :template, :name

  def initialize
    @template = File.open('template.erb', 'rb', &:read)
    @name = "Jonathan"
  end

  def benediction
    Time.now.hour >= 12 ? "Have a wonderful afternoon!" : "Have a wonderful morning!"
  end

  def render
    ERB.new(template).result(binding)
  end
end

Renderer.new.render 
# => "Hello Jonathan, today is Sunday.\n\nHave a wonderful afternoon!"
```

The `Renderer` class above works, but it isn't ideal.  It doesn't conform to the [*Single Responsibility Principal*](https://en.wikipedia.org/wiki/Single_responsibility_principle), putting both rendering the template and providing the execution context.  Let's refactor to fix this: 

```ruby
# view.rb
def View
  attr_reader :name

  def initialize
    @name = "Jonathan"
  end

  def benediction
    Time.now.hour >= 12 ? "Have a wonderful afternoon!" : "Have a wonderful morning!"
  end

  def get_binding
    binding
  end

  def build
    Renderer.new(self)
  end
end

# renderer.rb
class Renderer 
  attr_reader :template, :binding_klass

  def initialize(binding_klass)
    @template = File.open('template.erb', 'rb', &:read)
    @binding_klass = binding_klass
  end

  def render
    ERB.new(template).result(binding_klass.get_binding)
  end
end
```

Since the execution context that the template needs is now outside of `Renderer`, I have to pass in `self` to `Renderer` from `View`.  In `View`, you'll see that I also defined a method called `get_binding` which just returns the `binding`.  Why couldn't I just call binding directly on the instance of `View` I passed in?  Let's try it: 

```ruby
def render
  ERB.new(template).result(binding_klass.binding)
end

Renderer.new.render
# => NoMethodError: private method `binding' called
```

So, `binding` is private, but we can access it through a method like `get_binding`. 

**Encoding**

Finally, let's spice up this template with an emoji. Emoji, after all, are just Unicode code points.  Lets see: 

```erb
# template.erb

Hello <%= name %> 😬, today is <%= Time.now.strftime('%A') %>.
```
```ruby
Renderer.new.render
# =>  incompatible character encodings: ASCII-8BIT and UTF-8
```

That's not what I expected!  I eventually figured out that I needed to change the way that I was opening my template file to include an encoding: 

```ruby 
File.open("template-file-path", 'rb', encoding: 'utf-8', &:read)
```

Opening the template as a utf-8 file makes everything run perfectly. 

**Rendering ERB for Fun and Profit**

Rendering ERB templates without Rails is a little daunting at first.  Once you get the hang of it, it's as powerful and simple as ERB itself.  

If you want to read more about ERB without Rails, I highly recommend [this article by Stuart Ellis](http://www.stuartellis.name/articles/erb/).
