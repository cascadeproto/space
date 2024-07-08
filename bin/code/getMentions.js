var path = window.location ? window.location.pathname : '/';
var API_URL = `https://webmention.io/api/mentions.jf2?target=https://cascading.space${path}`;

function sortByDate(a,b){
    if (a.published)
        return new Date(a.published) - new Date(b.published);
    else
        return new Date(a["wm-received"]) - new Date(b["wm-received"]);
}

async function showMentions() {
    const response = await fetch(API_URL);
    const data = await response.json();

    let inReplyTo = [], likeOf = [], repostOf = [], others = [];

    data.children.forEach(mention => {
        switch (mention["wm-property"]) {
            case "in-reply-to":
                inReplyTo.push(mention); inReplyTo.sort(sortByDate); break;
            case "like-of":
                likeOf.push(mention); likeOf.sort(sortByDate); break;
            case "repost-of":
                repostOf.push(mention); repostOf.sort(sortByDate); break;
            default:
                others.push(mention); others.sort(sortByDate); break;
        }
    });

    let repliesHTML = inReplyTo.length ? inReplyTo.map((i) => {
        return `<li class="comment h-entry">
            <div class="avatar h-card p-author">
                <a class="u-url" href="${i.author.url}" target="_blank">
                    <img class="u-photo" src="${i.author.photo}" alt="Avatar of ${i.author.name}" />
                    <span class="p-name visually-hidden">${i.author.name}</span>
                </a>
            </div>
            <article>
                <div class="e-content">
                    ${i.content.html}
                </div>
            </article>
            <div class="meta">
                By <a class="p-author" href="${i.author.url}" target="_blank">${i.author.name}</a> • 
                <a class="u-url" href="${i.url}" target="_blank">
                    Original post
                    <time class="dt-published visually-hidden" datetime="${i.published}">${i.published}</time>
                </a>
            </div>
        </li>`;
    }) : ``;
    let likesHTML = likeOf.length ? likeOf.map((i) => {
        return `<li class="like h-entry">
            <a class="h-card u-url" href="${i.author.url}" target="_blank">
                <img class="u-photo" src="${i.author.photo}" alt="Avatar of ${i.author.name}" />
                <span class="p-name p-author visually-hidden">${i.author.name}</span>
            </a>
        </li>`;
    }) : ``;
    let repostsHTML = repostOf.length ? repostOf.map((i) => {
        return `<li class="like h-entry">
            <a class="h-card u-url" href="${i.author.url}" target="_blank">
                <img class="u-photo" src="${i.author.photo}" alt="Avatar of ${i.author.name}" />
                <span class="p-name p-author visually-hidden">${i.author.name}</span>
            </a>
        </li>`;
    }) : ``;

    let mentionsHTML = `
        <form class="flow" id="webmention-form" method="post" action="https://webmention.io/cascading.space/webmention">
            <input type="hidden" name="target" value="${path}">
            <label for="reply-url">Have you written a response to this? Let me know the URL.</label>
            <div class="inputs">
                <input type="text" id="reply-url" name="source" placeholder="https://example.com/my-post">
                <button type="submit" id="webmention-submit">Send Webmention</button>
            </div>
        </form>
        <details class="explainer">
            <summary>The heck is all this?</summary>
            <p>The interactions shown here all came either from people posting on their own websites using <a href="https://indieweb.org/Webmention" target="_blank">webmentions</a>, or gathered from interactions on posts from Bluesky or Mastodon.</p>
        </details>
        <hr class="hard-break" />
        <details class="likes${!likeOf.length ? " empty" : ""}" open="">
            <summary>${likeOf.length} ${likeOf.length == 1 ? "Like" : "Likes"}</summary>
            <ul>${likesHTML.length ? likesHTML.join('') : ``}</ul>
        </details>
        <details class="reposts${!repostOf.length ? " empty" : ""}" open="">
            <summary>${repostOf.length} ${repostOf.length == 1 ? "Repost" : "Reposts"}</summary>
            <ul>${repostsHTML.length ? repostsHTML.join('') : ``}</ul>
        </details>
        ${inReplyTo.length ? `<h2>Comments</h2><ul class="replies">` : ``}
        ${repliesHTML.length ? repliesHTML.join('') : ``}
        ${inReplyTo.length ? `</ul>` : ``}
    `;

    document.querySelector("section.mentions").insertAdjacentHTML("beforeend", mentionsHTML);
}

showMentions();