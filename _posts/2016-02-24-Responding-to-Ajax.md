---
layout: post
title:  "Responding to Ajax with Rails"
date:   2016-02-24 10:37:57
---

After showing [how easy it is to use Ajax with Rails](https://jonathanpike.net/2016/02/Ajax-on-Rails) and [how Rails makes Ajax easy behind the scenes](https://jonathanpike.net/2016/02/Diving-into-jQuery-UJS), the one thing left to explore is what Rails doesn't do for you: responding to the Ajax request.  

When I last showed my [To Do app](http://wc-todo.herokuapp.com/), I skipped responding to the Ajax request from the server using a trick: 

```javascript
$(".my-form, #completed, .delete, .all-complete, .clear").on("ajax:success", function(e, data, status, xhr) {
      location.reload();
});
```

Using the `ajax:success` callback, I reloaded the window to show the changes that were made by the Ajax request.  This required a reload for every action, which isn't efficient.  This week, I went back to my application  and figured out how to properly have Rails respond to the Ajax request without a page reload.  This required changes to the Controller and the View.

**The Controller** 

The Controller is responsible for receiving requests from the user and updating the model and view appropriately.  Since Ajax is making the request via JavaScript, the Controller needs to be able to respond back with JavaScript.  Here are the changes that I needed to make to my Controller to allow it to do just that, followed by an explanation of what's happening: 

```ruby
class TodosController < ApplicationController
  respond_to :js, :html, :json
  before_action :find_all

  ...

  def create
    @todo = Todo.new(todo_params)
    flash[:alert] = "Something went wrong. Please try again." unless @todo.save
    respond_with @todo
  end

  ...

  private

  def todo_params
    params.require(:todo).permit(:title, :session_user_id)
  end

  ...

  def find_all
    @todos = Todo.where(session_user_id: session_user).order(created_at: :asc)
  end
end
```

A few things to note: 

1. In line 2, I've specified that the Controller can `respond_to` HTML (a regular request), JavaScript, and JSON.  Setting `respond_to` at the top of the Controller allows every action in the Controller to respond to those types of requests. 
2. I also have a `before_action` for the `find_all` method (defined at the bottom of the controller), which is a helper method to load all of the current user's To Dos from the database for each action.  You'll see why this is important later. 
3. I am using `respond_with` in the `create` action, which isn't a standard Rails method (anymore).  Since Rails 4.2, the [responders gem](https://github.com/plataformatec/responders) has to be included in order to get this functionality.  `respond_with` does 2 things:  1) it allows Rails to choose the type of response to send back automatically given the request, and 2) it is a convenient short form including the the following code in every action that needs to respond to something other than a normal request: 

```ruby
respond_to do |format|
  format.html { redirect_to root_path}
  format.js
end
```

Now that Rails knows how respond to JavaScript, we have to actually write the JavaScript to respond with.  

**The View** 

Rails expects a file in the views directory with the same name as the controller action and the same extension as the type of response.  To respond to the `create` action with JavaScript, we need to make `create.js.erb`:

```javascript
$('.todos').html("<%= j render partial: 'todos' %>")

<% flash.each do |type, message| %>
  $("#flash-messages").append("<%= j content_tag :p, message.html_safe, class: "flash text-center" %>").delay(3000).fadeOut("slow");
<% end %>
```

Let me explain what is happening: 

1. If the Ajax request is successful, the controller responds with this file, which will re-render the [todos partial](https://github.com/jonathanpike/wc-todo/blob/master/app/views/todos/_todos.html.erb).  This is why I needed to have the `before_action` in the controller load all of my todos from the database. The `j` method is an alias for [`escape_javascript`](http://api.rubyonrails.org/classes/ActionView/Helpers/JavaScriptHelper.html#method-i-j), which performs [2 important functions when responding with JavaScript](http://stackoverflow.com/a/1623813/5639584).
2. If the Ajax request doesn't pass validation (and therefore doesn't save to the database), I've set `flash[:alert]` to have a message.  The flash block will loop through the flash hash and then put the message in a `p` tag (inside of a `div` with the ID `flash-messages`).  You'll see I've set it to `fadeOut` after 3 seconds (because the page won't get refreshed to get rid of it).  

*This is not the only way to write the response template*.  For example, you could append the individual new To Do to the to `.todo-list` `ul` instead of re-rendering the partial. 

**Putting it All Together**

Here is the chain of events that happens when a To Do is added: 

1. A user fills out the form and clicks the "Add New To Do" button.  This submits the form via Ajax (thanks `remote: true`!). 
2. The Todos Controller receives the request, and saves the To Do to the database (since it passes the validation).  It will also load all of the To Dos into the instance variable `@todos` to be accessible in the view.  Then, it responds with the `create.js.erb` view template. 
3. `create.js.erb` renders the `todos.html.erb` partial, which now includes the newly added To Do.  You now see your new To Do added to the page.  

All of this happened without the page being refreshed.  Awesome! 

**Further Reading**

Figuring out how to respond from the server wasn't intuitive to me, and involved a lot of trial and error.  Here are some of the resources I used to help me understand how this all works: 

1. [Alfa Jango - Rails 3 Remote Links and Forms: A Definitive Guide](https://www.alfajango.com/blog/rails-3-remote-links-and-forms/)
2. [Alfa Jango - Rails 3 Remote Links and Forms Part 2: Data-Type (with jQuery)](https://www.alfajango.com/blog/rails-3-remote-links-and-forms-data-type-with-jquery/)
3. [Tuts+ - Using Unobtrusive JavaScript and AJAX with Rails 3](http://code.tutsplus.com/tutorials/using-unobtrusive-javascript-and-ajax-with-rails-3--net-15243)
4. [Justin Weiss - `respond_to` Without All the Pain](http://www.justinweiss.com/articles/respond-to-without-all-the-pain/)
5. [Rails Edge Guide - Working with JavaScript in Rails](http://edgeguides.rubyonrails.org/working_with_javascript_in_rails.html)