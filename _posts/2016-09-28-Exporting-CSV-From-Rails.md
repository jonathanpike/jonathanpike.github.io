---
layout: post
title: Exporting CSV From Rails In Multiple Formats
description: It's easy to support multiple CSV export formats with Rails.  This tutorial shows you how. 
date: 2016-09-28 12:30:26
---

Exporting data from Rails to be used in different applications can be a tricky topic.  What format do you need to export to?  What if one export needs some data and another export needs other data?  I had to solve exactly this problem with CSV.  Ruby has an excellent [CSV Library](http://ruby-doc.org/stdlib-2.3.0/libdoc/csv/rdoc/CSV.html) that is ripe for use with Rails.  From my research, there are 2 basic ways of exporting CSV data from a Rails application that I have come across so far:  [calling `to_csv` on a model object in the Controller](https://www.lockyy.com/posts/rails-4/exporting-csv-files-in-rails) and [generating CSV directly in the view](http://nithinbekal.com/posts/rails-csv-export/). 

Calling `to_csv` is a great option if you only ever need the CSV data in one format.  My problem was more complex:  I needed to allow the user to choose what format the CSV data was exported in, and then provide it in that format.  To solve this problem, I chose to render the CSV in the view.  Here's how I did it: 

**The Controller**

Rails controller actions respond to HTML by default.  Luckly, setting up your controller to respond to CSV is really easy using [`ActionController::MimeResponds#respond_to`](http://api.rubyonrails.org/classes/ActionController/MimeResponds.html#method-i-respond_to), as follows: 

```ruby
def index
	# Standard model queries here...
	
	@template = params[:template]
	
	respond_to do |format|
		format.html
		format.csv { render template: "path/to/#{@template}" }
	end 
end 
``` 

The most important portion of the `index` action is the `@template` variable.  When the user chooses what format they would like the CSV exported as, the download link provides a param that tells the controller what  CSV template to render.   

**Bonus Tip:** Optionally, you can also set the `Content-Disposition` header to make the CSV file download automatically and set a file name, like so: 

```ruby
format.csv do 
	headers['Content-Disposition'] = "attachment;filename=Your-File-Name-Here.csv"
	render template: "path/to/#{@template}"
end 
```

**The View**

Here's where Ruby's CSV Library comes in handy.  Create as many CSV templates (in `csv.erb` format, so you can embed Ruby directly in the template) as you need and save them wherever it makes sense.  They will each look something like this (obviously, with variation in the data displayed): 

```ruby
<% export = CSV.generate(" ", { headers: ["Array", "Of", "Headers"], write_headers: true, encoding: "UTF-8}) do |csv| %> 
	<% csv.add_row data %> 
<% end %>
<%= export.lstrip.html_safe %> 
```

Let me explain what's going on: 

1. The `export` variable is set to [`CSV.generate`](http://ruby-doc.org/stdlib-2.3.0/libdoc/csv/rdoc/CSV.html#method-c-generate).  This is the method that will be generating the actual CSV string that the user has requested. 
2. `CSV.generate` takes 2 arguments: a string and a hash of options.  I've passed a blank string and provided `headers`, `write_headers`, and `encoding` as options. `headers` is the content of the top row of your CSV file, and can be either an array of strings or a string separated by commas.  `write_headers` specifies that the headers should be added to the CSV output (optional -- `false` by default).  `encoding` allows you to specify an encoding for the file (also optional -- I've chosen UTF-8). 
3. `CSV.generate` takes a block, in which you pass in the rows you actually want to add to the output.  You can iterate over your data however you normally would in a view file in this block, and then pass the result to `csv.add_row`.  
4. I explicitly have not printed anything in the view file until the last line.  If the last line was left out, the CSV download would be a blank file.  This is optional (you can alternatively remove the `export` variable and call `CSV.generate` in `<%= %>` tags).  I did it this way because:   

- My own CSV exports required that no blank lines be present in the export.  I am calling `lstrip` because I found that a `0A` (`LF`) character was being prepended to my CSV string, inexplicably.  
- I am calling `html_safe` to avoid HTML escaping in the output.  This should only be done if your data is known safe.  

**The Link**

Now, when your user is given the option to select a CSV download, you can provide options that will provide the name of your CSV template to your controller.  I implemented this by using a [`select_tag`](http://api.rubyonrails.org/classes/ActionView/Helpers/FormTagHelper.html#method-i-select_tag) together with [`options_for_select`](http://api.rubyonrails.org/classes/ActionView/Helpers/FormOptionsHelper.html#method-i-options_for_select) that gathered the options from a Hash I provided.  You can use whatever method provides the correct param to your controller.  

In just a few lines of code, Ruby and Rails provide everything needed to create a very flexible CSV exporting system. Hope this helps with your CSV exporting needs!
