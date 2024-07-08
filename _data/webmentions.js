function sortByDate(a,b){
    if (a.published)
        return new Date(a.published) - new Date(b.published);
    else
        return new Date(a["wm-received"]) - new Date(b["wm-received"]);
}

module.exports = async function(){
    const url = `https://webmention.io/api/mentions.jf2?domain=cascading.space&token=${process.env.WEBMENTIONIO_TOKEN}`;
    
    try {
        const response = await fetch(url);
        if (response.ok) {
            const feed = await response.json();

            let mentions = {
                inReplyTo: [],
                likeOf: [],
                repostOf: [],
                others: []
            };

            feed.children.forEach(mention => {
                switch (mention["wm-property"]) {
                    case "in-reply-to":
                        mentions.inReplyTo.push(mention); mentions.inReplyTo.sort(sortByDate); break;
                    case "like-of":
                        mentions.likeOf.push(mention); mentions.likeOf.sort(sortByDate); break;
                    case "repost-of":
                        mentions.repostOf.push(mention); mentions.repostOf.sort(sortByDate); break;
                    default:
                        mentions.others.push(mention); mentions.others.sort(sortByDate); break;
                }
            });

            return mentions;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}