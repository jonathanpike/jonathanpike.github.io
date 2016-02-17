---
layout: post
title:  "Diving into jQuery-UJS"
date:   2016-02-17 10:11:06
---

[Last week](http://jonathanpike.net/2016/02/Ajax-on-Rails), I gave a quick demonstration of how easy Ajax is with Rails.  Knowing to include `remote: true` when using certain Rails helpers is only the first step.  In an effort to dispel the "magical" reputation that Rails has, I'm going to take a dive into [jQuery-UJS](https://github.com/rails/jquery-ujs) to show exactly how Rails makes Ajax so easy.  

**What is Unobtrusive JavaScript, Anyways?**

First, a note about the name.  UJS in jQuery-UJS stands for "unobtrusive JavaScript", which the [Rails Guide](http://edgeguides.rubyonrails.org/working_with_javascript_in_rails.html) tells me is generally regarded as a best practice for writing JavaScript.  Consider the following example[^1]: 

```html
<a href="#" onclick="this.style.backgroundColor='#990000'">Paint it red</a>
```

The background will change to red when the link is clicked, which is exactly what I want.  If I wanted to have another link do the same thing, however, I would have to copy the same inline JavaScript, which quickly would untenable to maintain and not DRY.  

Unobtrusive JavaScript has 2 main principals: 

1. Separate JavaScript from HTML 
2. Keep JavaScript DRY by passing information from HTML using data-* attributes. 

Here's the same code as above, made unobtrusive: 
 
```coffeescript
@paintIt = (element, backgroundColor) ->
  element.style.backgroundColor = backgroundColor
 
$ ->
  $("a[data-background-color]").click (e) ->
    e.preventDefault()
 
    backgroundColor = $(this).data("background-color")
    paintIt(this, backgroundColor)
```

```html
<a href="#" data-background-color="#990000">Paint it red</a>
<a href="#" data-background-color="#009900">Paint it green</a>
<a href="#" data-background-color="#000099">Paint it blue</a>
```

The JavaScript and HTML are separated, which makes both easier to maintain and change.  And with data-* elements, the background color attributes can be passed from the HTML to the JavaScript, allowing a single JavaScript function to change the background colour of any link to any colour the heart desires. And if I want to change the colour in the future, I simply change it in a single place. 

**jQuery-UJS and rails.js**

jQuery-UJS is an "unobtrusive scripting adapter for jQuery" that provides the following features: 

- force confirmation dialogs for various actions;
- make non-GET requests from hyperlinks;
- make forms or hyperlinks submit data asynchronously with Ajax;
- have submit buttons become automatically disabled on form submit to prevent double-clicking.

The file that actually does all this is called [rails.js](https://github.com/rails/jquery-ujs/blob/master/src/rails.js).  I've included snippets of code below, but please check out rails.js for yourself to explore deeper. 

**Confusing Elements in rails.js**

As I was researching and writing this, I had to learn some interesting things about JavaScript and jQuery to understand what rails.js is doing. 

Rails.js starts by creating the `$.rails` object.  You'll note it's defined like `$.rails = rails = { ... };`.  This was a source of some confusion for me.  After testing a similar declaration out in the console, I figured that the double declaration allows both `$.rails` and `rails` to be used to reference the functions inside of the object.  I'm not sure why both are needed.  

You will also see some events with `.rails` appended, like on this line defining what happens if the element is a form *(marked with arrows)*: 

```javascript
$document.delegate(rails.formSubmitSelector, -> 'submit.rails' <-, function(e)
```

Where is the `submit.rails` event defined?  As it turns out, there is no difference between the regular `submit` event and the `submit.rails` event, except that `submit.rails` is namespaced.  As such, it can be unbound without unbinding the `submit` event.  Handy! 

**The `$.rails` object**

The `$.rails` object defines all of the functions that the [event bindings below](#bindings) will use to work their Ajax magic.  Since the `$.rails` object spans 344 lines, I'm not going to reproduce the whole thing here.  Instead, I'll point out a few functions that help explain how a form is submitted by simply specifying `remote: true`. 

<a name="isRemote"></a>
*isRemote:*

Starting with `remote: true` (which is processed into `data-remote="true"`), isRemote allows rails.js to check if the `data-remote` attribute is set: 

```javascript
isRemote: function(element) {
  return element.data('remote') !== undefined && element.data('remote') !== false;
}
```

If the `data-remote` attribute is not undefined and not false, this function returns `true`. 

<a name="fire"></a>
*fire:*

The fire function checks if there is an event handler that changes the default behaviour of any of the [custom events](https://github.com/rails/jquery-ujs/wiki/ajax) that rails.js sets up.  

```javascript
fire: function(obj, name, data) {
  var event = $.Event(name);
  obj.trigger(event, data);
  return event.result !== false;
}
```
 
This function takes an object, a name of an event, and some data, and tests to see if the event works.  Here's how it works: 

1. `$.Event(name)` creates a new [Event Object](https://api.jquery.com/category/events/event-object/).  
2. [`.trigger()`](http://api.jquery.com/trigger/) calls the new Event Object on the object (in this case, the form element).  Interestingly, `.trigger()` will pass on the extra parameters to the event handler, just as if the user naturally triggered the event, which makes it useful with custom Event Objects.  
3. If the result of the event being triggered is true, the function returns true. 

<a name="ajax"></a>
*ajax:*

The function that actually handles the Ajax request is incredibly simple: 

```javascript
ajax: function(options) {
  return $.ajax(options);
}
```

It simply returns [`jQuery.ajax`](https://api.jquery.com/jQuery.ajax/) with an options object that will be defined in [handleRemote](#handleRemote). 

<a name="handleRemote"></a>
*handleRemote:*

If `data-remote` is true, how does the data actually get submitted?  The handleRemote function, well, handles it[^2]!

```javascript
handleRemote: function(element) {
  var method, url, data, withCredentials, dataType, options;

  if (rails.fire(element, 'ajax:before')) {
    withCredentials = element.data('with-credentials') || null;
    dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

    if (element.is('form')) {
      method = element.data('ujs:submit-button-formmethod') || element.attr('method');
      url = element.data('ujs:submit-button-formaction') || element.attr('action');
      data = $(element[0].elements).serializeArray();
      // memoized value from clicked submit button
      var button = element.data('ujs:submit-button');
      if (button) {
        data.push(button);
        element.data('ujs:submit-button', null);
      }
      element.data('ujs:submit-button-formmethod', null);
      element.data('ujs:submit-button-formaction', null);
    } 

  ...
        
    options = {
      type: method || 'GET', data: data, dataType: dataType,
      // stopping the "ajax:beforeSend" event will cancel the ajax request
      beforeSend: function(xhr, settings) {
        if (settings.dataType === undefined) {
          xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
        }
        if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
          element.trigger('ajax:send', xhr);
        } else {
          return false;
        }
      },
      success: function(data, status, xhr) {
        element.trigger('ajax:success', [data, status, xhr]);
      },
        complete: function(xhr, status) {
        element.trigger('ajax:complete', [xhr, status]);
      },
        error: function(xhr, status, error) {
        element.trigger('ajax:error', [xhr, status, error]);
      },
        crossDomain: rails.isCrossDomain(url)
      };

    // Only pass url to `ajax` options if not blank
    if (url) { options.url = url; }

    return rails.ajax(options);
  } else {
    return false;
  }
},
```

A rundown of the most important parts of this function: 

1. handleRemote first checks to make sure you haven't disabled ajax by seeing if [`rails.fire`](#fire) returns true when the `ajax:before` event is triggered.  This allows you to stop the whole process, should you so choose.  
2. handleRemote then collects data that it will need to actually perform that ajax request.  It checks for a `method` (ie. HTTP verb) and `URL` to submit to using [`.data()`](https://api.jquery.com/data/#data2), which reads the specified data attributes from the element.  If they aren't present, it defaults to the `method` and `action` attributes on the element, respectively. 
3. Next, it build up a `options` object to pass over to the Ajax function with a variety of standard Ajax options that immediately trigger custom Events (for your own event handlers to deal with). 
4. Finally, the options object is passed onto [`rails.ajax`](#ajax) to actually perform the Ajax request.  

<a name="bindings"></a>
**Event Binding**

The rest of rails.js deals with event binding for the various events that it helps with.  The binding that concerns forms is as follows: 

```javascript
$document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
  var form = $(this),
    remote = rails.isRemote(form),
    blankRequiredInputs,
    nonBlankFileInputs;

  if (!rails.allowAction(form)) return rails.stopEverything(e);

  // Skip other logic when required values are missing or file upload is present
  if (form.attr('novalidate') === undefined) {
    if (form.data('ujs:formnovalidate-button') === undefined) {
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
      if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }
    } else {
      // Clear the formnovalidate in case the next button click is not on a formnovalidate button
      // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
      form.data('ujs:formnovalidate-button', undefined);
    }
  }

  if (remote) {
    nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
    if (nonBlankFileInputs) {
      // Slight timeout so that the submit button gets properly serialized
      // (make it easy for event handler to serialize form without disabled values)
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
      var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

      // Re-enable form elements if event bindings return false (canceling normal form submission)
      if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

      return aborted;
    }

    rails.handleRemote(form);
    return false;

  } else {
    // Slight timeout so that the submit button gets properly serialized
    setTimeout(function(){ rails.disableFormElements(form); }, 13);
  }
});
```

On form submit, this event handler is called. Here's a rundown of what it does: 

1. It checks the `data-confirm` attribute (with the `rails.allowAction` function, which will return true if no function stops it) to see if the action needs to be confirmed prior to proceeding. 
2. Next, it checks for a `novalidate` attribute, which indicates that the form is not validated upon submit.  If `novalidate` is not present, it will check for blank inputs (with the `rails.blankInputs` function).  If there are blank inputs, it will stop submission of the form. 
3. Then it checks if [`isRemote`](#isRemote) is true. If so, it will check if there is a file input that has content in it.  This will allow you to implement a custom Ajax file upload method. 
4. Finally, it uses [`handleRemote`](#handleRemote) to deal with the form submission, and returns false to cancel regular submission. 

**Conclusion** 

jQuery-UJS clearly does a lot in 534 lines.  But it's not magic!  The next time you're able to just write `remote: true` to submit a form via Ajax, remember that rails.js is saving you a lot of time by being awesome. 

<hr />

[^1]: All examples in this section taken from [this Rails Guide](http://edgeguides.rubyonrails.org/working_with_javascript_in_rails.html).

[^2]: I have excerpted this function (marked with `...`) to just show how it works with forms, for the sake of brevity. 