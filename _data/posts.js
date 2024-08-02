// https://cdn.protogen.gg/wp-json/wp/v2/posts?per_page=100&author=4
// author=4 - Cascade author ID is 4.
// per_page=100 - WP API caps at 100. For more, I need to support pagination: (For posts AND for tags/categories)
// - There's two headers in the response (X-WP-Total and X-WP-TotalPages) that give the number of records, and how many pages it takes to see them all.
// - Won't be an issue until there's more than 100 records to put on the site - that'll be quite a while, if ever.
// More arguments and docs at: https://developer.wordpress.org/rest-api/reference/posts/

module.exports = async function(){
    const postUrl = `https://cdn.protogen.gg/wp-json/wp/v2/posts?per_page=100&author=4`;
    const tagUrl = `https://cdn.protogen.gg/wp-json/wp/v2/tags?per_page=100`;
    const categoryUrl = `https://cdn.protogen.gg/wp-json/wp/v2/categories?per_page=100`;


    function cleanHtml(rawHtml, endUrl){
        // Clean new lines
        let html = rawHtml;//.replaceAll(`\n`, ``); Maybe this isn't necessary - it breaks <code> and <pre> blocks to just wipe all newlines...
    
        // Clean images
        let images = [];
        let figureTags = /<figure(.*?)<\/figure>+/g;
        let imgRegex = /src="(.*?)"/g;
        let alttextRegex = /alt="(.*?)"/g;
        if (html.match(figureTags)) { // Check post for figures
            html.match(figureTags).forEach(function(figure, i){
                if (figure.match(imgRegex)) { // Check figures for sources
                    if (figure.match(alttextRegex)) { // Check images for alt text
                        let alt = figure.match(alttextRegex)[0].slice(5, -1);
                        let url = figure.match(imgRegex)[0].slice(5, -1);
                        images.push({
                            post: endUrl, // URL the page will live at
                            imageId: i, // ID of image on page
                            src: url, // URL of remote image
                            alt: alt // Alt text for image
                        });
                        html = html.replace(figure, `<img data-transform="true" src="${url}" alt="${alt}" />`);
                    }
                }
            });
        }
    
        return {
            html: html,
            images: images
        };
    }
    
    try {
        const postResponse = await fetch(postUrl);
        const tagResponse = await fetch(tagUrl);
        const categoryResponse = await fetch(categoryUrl);
        
        if (postResponse.ok && tagResponse.ok && categoryResponse.ok) {
            const content = await postResponse.json();
            const tags = await tagResponse.json();
            const categories = await categoryResponse.json();

            function getList(group, ids){
                let list = [];
                ids.forEach(function(id){
                    let currentId = group.find(o => o.id === id);
                    list.push(currentId.name);
                });
                return list;
            }

            let posts = [];
            content.forEach(post => {
                let url = `https://cascading.space/post/${post.id}/index.html`;
                let newPost = {
                    id: post.id,
                    date: new Date(post.date_gmt),
                    modified: new Date(post.modified_gmt),
                    slug: post.slug === '...' ? '' : post.slug,
                    title: post.title.rendered,
                    content: cleanHtml(post.content.rendered, url).html,
                    images: cleanHtml(post.content.rendered, url).images,
                    excerpt: cleanHtml(post.excerpt.rendered),
                    tags: getList(tags, post.tags),
                    categories: getList(categories, post.categories)
                };
                posts.push(newPost);
            });

            console.log(posts);

            return posts;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}