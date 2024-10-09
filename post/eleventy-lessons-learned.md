---
title: Eleventy Lessons Learned
tags: [css, css-grid, eleventy, excerpts, featured-images, meta, netlify, webdev, wordpress]
excerpt: How I added a few features and quashed a few bugs.
bskyLink: https://bsky.app/profile/cascading.space/post/3kz2qc32vac2l
mastoLink: https://furry.engineer/@cascade/112915762365176380
reply: ''
like: ''
repost: ''
date: 2024-08-06
category: Article
featuredimage: ''
templateEngineOverride: md
---

<aside class="sidebar"><div class="flow"><p><strong>Blaugust Side Note:</strong></p><p>I decided that it would be best to take Sundays off. There won't be any intended posts on Sundays. This to allow me to observe a day of rest, and to make it easier for me to keep up.</p></div></aside>

There wasn't a new blog post yesterday, at least that the RSS feed would show. (I hope, haha 😅) This is because my update was structural stuff in the website code itself. Today I'm going through a bunch of itty bitty things I had to figure out so that I can better remember this stuff in the future, and hopefully help someone trying to debug something VERY specific.

## Excerpts and Featured Images

I wasn't using these two features before, and I wanted to be able to reach for them if I want to change my template later. The first thing is making sure I'm pulling that data from the WordPress API when the site builds. I have a file which pulls everything I need from WP: `_data/posts.js`

```js
const API_urls = ['URLs I call my WP install with - one each for posts, tags, and categories']

try {
  const APIresponse = await fetch(API_url);

  if (APIresponse.ok){
    const content = await APIresponse.json();

    // Do stuff with the WP content here, turn it into an object called 'posts'

    return posts;
  }
}
```

This is a super abbreviated version of the file, showing how you'd call an API and return the content from it, for use in Eleventy. From this point on, everything there is available anywhere in Eleventy by looking in the `posts` object. So that means that in this file, before it's available everywhere, I should rearrange the data so I'm only using what I need and make it easier to navigate. In the spot with "do stuff with the content" above, I have a loop like this running on each post returned:

```js
content.forEach(post => {  let newPost = {
    id: post.id,
    date: new Date(post.date_gmt),
    category: getList(categories, post.categories)[0]
    // ... etc etc etc
  };
  switch (newPost.category){
    case 'Article':
      posts.articles.push(newPost); break;
    case 'Note':
      posts.notes.push(newPost); break;
    // ... etc etc for each category
  }
});
```

In the first part of that code block, I'm just rearranging the data in the WP API to make it easier for me to find and use. I included `category` specifically because that enables another feature I'm adding later - post types. WP does "post types" already, but they aren't customizable, and they really only apply to themes that use that feature. And since I don't need another level of sorting more than plain tags (which I still need to implement), then categories were sitting around doing nothing, so that's what they're doing now - defining a post as a regular blog post (Article), short-form social-style post (Note), or other things (Comic, Recipe, Reply, Repost, etc). Because only one of these categories will be used at a time, This code is using `[0]` to make sure it only grabs the one item, as a string. That's way easier to work with than an array with one item in it.

Side note: Since the regular post item in the API only shows IDs for tags and categories, the `getList()` function queries the list of categories from WP, and puts in the actual tag/category names, so I don't have to remember loads of magic numbers.

The second part of the code block is sorting the posts out into different arrays based on what category/post type it is. This makes it way easier on the template side for me to say, for example, list all the articles here, and the notes there.

So I needed to adjust this code to allow for excerpts and featured images. Thankfully, these are just sitting there in the API, so two lines later, it's mostly there:

```js
let newPost = {
  ...
  excerpt: post.excerpt.rendered
  featuredImage: getMediaUrl(post.featured_media)
  ...
};
```

The rendered excerpt is already plain HTML in a string, so nothing to worry about there.

The `featured_media` part of the API points to (yet another) ID. Which means I needed to add another API url to query just for all the media. The new function there searches that query for an object that matches the ID, then returns the URL for the actual image to use.

Now those two things are available for me to use anywhere in the template! Hooray! Which leads to the next thing:

## Share Cards

I had share cards pretty much working before. These are the preview cards you see when a link is shared on social media or in a chat.

