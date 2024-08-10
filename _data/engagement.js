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
    if (a.created_at) aDate = new Date(a.created_at);

    if (b.published) bDate = new Date(b.published);
    if (b["wm-received"]) bDate = new Date(b["wm-received"]);
    if (b.created_at) bDate = new Date(b.created_at);

    return aDate - bDate;
}

function checkRedirects(target) {
    const redirects = [
        {
            from: 'https://cascading.space/post/165',
            to: 'https://cascading.space/post/proper-introductions-and-happy-blaugust'
        },
        {
            from: 'https://cascading.space/post/172',
            to: 'https://cascading.space/post/its-headless-👻'
        },
        {
            from: 'https://cascading.space/post/177',
            to: 'https://cascading.space/post/journals'
        },
        {
            from: 'https://cascading.space/post/194',
            to: 'https://cascading.space/post/eleventy-lessons-learned'
        },
        {
            from: 'https://cascading.space/post/200',
            to: 'https://cascading.space/post/a-saga-of-light-and-darkness'
        }
    ];
    if (redirects.find(o => o.from === target)) {
        return redirects.find(o => o.from === target).to;
    } else {
        return target;
    }
}

module.exports = async function(){
    const commentsurl = `https://api.netlify.com/api/v1/forms/${process.env.COMMENTS_FORM_ID}/submissions`;
    const url = `https://webmention.io/api/mentions.jf2?domain=cascading.space&token=${process.env.WEBMENTIONIO_TOKEN}`;
    
    try {
        const webmentionsresponse = await fetch(url);
        const commentsresponse = await fetch(commentsurl, {
            headers: {
                'User-Agent': 'Comment Collector for cascading.space',
                'Authorization': `Bearer ${process.env.NETLIFY_API_TOKEN}`
            }
        });
        if (webmentionsresponse.ok && commentsresponse.ok) {
            let webmentions = await webmentionsresponse.json();
            let comments = await commentsresponse.json();

            let engagement = {
                inReplyTo: [],
                likeOf: [],
                repostOf: [],
                others: []
            };

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

            let relationships = [];

            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i];
                // Set default data
                comment.dataSource = 'homemade';
                comment.targetUrl = checkRedirects('https://cascading.space' + comment.data.path);
                comment.data.avatar = comment.data.avatar ? comment.data.avatar : 'https://cascading.space/bin/img/blank-avatar.png';
                comment.data.url = comment.data.url ? comment.data.url : false;
                comment.nestingDepth = 1;
                comment.hasParent = false;
                comment.isParentOf = false;
                // Scan and record relationships
                if (Number(comment.data.parent) != 0) {
                    comment.hasParent = true;
                    comment.nestingDepth++;
                    if (comments.find(o => o.data.comment_id === comment.data.parent).data.parent != 0) {
                        comment.nestingDepth++;
                    }
                    relationships.push({
                        depth: comment.nestingDepth,
                        parent: comment.data.parent,
                        child: comment.data.comment_id
                    });
                }
                if (relationships.length) {
                    relationships.forEach(relationship => {
                        if (relationship.parent === comment.data.comment_id) {
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
                let childIndex = comments.indexOf(comments.find(o => o.data.comment_id === relationship.child));
                let child = comments.find(o => o.data.comment_id === relationship.child);
                comments.splice(childIndex, 1);
                // Get parent index and add child back into array directly after
                let parentIndex = comments.indexOf(comments.find(o => o.data.comment_id === relationship.parent));
                comments.splice(parentIndex + 1, 0, child);
            });

            comments.filter(comment => comment.data.pass === 'pickles').forEach(comment => {
                engagement.inReplyTo.push(comment);
            });

            return engagement;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}