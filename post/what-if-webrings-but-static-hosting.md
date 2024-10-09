---
title: What if Webrings, but Static Hosting?
tags: [eleventy, jamstack, meta, static, webdev, webrings]
excerpt: 'What if we hung out in a webring?'
bskyLink: ''
mastoLink: ''
reply: ''
like: ''
repost: ''
date: 2024-08-23
category: Article
featuredimage: https://cdn.protogen.gg/wp-content/uploads/2024/08/IMG_4006.png
templateEngineOverride: md
---

Webrings are a thing that was popular back in the days of the web, before good search engines were around. They were a collection of websites with something in common, and each site would link to the next site in the sequence. Eventually, the last site would link back to the first one again, forming a ring. Since search engines weren't a thing, this was a fantastic way for you to find other websites you might like.

<aside class="sidebar"><div class="flow">
<strong>What about blogrolls? I've heard of those.</strong>
<p>Blogrolls are similar, but different. A blogroll is something you as a site owner would make. It's a curated list of other blogs/websites: "If you like this site, I think you'll like these too!"</p>
<p>Webrings, on the other hand, are more like a club, usually managed by someone that makes sure that all the links work. It's common to get kicked out of the webring if you didn't have the webring links on your site, for example - that would break the purpose and flow of a webring.</p>
</div></aside>

Now that good search engines seem to be not really around anymore, webrings have had a resurgence of popularity! Which is great for discovering others, since the sites that tend to be part of webrings don't tend to spend much effort on SEO (the practice of summoning lesser demons two get your site ranking higher on result pages).

## How Though?

Back in the day, most webrings worked something like this:

- You click a next/previous link on someone's site.
- The server the webring is hosted on looked at where you came from, and resolved the request to redirect you to the next/previous site on the list.
- If the site was the one at the beginning or end of the list, it would loop you around to the other side, continuing the ring.

This required server know-how to run, of course. DNS work and redirection, PHP scripting, etc. These are still valid ways to run a webring, as they always have been.

However nowadays, there's a huge boom in popularity for static websites running a "serverless" Jamstack (JAM = Javascript, APIs, Markup) kind of setup. The original way of running webrings doesn't really work with these setups, since there isn't a "server" available to handle requests coming in whenever. So how can we make a webring in a static web environment? I've seen a few different ways.

### Manual

In this scenario, the webring admin keeps a list however they like. The sites that are part of the ring are given a specific HTML block or set of links to put online.

Anytime there's a change in membership in the ring, the admin hands out new code to the affected sites for them to update.

Nothing automatic happening here at all. It's a lot of work to maintain, and it's a lot to expect every site owner to be that responsive in updating their links quickly.

I don't recommend this approach - if you have a ring like this, more power to you.

### Redirect on Admin Site

Here, the webring admin maintains a page that acts as the webring home. You'll usually see a list of all the sites in the ring, and directions on how you can join. There's also some Javascript running on this page.

The sites get a set of links to put online. Instead of linking straight to other sites in the ring, they link to the ring's homepage with a query string on the end of the link, like any of these:

- `webringhome.net/?from=website.com&to=next`
- `webringhome.net/redirect.html?name=website.com&to=prev`
- `webringhome.net/next?host=website.com`

The only real difference is how you prefer to get your data and write your JS. The JS on the webring home parses those query parameters, gets the intended destination from the official list (usually a JSON file or something), and runs a good old `document.location` to send you where you mean to go.

This is the most common way of running a webring that I've seen. The only downside is the visitor gets this flash of seeing the ring page before they see the next site in the ring. This might be distracting, or disorienting. Flashes and immediate redirects like that can also come off as spam/hijacking behavior, though a similar thing happens on certain HTTP 300 (Page moved) errors, so it's not much of a concern.

If I were starting a webring today, this is probably the way I'd go about it.

### Site Rendered Links

This way, the webring admin maintains an accessible, parsable list of sites in the ring. And that's it!

The magic happens on the member's sites. The admin hands out some code for the member site to run. This code grabs the admin's webring list, finds themselves in the list, and generates links to the next/previous sites in the list.

The pros: it's a very easy way to maintain the ring. The con: it's easy for someone who isn't part of the ring to pretend that they're in the ring when they're really not. On the other hand though, once you're in the ring's loop, you're not getting back to the imposter's site anyway. So maybe that's a non-issue, since you could pretend to be in any webring you like with the right code. ¯\\\_(ツ)_/¯

## How I Do Webrings on Cascading Space

This site is built with Eleventy. Data ingest is one of Eleventy's strengths. So I have the file `_data/webrings.js`. This collects the webring data together into a standard format for templates, whether the links are handed to me or generated:

```js
module.exports = async function(){

// Start with static rings
let webrings = [
  {
    name: "IndieWeb Webring",
    mainpath: "https://xn--sr8hvo.ws",
    prevpath: "https://xn--sr8hvo.ws/previous",
    nextpath: "https://xn--sr8hvo.ws/next",
    note: ""
  },
  {
   ... // Several rings in similar objects
  }
];

// Add dynamic rings
try {
  const ringResponse = await fetch(ringListURL);
  if (ringResponse.ok){
    const ringData = await ringResponse.json();
    const myIndex = ringData.members.findIndex(o => o.site === "https://cascading.space");
    const prevIndex = myIndex ? myIndex - 1 : ringData.members.length - 1;
    const nextIndex = ringData.members[myIndex + 1] ? myIndex + 1 : 0;
    webrings.push({
      name: "Dynamic Webring",
      mainpath: "https://webringhome.net"
      prevpath: ringData.members[prevIndex].url,
      nextpath: ringData.members[nextIndex].url,
      note: ""
    });
  }

  // Other dynamic rings here
  
  // After all rings are done
  return webrings;
}

}
```

Now it goes into a Nunjucks template nice and clean:

```html
<div class="webrings">
  {% for ring in webrings %}
  <p>
    <a target="_blank" href="{{ ring.prevpath }}">&lt;--</a>
    <a target="_blank" href="{{ ring.mainpath }}">{{ ring.name }}</a>
    <a target="_blank" href="{{ ring.nextpath }}">--&gt;</a>
    {{ ring.note | safe }}
  </p>
  {% endfor %}
</p>
```

This is in place on my [home page](https://cascading.space) right now! Clean and extendable, just as I like it!

<img data-transform="true"
  src="https://cdn.protogen.gg/wp-content/uploads/2024/08/IMG_4002.png" 
  alt="Cascade making a heart sign with their hands"
 />