function sortByDate(a,b){
    if (a.published)
        return new Date(a.published) - new Date(b.published);
    else
        return new Date(a["wm-received"]) - new Date(b["wm-received"]);
}

function sortComments(a,b){
    let aDate, bDate;
    if (a.published) aDate = new Date(a.published);
    if (a["wm-received"]) aDate = new Date(a["wm-received"]);
    if (a.data) aDate = new Date(a.data.time);

    if (b.published) bDate = new Date(b.published);
    if (b["wm-received"]) bDate = new Date(b["wm-received"]);
    if (b.data) bDate = new Date(b.data.time);

    return aDate - bDate;
}

function checkRedirects(target) {
    let url = target.split('?');
    const redirects = [
        {
            from: 'https://cascading.space/post/165/',
            to: 'https://cascading.space/post/proper-introductions-and-happy-blaugust/'
        },
        {
            from: 'https://cascading.space/post/172/',
            to: 'https://cascading.space/post/its-headless/'
        },
        {
            from: 'https://cascading.space/post/its-headless-👻/',
            to: 'https://cascading.space/post/its-headless/'
        },
        {
            from: 'https://cascading.space/post/177/',
            to: 'https://cascading.space/post/journals/'
        },
        {
            from: 'https://cascading.space/post/194/',
            to: 'https://cascading.space/post/eleventy-lessons-learned/'
        },
        {
            from: 'https://cascading.space/post/200/',
            to: 'https://cascading.space/post/a-saga-of-light-and-darkness/'
        }
    ];
    if (redirects.find(o => o.from === url[0])) {
        return redirects.find(o => o.from === url[0]).to;
    } else {
        return url[0];
    }
}

