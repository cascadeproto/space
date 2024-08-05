---
title: Webmentions
tags: [personal sites, indieweb, tutorial]
excerpt: 'In light of the recent poll I ran, here is a quick rundown of what Webmentions are.'
bskyLink: ''
mastoLink: ''
reply: ''
like: ''
repost: ''
date: 2024-04-29
category: Article
---

Let's get the quick definition out of the way now: [Webmentions](https://webmention.net/) are a standardized way for one website to let another one that it was linked to. That could be an actual comment, an indication of a like, a repost, or even an event RSVP. It's a pretty cool thing! In this post, I'll go over how I included it on this site, and what I hope to see with them in the future.

## How it works

Here's how Webmentions work:

1. I post something neat on my website (which is set up to receive Webmentions).
2. You post something on your website that links to my neat thing.
3. Your web software sends a Webmention - a special HTTP request that looks kinda like this (stripped down to see what's going on):
    ```
    POST https://mysite.com/webmention

    source=https://yoursite.com/reply-to-my-thing&
    target=https://mysite.com/neat-thing
    ```
4. Now my web software knows that you're linking to it, and I can include that response on my site, showing it like a comment or a like on the original post.

Using this, two different websites can have whole conversations with each other, and the whole conversation can be seen without having to follow links back and forth. I can make a page about an upcoming event, and you can make a post about how you're excited to be there, and my website can show you as having RSVP'ed as "yes" along with everyone else who's going. With a small post, I can send a like to your new page, and it'll show up on your website! You get the idea...

## Webmentions on cascading.space

This section gets technical, and individual to this site. If you don't care, go ahead and skip this section. :)

There are two sides to getting Webmentions to work - receiving them and sending them.

## Receiving Webmentions

I don't have a server waiting for requests all the time. My site is a static (serverless) one because it's far cheaper and makes for faster loading of webpages. So I need to use someone else's server to listen for and collect any Webmentions coming my way. That's where [Webmention.IO](https://webmention.io/) comes in. I use my web domain to sign in (more on this topic in another post - this is a whole setup piece too), and I get a little dashboard, and some code to stick on my website. I took these links and put them in my `<head>` element:

```
<link rel="webmention" href="https://webmention.io/cascading.space/webmention" />
<link rel="pingback" href="https://webmention.io/cascading.space/xmlrpc" />
```

This tells the server that's sending the request where "webmention" related requests should go. Kind of like forwarding your mail. Now all the Webmentions I receive get shunted off to Webmention.IO and land on that dashboard.

Now that I'm getting Webmentions just fine, the next step is to show them on my site. There are a couple of ways to go about this using Webmention.IO's API. I could make a call that gets all the mentions during my site build step (just before updates are posted live). Then I would include a bit in my page templates that would show mentions related to that page. The problem with that approach is that you only see new Webmentions when I trigger a site rebuild. (As often as I make a new post or fix a bug, in my case. Some people retrigger a build every half-hour or so, but then you're still waiting for up to a half-hour to see your fresh Webmention.)

To show new Webmentions as quickly as the process will allow, I opted for a client-side rendering approach instead. (The HTML is put together in your browser, instead of on my server.)

The page starts loading without any Webmentions at all. Instead, there's [a JavaScript file](/bin/code/getMentions.js) that asks the Webmention.IO API for any mentions having to do with that page. In that file, I get the mentions, sort them, and arrange them into a template. Finally, I stuck it into a part of the webpage. Because all this happens after the page and the JS file load, it can look a little delayed compared to the rest of the page, which is ready to go. For the sake of a more current list of Webmentions, I think it's worth the wait. (Which, for the record, is about 5 seconds or less as of this writing.)

### Sending Webmentions

Again, I don't have a server to send requests from, so I gotta use someone else's. Enter [Webmention.app](https://webmention.app). (I know. I get the two confused all the time, ugh.) Setting things up here is pretty close to the other tool - sign in with your site domain and get some code. I take this code over to my control center on Netlify (which is where my site gets built and deployed), and put it into a trigger that happens whenever there's a successful site deployment.

Now, whenever I make a new post on my site, it pings Webmention.app, which crawls through my RSS feed looking for anything new. If it finds something new, it'll look for links out to other websites, and send Webmentions to them all.

Phew!

## The issue

The problem here is that the internet isn't used by just web developers, it's used by everyone. And while it's great that Webmentions exist, they might as well be useless if they're too complicated for everyone to use. There are ways to make all this stuff magically happen, but it takes a lot of setup and a very steep learning curve.

Not to mention the most obvious of issues - most people don't have personal sites. As of this writing, most people engage with the web through their chosen social media platform, sharing, responding, and reacting there, where there are extra convenient "like" buttons and you don't have to know how it's all put together to enjoy it.

Honorable mention (pun intended) goes to a service called [Bridgy](https://brid.gy/). On Bridgy, you connect your web domain with your social media accounts. Now, if you make a social media post with a link to your site in it, Bridgy will keep track of those posts and their likes, reposts, replies, etc, translate them into Webmentions, and send them to you. This way, even if people don't have personal websites, they can engage with you on their social media of choice and those interactions can be a part of the club! Except for certain walled gardens, anyway. Twitter, Facebook, Instagram, and others are increasingly impossible to interface with, so things are kinda stuck there. :(

(As a bonus, Bridgy also has a feature where you can automatically make posts to social media whenever there's something new on your website, so you don't have to go around and do that manually for however many socials you have.)

## The hopeful future

Webmentions are a fantastic technology. A very useful standard that could be as useful as HTTP, JSON, and others. But the general population doesn't know about those other useful formats, because they don't NEED to. Many days and years of work have made those technologies as easy and ubiquitous as clicking a link. The same can someday be true for Webmentions too.

It's probably way out there though. Nice technology like this connects people from around the world together better, and as long as the standard is followed, it works no matter how else your site works. As long as there's a flourishing user data/advertising market, there's an incentive for companies to avoid stuff like this entirely.

However, as more and more people get sick of the enshittification of their platforms, more people start to look to other options, including their own websites. There's a plugin for WordPress to make Webmentions a thing on your personal website. If you still want a social media feel to it, [Micro.blog](https://micro.blog) supports Webmentions and loads of other similar technologies out of the box. There's also [Known](https://withknown.com/), [Typlog](https://typlog.com/), [I haz a website](https://i.haza.website/), and others. The more of us there are, using this stuff, the better it will be, and the harder it will be to break the web into a collection of walled gardens again.

Speaking of Webmentions, try it out with the bit under this post! If you don't have a website to post your reply on, you can respond to my post about this on [Bluesky](https://bsky.app/profile/cascading.space) or [Mastodon](https://furry.engineer/@cascade), or like/boost it, and it'll show up there too!

<div class="visually-hidden syndication-links">
<a href="https://brid.gy/publish/bluesky"></a>
<a href="https://brid.gy/publish/mastodon"></a>
</div>