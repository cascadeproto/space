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
            const webmentions = await webmentionsresponse.json();
            const comments = await commentsresponse.json();

            let engagement = {
                inReplyTo: [],
                likeOf: [],
                repostOf: [],
                others: []
            };

            webmentions.children.forEach(mention => {
                mention.dataSource = 'webmentions';
                switch (mention["wm-property"]) {
                    case "in-reply-to":
                        engagement.inReplyTo.push(mention); engagement.inReplyTo.sort(sortComments); break;
                    case "like-of":
                        engagement.likeOf.push(mention); engagement.likeOf.sort(sortByDate); break;
                    case "repost-of":
                        engagement.repostOf.push(mention); engagement.repostOf.sort(sortByDate); break;
                    default:
                        engagement.others.push(mention); engagement.others.sort(sortByDate); break;
                }
            });

            comments.forEach(comment => {
                comment.dataSource = 'homemade';
                comment[wm-target] = 'https://cascading.space' + comment.data.path;
                engagement.inReplyTo.push(comment);
                engagement.inReplyTo.sort(sortComments);
            });

            console.log(engagement);

            return engagement;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}