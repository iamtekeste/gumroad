# Intro

This library (gumroadDev.js) is my attempt to recreate [Gumroad's](https://gumroad.com/widgets) embeddable & overlay widgets.

# Demo

#### [Click here to see the library in action](https://gumroad.now.sh/)

# Usage

You can use the library exactly the same way you would the Gumroad's widget.
You can copy the following code snippet and paste it onto your webpage.

```html
<a
  class="gumroad-button"
  href="https://gum.co/cssscan"
  target="_blank"
  data-display-style="embed"
>
  Buy my product
</a>
<script src="https://gumroad.now.sh/gumroadDev.js" />
```

The attribute `data-display-style` on the `anchor` tag dictates whether the widget will get embedded or it would show up as overlay after a user clicks on the purchase button. By default it will be an overlay.

To make it easy to generate this type of code sinppet I have built a tiny web app that does that for you! Just give it the link to the Gumroad product page it will take from there.
[Click here & Check it out!](https://gumroad-generator.now.sh/)

# Features

- You can have multiple products on a single page.
- You can have both embedded & overlay type widgets on the same page.
- If it doesn't find a valid link to a Gumroad product page then it alert's the user about it and gives direction on how to fix it.

# Requirements

This library assumes the browser supports most popular ES6 features such as `arrow functions`, `const`, `let` & `destructuring`. If we needed to support browser that don't have these ES6 features we would have to transpile the code to ES5, or even just rewrite it from scratch since it is a small library.
