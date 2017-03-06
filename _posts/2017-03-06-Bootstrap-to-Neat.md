---
layout: post
Title: Migrating from Boostrap-Sass v3.3.5 to Neat 2.0.0
Description: Switching from Bootstrap to Neat for my grid system was easier than I expected.  Here's what I learned. 
Date: 2017-03-06 16:34:00
---

A long time ago, I opened an [issue](https://github.com/jonathanpike/jonathanpike.github.io/issues/2) that simply said: 

> SCSS features aren't being used effectively. Needs refactoring.

When I first started making my theme, I decided to use [Bootstrap](http://getbootstrap.com/) to speed up development. Bootstrap is a wonderful framework, making websites look great right out of the box.  Since it's so full featured, it also included a lot of elements that I would never use for this site.  Why not explore some of Sass' interesting features and remove what I didn't need.  

I first took a baseline of how much code Bootstrap contributed: 

```sh
$ cloc jonathanpike.github.io/
     137 text files.
     137 unique files.
      79 files ignored.

http://cloc.sourceforge.net v 1.60  T=0.94 s (101.9 files/s, 9558.7 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
SASS                            82           1245           1603           5822
HTML                             9             34              3            179
Javascript                       3              7              3             39
XML                              1              0              0             30
YAML                             1              6              7             26
-------------------------------------------------------------------------------
SUM:                            96           1292           1616           6096
-------------------------------------------------------------------------------
```
A whopping **5822** lines of Sass!  Some of that was my own code, but the vast majority was from Bootstrap.

I decided to do the obvious thing and search *"lightweight grid framework"* on Google, and I found [Neat](http://neat.bourbon.io/) by Thoughtbot.  Neat uses Sass mixins instead of concrete classes, like Bootstrap.  This would be a great opportunity to learn more about Sass' mixin system.  This also turned out to be the biggest learning curve.  

**The Container** 

The starting point for both Bootstrap and Neat is the grid container.  Bootstrap defines it through a class, either `.container` for fixed-width grids or `.container-fluid` for full-width grids. All of the options for the container are taken care of for you with either of those classes.  With Neat, I had to define my own container class (called `.container`, which I carried over from Bootstrap) and then mix in Neats `grid-container`: 

```sass
.container {
  @include grid-container;

  @media only screen and (min-width: 768px) {
    max-width: 750px;
  }

  @media only screen and (min-width: 992px) {
    max-width: 970px;
  }

  @media only screen and (min-width: 1200px) {
    max-width: 1170px;
  }

  margin-left: auto;
  margin-right: auto;
}
```

`grid-container` is super simple.  It adds the following to my `.container::after` class: 

```sass 
  clear: both;
  content: "";
  display: block;
```

I also added a few extra rules to keep the container in the centre of the page and make it not fill up the full width of the screen at different screen sizes.  

**The Columns** 

Bootstrap has several different classes for columns.  I was using `col-xs-[x]` and `col-md-[x]` to define columns for desktop and mobile.  My main content container (the one you're reading in right now), for example, used `col-xs-12 col-md-8` to make it span 8 of 12 columns on desktop and 12 of 12 columns on mobile.  

Neat, out of the box, doesn't provide you with different sized columns defined by breakpoints for mobile, desktop, etc.  Instead, it provides you the tools to make those decisions for yourself.  This was the hardest part, for me, when I switched from Bootstrap to Neat.  

Neat's default grid is defined as follows: 

```sass
$neat-grid: (
  columns: 12,
  gutter: 20px,
);
```

I played around with it a little, and found that these settings were fine for my site.  Neat provides the `grid-media` mixin function that allows you to define a custom Neat grid and use that to create a media query for different sized screens.  At first, I thought that I would use the default `$neat-grid` for desktop and define a custom `$mobile-neat-grid` for my mobile needs.  That ended up not working as I expected, although I realized later that my mistake was the order my media queries were in: media queries need to be ordered from smallest to biggest, but I was ordering from biggest to smallest. What I ended up doing was exactly the opposite.  I defined a `$large-neat-grid` as follows: 

```sass
$large-neat-grid: (
  media: 1000px,
);
```

This just provided a media query breakpoint of 1000px, and didn't change any of the default settings on `$neat-grid`.  Next, wherever I used the Neat `grid-column` mixin, I also used `grid-media` to provide the media query for desktop.  Using the example of my main content container: 

```sass 
.contentbox {
  @include grid-column(12);

  @include grid-media($large-neat-grid){
    @include grid-column(8);
  }

  margin-bottom: 20px;
  padding: 0px 30px 0px 30px;
  @media only screen and (max-width: 500px) {
    padding: 0px;
  }
}
```

`grid-media` wraps the `grid-column` styles in a media query defined by the rules set for the custom `$large-neat-grid` that I defined earlier.  Easy and clear.  The transition was made even easier because I had already defined classes on all of my main container elements, so I just had to add the Neat mixins to each of these to replicate the layout I had made with Bootstrap. 

**Other Styles**

One thing I didn't realize was how much Bootstrap defined things like font styles and spacing within divs.  When I removed it, the whole layout looked really weird.  After the initial shock, I got to work defining just the styles I needed to make the site look the way I wanted.  This was more work, involved more trial and error, but left me with a result that is much leaner and meaner.  

**Results**

```sh
$ cloc jonathanpike.github.io/
      87 text files.
      87 unique files.
      79 files ignored.

http://cloc.sourceforge.net v 1.60  T=0.79 s (58.1 files/s, 2393.9 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
SASS                            32            181            541            842
HTML                             9             33              3            179
Javascript                       3              7              3             39
XML                              1              0              0             30
YAML                             1              6              7             26
-------------------------------------------------------------------------------
SUM:                            46            227            554           1116
-------------------------------------------------------------------------------
```

From 5822 lines to 842 lines -- an **85%** decrease!  

**Conclusions**

Neat provides a, *ahem*, neat way of creating a grid based layout with Sass mixins.  I enjoyed learning how to use the library and cleaning up my Sass codebase to use more Sass features, such as variables. Neat just had a major upgrade, which dramatically simplified the API.  Read all about the changes [here](https://robots.thoughtbot.com/building-the-future-of-floated-css-grids). 
