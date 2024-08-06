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
    const mediaUrl = `https://cdn.protogen.gg/wp-json/wp/v2/media?per_page=100&author=4`;


    function cleanHtml(rawHtml, endUrl){
        // Clean new lines
        let html = rawHtml;//.replaceAll(`\n`, ``); Maybe this isn't necessary - it breaks <code> and <pre> blocks to just wipe all newlines...
    
        // Clean images
        let images = [];
        let figureTags = /<figure(.*?)<\/figure>+/g;
        let imgRegex = /src="(.*?)"/g;
        let alttextRegex = /alt="(.*?)"/g;
        let titleRegex = /title="(.*?)"/g;
        let classRegex = /class="(.*?)"/g;
        if (html.match(figureTags)) { // Check post for figures
            html.match(figureTags).forEach(function(figure, i){
                if (figure.match(imgRegex)) { // Check figures for sources
                    if (figure.match(alttextRegex)) { // Check images for alt text
                        let alt = figure.match(alttextRegex)[0].slice(5, -1);
                        let url = figure.match(imgRegex)[0].slice(5, -1);
                        // This will get the FIRST set of classes, the ones on the <figure> tag itself. Since these are the ones WP lets you add to, this should be fine.
                        let classes = figure.match(classRegex) ? figure.match(classRegex)[0].slice(7, -1) : '';
                        let caption = figure.match(titleRegex) ? figure.match(titleRegex)[0].slice(7, -1) : '';
                        images.push({
                            post: endUrl, // URL the page will live at
                            imageId: i, // ID of image on page
                            src: url, // URL of remote image
                            alt: alt, // Alt text for image
                            classes: classes,
                            caption: caption
                        });
                        html = html.replace(figure, `<img data-transform="true" src="${url}" alt="${alt}" class="${classes}" data-caption="${caption}" />`);
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
        const mediaResponse = await fetch(mediaUrl);
        
        if (postResponse.ok && tagResponse.ok && categoryResponse.ok && mediaResponse.ok) {
            const content = await postResponse.json();
            const tags = await tagResponse.json();
            const categories = await categoryResponse.json();
            const media = await mediaResponse.json();

            function getList(group, ids){
                let list = [];
                ids.forEach(function(id){
                    let currentId = group.find(o => o.id === id);
                    list.push(currentId.name);
                });
                return list;
            }

            function getMediaUrl(id){
                let mediaItem = media.find(o => o.id === id);
                return {
                    url: mediaItem.source_url,
                    alttext: mediaItem.alt_text,
                    width: mediaItem.media_details.sizes.full.width,
                    height: mediaItem.media_details.sizes.full.height
                }
            }

            let posts = {
                notes: [],
                articles: [],
                comics: [],
                images: [],
                likes: [],
                quotes: [],
                recipes: [],
                replies: [],
                reposts: []
            };
            content.forEach(post => {
                let url = `https://cascading.space/post/${post.id}/index.html`;
                let newHtml = cleanHtml(post.content.rendered, url);
                let newPost = {
                    id: post.id,
                    date: new Date(post.date_gmt),
                    modified: new Date(post.modified_gmt),
                    slug: post.slug === '...' ? '' : post.slug,
                    title: post.title.rendered,
                    content: newHtml.html,
                    images: newHtml.images,
                    excerpt: cleanHtml(post.excerpt.rendered).html,
                    tags: getList(tags, post.tags),
                    category: getList(categories, post.categories)[0],
                    featuredImage: post.featured_media ? getMediaUrl(post.featured_media).url : false
                };
                switch (newPost.category) {
                    case 'Note':
                        posts.notes.push(newPost); break;
                    case 'Article':
                        posts.articles.push(newPost); break;
                    case 'Comic':
                        posts.comics.push(newPost); break;
                    case 'Image':
                        posts.images.push(newPost); break;
                    case 'Like':
                        posts.likes.push(newPost); break;
                    case 'Quote':
                        posts.quotes.push(newPost); break;
                    case 'Recipe':
                        posts.recipes.push(newPost); break;
                    case 'Reply':
                        posts.replies.push(newPost); break;
                    case 'Repost':
                        posts.reposts.push(newPost); break;
                    default:
                        console.log('Uncategorized post found with ID ' + newPost.id + ':');
                        console.log('Title: ' + newPost.title);
                        break;
                }
            });

            console.log(posts);

            return posts;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}