module.exports = async function(){
    const webmentionsurl = `https://webmention.io/api/mentions.jf2?domain=cascading.space&token=${process.env.WEBMENTIONIO_TOKEN}&per-page=100`;
    
    try {
        const webmentionsresponse = await fetch(webmentionsurl);
        console.log(`Webmention.io: ${webmentionsresponse.status}`);

        let engagement = {
            inReplyTo: [],
            likeOf: [],
            repostOf: [],
            others: []
        };

        // Webmentions
        if (webmentionsresponse.ok) {
            let webmentions = await webmentionsresponse.json();
            
            webmentions.children.forEach(mention => {
                mention.dataSource = 'webmentions';
                mention.targetUrl = checkRedirects(mention["wm-target"]);
                switch (mention["wm-property"]) {
                    case "in-reply-to":
                        engagement.inReplyTo.push(mention); break;
                    case "like-of":
                        engagement.likeOf.push(mention); break;
                    case "repost-of":
                        engagement.repostOf.push(mention); break;
                    default:
                        engagement.others.push(mention); break;
                }
            });

            engagement.inReplyTo.sort(sortComments);
            engagement.likeOf.sort(sortByDate);
            engagement.repostOf.sort(sortByDate);
            engagement.others.sort(sortByDate);
        } else {
            console.warn('Webmention.io API Response:');
            console.warn(webmentionsresponse);
        }

        // Comments
        const comments = [
            {
                dataSource: 'homemade',
                targetUrl: 'https://cascading.space/post/what-if-webrings-but-static-hosting/',
                nestingDepth: 1,
                hasParent: false,
                isParentOf: false,
                comment_id: 'm1pqaqm9sla8flbhlrd',
                commenter_ip: '46.33.152.231',
                commenter_ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
                time: '2024-10-01T00:56:58.417Z',
                path: '/post/what-if-webrings-but-static-hosting/',
                parent: '0',
                name: '5225225',
                url: 'https://www.5snb.club',
                avatar: 'https://cascading.space/bin/img/blank-avatar.png',
                email: '',
                comment: `Wouldn't site rendered links have somewhat of the same downside as the manual method? In that you still need to at least remember to *regenerate* the site if the webring changes.<br><br>Another method is using an iframe. Not easily styleable with CSS, and makes a request to the webring host for every user, but does allow for easy updating by the webring host. For a webring I was a part of, I used to do that, but moved to basically site rendered links (only I was given HTML, not json, so I just included it directly in the homepage), because of reliability and privacy reasons (I don't like my site having a dependency on any third party resources if I can help it).<br><br>Though I guess you could automatically build and upload your site on a cron job every once in a while. That or fetch and render the links in javascript? (Kinda the iframe method, only easier to style. Requires JS though, which isn't great)`,
            },
            {
                dataSource: 'homemade',
                targetUrl: 'https://cascading.space/post/making-a-comment-system-with-eleventy-and-netlify/',
                nestingDepth: 1,
                hasParent: false,
                isParentOf: false,
                comment_id: 'lzpp646k0bktt1g4b4oe',
                commenter_ip: '76.21.11.78',
                commenter_ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                time: '2024-08-11T15:05:58.238Z',
                path: '/post/making-a-comment-system-with-eleventy-and-netlify/',
                parent: '0',
                name: 'Bob Monsour',
                url: 'https://www.bobmonsour.com/',
                avatar: 'https://cascading.space/bin/img/blank-avatar.png',
                comment: "Great post! Just a heads-up that you're RSS feeds come through to my reader fine, but the title for each post that comes through is just Cascade, not the title of the post itself.",
            },
            {
                dataSource: 'homemade',
                targetUrl: 'https://cascading.space/post/making-a-comment-system-with-eleventy-and-netlify/',
                nestingDepth: 1,
                hasParent: false,
                isParentOf: false,
                comment_id: 'lzp7nppho8iktkglt7',
                commenter_ip: '73.228.113.208',
                commenter_ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
                time: '2024-08-11T06:55:46.297Z',
                path: '/post/making-a-comment-system-with-eleventy-and-netlify/',
                parent: '0',
                name: 'Scarbo',
                url: false,
                avatar: 'https://cascading.space/bin/img/blank-avatar.png',
                comment: "Looking at the last comment, I'm going to not be directly typing backslash r and n into this comment.<br><br>And then let's see if it puts it in my post when I do new lines. Then you'll know if there's a bug to fix. <br><br>Did it do it? I'll see right after I chose Send.",
            },
            {
                dataSource: 'homemade',
                targetUrl: 'https://cascading.space/post/making-a-comment-system-with-eleventy-and-netlify/',
                nestingDepth: 1,
                hasParent: false,
                isParentOf: false,
                comment_id: 'lzp6hvwbas76e0zlz5h',
                commenter_ip: '136.36.74.138',
                commenter_ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
                time: '2024-08-11T06:23:14.638Z',
                path: '/post/making-a-comment-system-with-eleventy-and-netlify/',
                parent: '0',
                name: 'AgingGamer (Kelly Adams)',
                url: 'https://www.kgadams.net/',
                avatar: 'https://cascading.space/bin/img/blank-avatar.png',
                comment: "Wow: that sounds like it was a lot of work! I'm spoiled with old fashioned Wordpress: comments are basically boiled in.<br><br>I must admit, though, that I find it kind of strange to come to the bottom of a post without seeing any mechanism for a comment. It feels... wrong, somehow. And on my own blog receiving a comment is kind of like receiving a gift, so I don't think I'd want to do without.<br><br>So... congratulations on building your own comment system!",
            }
        ];

        let relationships = [];

        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            // Scan and record relationships
            if (Number(comment.parent) != 0) {
                comment.hasParent = true;
                comment.nestingDepth++;
                if (comments.find(o => o.comment_id === comment.parent).parent != 0) {
                    comment.nestingDepth++;
                }
                relationships.push({
                    depth: comment.nestingDepth,
                    parent: comment.parent,
                    child: comment.comment_id
                });
            }
            if (relationships.length) {
                relationships.forEach(relationship => {
                    if (relationship.parent === comment.comment_id) {
                        comment.isParentOf = relationship.child;
                    }
                });
            }
        }

        comments.sort(sortComments);

        // Sort by relationships, one level of depth at a time
        relationships.sort((a,b) => {
            if (a.depth < b.depth) { return -1; }
            else { return 1; }
        });
        relationships.forEach(relationship => {
            // Find child, make copy, and delete from array
            let childIndex = comments.indexOf(comments.find(o => o.comment_id === relationship.child));
            let child = comments.find(o => o.comment_id === relationship.child);
            comments.splice(childIndex, 1);
            // Get parent index and add child back into array directly after
            let parentIndex = comments.indexOf(comments.find(o => o.comment_id === relationship.parent));
            comments.splice(parentIndex + 1, 0, child);
        });

        comments.forEach(comment => {
            engagement.inReplyTo.push(comment);
        });

        return engagement;

    } catch (err) {
        console.error(err);
        return null;
    }
}