The problem was that the title was really the only thing that changed from page to page. I wanted to make it so that the image would be the featured image, if there was one, and for the description to show the relevant post excerpt. Also, Twitter (I won't call it X) is a special snowflake and demands its own tags, which I hadn't added yet.

Now that we're in the template world, I should mention that I'm using Nunjucks, which plays really nicely with Eleventy. Nunjucks lets you set variables, so I started doing that to avoid some clutter:

```html
{% if post.title %}{% set sharetitle = post.title | safe %}{% else %}{% set sharetitle = title %}{% endif %}
{% if category == 'Article' or post.category == 'Article' %}{% set sharetype = 'article' %}{% else %}{% set sharetype = 'website' %}{% endif %}
{% if post.featuredImage %}{% set shareimage = post.featuredImage %}{% else %}{% set shareimage = '/bin/img/cascade-icon.jpeg' %}{% endif %}
{% set shareurl = ['https://cascading.space', page.url] | join %}
{% if category == 'Article' or post.category == 'Article' %}
    {% if post.excerpt %}
        {% set sharedesc = post.excerpt | excerpt | safe %}
    {% else %}
        {% set sharedesc = excerpt | excerpt | safe %}
    {% endif %}{% else %}
    {% set sharedesc = 'Cascading Space is the home of Cascade, a protogen who likes experimenting with the web.' %}
{% endif %}
```

This disgusting block, believe it or not, is just setting 5 variables: `sharetitle`, `sharetype`, `shareimage`, `shareurl`, and `sharedesc`. The reason it looks so nasty is because I need to support posts from two places: WordPress, as covered, but plain Markdown ones as well. These are mostly posts I wrote before I started using WP, and didn't want to migrate them. But continuing to support them means I also have the option of doing a post in Markdown whenever I like, which might come in useful sometime in the future if I wanted to have more cool, interactive stuff happening on a post. It's worth keeping around. However, it means I need to do things like check for `title` and `post.title`, `excerpt` and `post.excerpt`, etc etc.

I have a couple ways around this if I wanted to keep the code cleaner: bite the bullet and migrate all the old posts to WP (not ideal - I do like Markdown for more complicated posts), or reformat all the data in Eleventy to match the WP data model I'm making above. For now, I'm fine keeping it ugly.

Extra notes about the code above:

- The `safe` keywords make sure no weird escaped HTML shows in the share cards.
- The `excerpt` keywords are a special filter added to strip HTML away and shorten it if it's too long. Thanks to [Stephanie Eckles](https://11ty.rocks/eleventyjs/content/) for this filter!
- Turns out, Nunjucks can't just add two strings together to concatenate them. To do this, you apparently need to put each piece into an array, then use the `join` filter on it. Thanks to [Michael Heap](https://michaelheap.com/nunjucks-concatenate-string/) for pointing this out!

Once these variables are set, I can stick them into meta tags more easily:

```html
<meta property="og:title" content="{{ sharetitle }}">
<meta property="og:type" content="{{ sharetype }}">
<meta property="og:image" content="{{ shareimage }}">
<meta property="og:url" content="{{ shareurl }}">
<meta property="og:description" content="{{ sharedesc }}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ sharetitle }}">
<meta name="twitter:image" content="{{ shareimage }}">
<meta name="twitter:description" content="{{ sharedesc }}">
```

Before, the spaghetti above was combined with the meta tags and I just couldn't take it anymore! At least the actual HTML part is way easier to read now.

## CSS Grid

The layout of this site is done with CSS Grid, a one-line column setup.

```css
grid-template-columns: 15px 1fr min(100% - 2rem, var(--container-max, 80ch)) 2fr 1fr 15px;
```

That's a lot of columns. It's technically still fine because I only had content going down the third column:

```css
.container {
  grid-column: 3;
}
```

But I was thinking it would be nice to be able to use some of the space on the sides for other stuff too. Now I'll have to deal with a bunch of column numbers and line numbers and remember what's what, and I don't like magic numbers.

CSS Grid lets you name your lines and name your areas. So I added this line after declaring the columns, which is naming said columns:

```css
grid-template-areas: ". . main sidebar . .";
```

Each dot is an unnamed column, `main` names the main column, and `sidebar` is now the name of the column next to that. Now I can update the CSS with the content in, and I have the option to put more stuff into another column:

```css
.container {
  grid-column: main;
}
aside.sidebar {
  grid-column: sidebar;
}
```

The less I look at numbers, the longer my poor brain lasts each day! 😅