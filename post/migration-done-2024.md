---
title: Bye-Bye WordPress
tags: [meta, webdev, wordpress]
excerpt: No more Wordpress on this site!
date: 2024-10-09
category: Article
featuredimage: ''
bskyLink: ''
mastoLink: ''
reply: ''
like: ''
repost: ''
---

I have just finished migrating a bunch of old posts.

Earlier this year I [posted about my setup](https://cascading.space/post/its-headless/) and how I was using Wordpress as a content store so I can write, edit, and upload easier. What with the drama surrounding Wordpress as of late, I decided to vote with my feet, as it were, and made way to get Wordpress out of my pipeline.

I spent a while moving all the posts I had stored there to good old Markdown files. There were a few posts that were already in this format, so it was a lot of copying/pasting and cleaning up formatting and chores like that. Now, though, I've been able to uninstall Wordpress entirely, and there's the added benefits of having one source for all my content as well.

This means I shaved out a lot of old gross code in the templates that was checking if it was a WP post or not before going on with the job. Now, it can just do the job.

I was worried that images would be harder to deal with. Not really. I copied `wp-content` to elsewhere on the server, uninstalled the thing, and copied the new backup folder into the empty void left behind. I didn't even have to change file paths! That would have taken a lot longer. Also, I'm already probably doing all that when I rebuild again in December of this year...

Can't dwell on that, though. Writing new posts is a matter of writing markdown in my code editor. I can't post from my phone, but that's really the only issue I have with it. And I only have to live with it till the rebuild anyway. Will I be writing that much? Who knows.

Lastly, apologies if this change-up did weird things to the RSS feed! Apparently the WP posts were already gunking up the works in there anyway, so this should've been a sort of hard reset. New posts should be ordered by the day they were actually written instead of flooding the feed with all the WP at the top of the list at all times. RSS is really tough to spot and debug problems, so if you see any issues, please let me know via your communication flavor of choice!