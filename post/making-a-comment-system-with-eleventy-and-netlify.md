---
title: Making a Comment System with Eleventy and Netlify
tags: [apis, blog, comments, learning, meta, netlify, new-feature, webdev]
excerpt: How I managed to add a comments system to my static blog.
bskyLink: ''
mastoLink: ''
reply: ''
like: ''
repost: ''
date: 2024-08-11
category: Article
featuredimage: https://cdn.protogen.gg/wp-content/uploads/2024/08/IMG_4254.png
templateEngineOverride: md
---

After a couple days without posting, I think the ability to have *discourse* here on the site makes up for it. Getting here was quite a journey. (And it's not over yet)

When you have a static site, a lot of things you take for granted get a lot more complicated, since there isn't a server there handing everything 24/7. One of those things is comments. Being able to leave a comment on a post is so ubiquitous, it's suddenly very weird to think about how to make such a system from scratch.

There are options out there for adding comments to static sites! The simplest would be platforms like Disqus, CommentBox, Muut, and such. These let you slap a script to the end of the post and call it a day. Most of these don't suit my needs though, because I'm looking for something that:

- Is free (most have a free option, but you grow out of it quickly, or need to pay for things like branding or customization)
- Respects your privacy (many, especially Disqus, are infamous for tracking and scraping everything about you they can - I'm not into that)
- Lets you own your data (if it lives on some other server somewhere, it's out of your hands)
- Is compatible with my setup, using Eleventy hosted on Netlify

I've found a number of posts and tutorials about people making their own comment systems in the same environment, but many of those are old, example links are broken, or APIs don't work the same way they did at the time. After a bunch of research, this is the process I'm trying to build -

A visitor can go to the end of a post, and fill out a form to leave a comment, or to reply to another comment. Using [Netlify Forms](https://docs.netlify.com/forms/setup/), these will go into a pool of comment submissions that will act as a moderation queue. I even get an email notification when a new one appears.

Netlify has an awesome API that lets you [get all the submissions for a form](https://docs.netlify.com/api/get-started/#get-verified-submissions). This way I can use a little moderation UI I made to go through these submissions and approve them or delete them. If it's approved, a copy of the comment details is sent using *another* Netlify Form which collects all the approved comments. Whether it's approved or not, it's deleted from the moderation queue. All this is done with that awesome API.

With the comment in the "approved" list, we just need to trigger a new site build. While it's building, it uses that Forms API again to grab everything from the approved list, sort it by page and by date/time, and let the template put the comments where they belong.

***whew***

It's a big project to take in, for sure.

<img data-transform="true"
  src="https://cdn.protogen.gg/wp-content/uploads/2024/08/IMG_4003.png" 
  alt="Cascade is overheating, so they use a computer fan on themselves"
 />

## Project Management Time

We're starting off by making one of my favorite things: a list.

- New comment form
- Moderation page and form
- Updated comment listing

**Important Note:** I do NOT recommend following this post as you would a tutorial. Everyone's setups are different, and any code I show here is simplified to share the point being made, not how it actually works on my site. My hope is that once you understand the flow of what's happening, you can work out how to apply it to your own system and work out any kinks unique to you, as I had to for me. Kay? Kay.

## New Comment Form

Since it's just using Netlify Forms, making the actual form is no different from a normal HTML form - I just put the `netlify` attribute on it and it's working.

This form will be on all the commentable pages - and all those comments end up going into one big bucket. So, to keep track of what comments were left on which pages, I'm using a hidden text input that is prefilled with the page address. We can use that to filter the firehose later. There's also a hidden [honeypot field](https://en.wikipedia.org/wiki/Honeypot_(computing)), to keep the spam out (that's not counting Akismet, which Netlify uses as well on the submissions that make it through).

I went an extra mile to allow for replying to other comments in kinda threaded discussions (super beta, please be nice), so there's another hidden field in there to send the comment ID of the comment being replying to. This and a few UI goodies are done with some basic jQuery-esque scripting.

Finally, I set up the form so that it submits with a fetch request instead of HTML's default post. It's not necessary, but doing it the HTML way sends you to a basic Netlify "thanks for your submission" page, and it didn't fit my vibe.

<img data-transform="true"
  src="https://cdn.protogen.gg/wp-content/uploads/2024/08/IMG_4007.png" 
  alt="Cascade, but like, weird short version haha"
  data-caption="Pictured: The vibe in question" />

## Moderation UI

This was another (private) page elsewhere on the site. There's another form, set up the same way as the first one.

This time, the page uses an API call to collect the submissions that need moderating. Another script grabs the comment data and prefills the form for me to review everything and make sure it's okay as a comment, and technically safe (no script injections allowed). Finally there's a password field and some Delete/Approve buttons.

The password field doesn't keep the form from being sent. As the site builds, it uses the password as a filter, so only the comments with the right password attached are displayed. Not super secure, I know, but it gets the job done for a first go.

The buttons both make an API call to [delete the comment](https://docs.netlify.com/api/get-started/#delete-submissions) from the moderation queue. The Approve button does an extra step and sends the form on this page off, putting this comment into the approved list.

I wanted to retrigger a site build when this form goes through, and it ended up being even easier than I thought. When Netlify Forms are submitted, it can send a notification either through email or through a POST request. I ended up making a new [build hook](https://docs.netlify.com/configure-builds/build-hooks/) for the site, and using that as the target for the form POST notification. Done!

## Updated Comment Listing

The rest of the work is Eleventy-related.

To get all the comments, I added it into the JS file I already have that collects the [Webmentions](https://cascading.space/post/webmentions/). That file already sorts those out into likes, reposts, and replies, so I beefed up the part of the script handling replies to take these comments too. Here's a (very) short version of that file.

```js
// _data/mentions.js
module.exports = async function(){
  const commentsurl = 'API-URL-HERE';
  const webmentionsurl = 'API-URL-HERE';
  
  try {
    const commentsresponse = await fetch(commentsurl, { headers: headers });
    const webmentionsresponse = await fetch(webmentionsurl);
    if (commentsresponse.ok && webmentionsresponse.ok) {
      const comments = await commentsresponse.json();
      const webmentions = await webmentionsresponse.json();
      // Now the comments and webmentions are available together. Merge them as desired. Here, they're all combined into an object called 'mentions'
      return mentions;
    }
  }
}
```

Now it's a matter of adjusting my template files to account for two different potential sources of data. In my case, the most helpful way I found was to adjust the data in the `mentions.js` file above. All webmentions and comments are put together into a large array called `mentions`, which is what's returned. As part of that, for each object I added properties like `targetUrl` and `dataSource`, which would be set to either `webmentions` or `comments`, depending. Then, my templates can use those variables to determine what to show.

On my site, a difference you might notice as comments begin appearing is that replies that come from webmentions (mostly social media replies) have a button linking back to their original post on social, so you can reply to them there. Homegrown comments have a different reply button, letting you reply to that comment here instead - though there isn't a way to notify them that they were replied to. (To make that a feature, I think I would have to start collecting more data which makes complying with laws like GDPR a concern.)

## Things Have Been Going Too Well

This is where I hit a roadblock that took a while to work though: sorting the comments.

The best part of this whole section is that I brought it upon myself by thinking I'd build in replying to other comments. I could've dropped that little feature and simplified the whole thing tenfold. But I was in too deep.

<img data-transform="true"
  src="https://cdn.protogen.gg/wp-content/uploads/2024/08/IMG_4254.png" 
  alt="Cascade celebrating an update to Windows 11, while someone behind them yells no!"
  data-caption="Surely nothing can go wrong when making a new feature..." />

The easy way out is to sort all the comments based on the date property in their objects. There's loads of examples across Stack Overflow showing basic date sorting functions. That is the first step I took, just to start from a somewhat clean slate:

```js
function sortComments(a,b){
  let aDate, bDate;
  if (a.published) aDate = new Date(a.published);
  if (a["wm-received"]) aDate = new Date(a["wm-received"]);
  if (a.created_at) aDate = new Date(a.created_at);
  if (b.published) bDate = new Date(b.published);
  if (b["wm-received"]) bDate = new Date(b["wm-received"]);
  if (b.created_at) bDate = new Date(b.created_at);
  return aDate - bDate;}
```

Since the data comes from different places and they organize their objects differently, I'm checking for the different ways the date can manifest itself in those objects. Then I'm using the `Date()` constructor to normalize them and make the two dates comparable, then doing the comparison.

Now for the tricky part. If a comment is made in response to another comment, for it to make sense, that new reply needs to appear directly after the comment it's replying to. Ideally it'll be indented or otherwise styled visually to indicate that it's a conversation at a different level than the ones around it.

Being totally honest, I fumbled through a lot of garbage code trying to logic my way through this. I'll skip to the version that worked.

First, because I'm attaching the comment ID of the comment being replied to when it's first submitted, I have a good starting point. As I was going through and organizing all the data as above, I made sure to add a few things when there was a parent comment ID involved. I added properties like `hasParent` and `isParentOf`, in hopes that they'll come in useful for templating reasons later. (They haven't yet, haha)

I also added a property called `nestingDepth`, which starts at 1. If the comment has a parent, `nestingDepth` is incremented to 2. There's another couple of lines which check the parent itself, and if THAT comment has a parent, it increments again to 3.

I decided to call it there. With my current blog traffic the way it is, I don't expect to host conversations more involved than 2 layers deep, let alone 3. And going deeper than that is just asking for some mathematician to name a theorem after the resulting recursion problem.

Finally, while scanning the comment objects, if a comment had a parent, I added an entry to an array called `relationships`, which tracked the nesting depth, the ID of the parent, and the ID of the child.

With all the setup done, the plan is to use the `relationships` array as a map of what changes to make. Because I'm dealing with multiple nesting levels, I resorted that array so that the level 2 changes came first, then level 3. (And so on, if more levels ever get supported.)

```js
relationships.sort((a,b) => {
  if (a.depth &lt; b.depth) { return -1; }
  else { return 1; }
});
```

With all that done, all that's left is to loop over `relationships`, grab the indexes of things, and move them around.

```js
relationships.forEach(relationship => {
  // Find child, make copy, and delete from array
  let childIndex = comments.indexOf(comments.find(o => o.data.comment_id === relationship.child));
  let child = comments.find(o => o.data.comment_id === relationship.child);
  comments.splice(childIndex, 1);
  // Get parent index and add child back into array directly after
  let parentIndex = comments.indexOf(comments.find(o => o.data.comment_id === relationship.parent));
  comments.splice(parentIndex + 1, 0, child);
});
```

## Future Improvements

This is admittedly really messy. But for now, it works. There's a lot of improvements I'd like to make to overhaul this to v2:

- Since data is being combined from multiple sources, I want to do a better job of cleaning them up at the beginning to make the object structures match. It will make the templating side of things far cleaner and easier.
- Depending on how the comment-on-comment feature is used, I may scrap it entirely for simplicity's sake.
- Netlify Forms has a limit on how many submissions you can make for free in a month. And since I'm using two form submissions per comment (one for writing, one for moderating), I can only take half as many comments in a month for free. I'm not opposed to paying, but it's worth looking into storing those comments somewhere else. The two options coming to mind are:
  - GitHub - GitHub has an API that allows for writing files to repositories, and that would allow for Eleventy to see the comments natively without needing fetch calls.
  - WordPress - I'm already using the WP API to store my posts - maybe it could work for comments too? There's a built-in moderation and comment management space too.

## EDIT: The Day One Experience

Since posting this just a day ago, a few comments did come in. Many thanks to those who did!

When I went to approve them, the comments appeared, but they had a strange treatment, with escaped characters and brackets that made it look like part of an array.

Inspecting the comment `<textarea>` on the moderation form showed that the injected comment was appearing in a shadow root. I tried to prefill the comment using `.value`, `.textContent`, and `.innerHTML`, with the same results.

In the end, the only thing I could think of to remove the strangeness was instead injecting the comment into a `<pre>` tag, and copy/pasting the comment from that to an untampered `<textarea>` instead.

If anyone happens to know what causes that sort of behavior, I'd be thrilled to know! It's a priority to fix for when I get around to Comments v2. I expect it's something to do with how [`<textarea>` has a different DOM API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement) than a regular `<input>` does. I'll update this post again when I learn what it was.