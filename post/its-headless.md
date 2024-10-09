---
title: It's Headless! 👻
tags: [blog, meta, webdev, wordpress]
excerpt: Small write-up about using WordPress as a headless CMS with Eleventy.
bskyLink: https://bsky.app/profile/cascading.space/post/3kyqnut6vpk2w
mastoLink: https://furry.engineer/@cascade/112893128722505787
reply: ''
like: ''
repost: ''
date: 2024-08-02
category: Article
featuredimage: ''
templateEngineOverride: md
---

There's loads and loads of ways to make a blog go. I'm realizing that my way is... pretty weird, which means: I should write about it!

WordPress is a Content Management System (CMS). It holds all the content of the posts and keeps it organized and available. WordPress is also a lot of other things - hosting manager, design template manager, comment manager, and more. The thing is though, I don't need those other things. Just the content stuff.

Hosting and server stuff is handled by [Netlify](https://netlify.com). Not much to do there, since this site is totally static (server hands out prepared HTML files instead of building them fresh for every visitor).

Templates and design are done myself using [Eleventy](https://11ty.dev). While I'm used to working with WordPress themes, they are a huge hassle to develop. Just getting a dev environment up and running on my computer is a lot of friction. Eleventy on the other hand, lets you chuck files into a folder, hit the button, and call it a day. And you can mostly use whatever templating system you want, including plain HTML, Web Components, even JSX if you're into that.

Comments are harder - right now they run on [webmentions](https://cascading.space/post/webmentions/), compiling the replies, likes, and reposts from BlueSky and Mastodon and showing them below the post. There's a button down there to push if you wrote a reply on your own blog or elsewhere, but no way to leave a comment here natively. That's on my to-do list, but finding a decent system for that on a static site is rough.

So I don't really need the other features that WordPress offers. So I'm running it as a "headless CMS." In static site development, headless means that the content and the design are handled totally separately.

In this case, WordPress has another feature hardly anyone talks about - a REST API. It's a collection of URLs you can go to where instead of giving you a regular page, it's just a bunch of data - like the content! There's a URL that will deliver all the blog posts in the system, optionally filtered by time, author, tags, all sorts of things.

And going back to Eleventy, another place it shines is in working with data. You don't need the data chucked into that folder with the rest - you can have remote sources, like this API. My site uses multiple sources - the WordPress API for posts, the webmention.io API for replies, likes, and reposts, and soon to be others as well - I'm experimenting with the BlueSky API to see if I can't archive my social posts here on the website.

<img data-transform="true"
  src="https://cdn.protogen.gg/wp-content/uploads/2024/08/CascadePowerDownStick.png" 
  alt=""
 />

So that's a lot of technical stuff. How does it actually work to use?

- I log into a private WordPress install I have - either the web or the WP app works. I write and edit posts there.
- The one plugin I have watches for new posts, and sends off a ping to the hosting service Netlify.
- This ping tells Netlify to "rebuild" the site - get fresh data from all the places, make the new pages, and serve it.
- Done!

Notice that the last 3 steps don't actually involve me doing anything - it's as automatic as if I were using WordPress the "normal" way, haha!

There's times I want to change the header or footer, add new features, change a template thing, etc. In that case I make the change to my local copy of the site, send it off to GitHub, and that auto-triggers a rebuild too.

And because I can, and I like overkill, I have a button on my phone I can push whenever for a new build as well.

<img data-transform="true"
  src="https://cdn.protogen.gg/wp-content/uploads/2024/08/IMG_62A884D654DA-1-961x1024.jpeg" 
  alt=""
 />

And that's that. The only major thing I'd like to work on is a native commenting system. The options I want to explore there are maybe using the WordPress API again to take comments, or maybe using some of the server-side magic Netlify offers and make what's called a lambda function for it.

Whatever it ends up being, I'll probably write about it here!