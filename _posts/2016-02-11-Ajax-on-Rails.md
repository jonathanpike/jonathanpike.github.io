---
layout: post
title:  "Ajax on Rails"
date:   2016-02-11 01:54:30
---

I built a [small To Do application](wc-todo.herokuapp.com) with Rails over the weekend with the goal of making it a single page application, using Ajax to handle all data updates and form submissions.  A simple To Do app shouldn't have multiple pages just to add or modify an item!

Having used [Ajax with jQuery](http://api.jquery.com/jquery.ajax/) before, I had some familiarity with sending a request to the server using Ajax.  When I ran into trouble, I looked to Stack Overflow, which provided advice in how to [stop the normal submit method](http://stackoverflow.com/questions/6723334/submit-form-in-rails-3-in-an-ajax-way-with-jquery).  After some further research, I found that while I could write the code to handle the Ajax request myself, I didn't need to.

Since Rails 3, Rails includes built in [Ajax helpers](http://guides.rubyonrails.org/working_with_javascript_in_rails.html#built-in-helpers) to handle form submissions and links, among other things.  For my app, I had a form and checkboxes to submit via Ajax.  As an example, all I had to do for the form was this: 

```ruby 
<%= form_for(:todo, remote: true, url: '/todos', html: { class: 'my-form' }) do |f| %>
```

The key element in my `form_for` is `remote: true`.  When the ERB is processed into HTML,  `remote: true` becomes `data-remote: "true"`, an [HTML5 Global data-* attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-%2A).  [Rails.js](https://github.com/rails/jquery-ujs/blob/master/src/rails.js), the JavaScript portion of Rails' Ajax helpers in [jQuery-UJS](https://github.com/rails/jquery-ujs), will find the `data-remote` element, which tells it to submit my form via Ajax instead of the browser's normal submit method. So simple! 

Equally simple were the checkboxes: 

```ruby
<%= check_box_tag("completed", todo.id, todo.completed,
                               data: {
                                remote: true,
                                url: url_for(action: 'update', id: todo.id),
                                method: 'PUT'}) %>
```

One thing to keep in mind: rails.js **does not** process the Ajax response from the server.  It provides callback events that allow you to write code to deal with the response, but that's up to you. 

Next week, I hope to dive further into jQuery-UJS to show what is actually happening under the hood to make this magic happen. Until then, I hope you have fun submitting your forms asynchronously! 