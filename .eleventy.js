require('dotenv').config();
const CleanCSS = require("clean-css");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image  = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {

    // if (process.env.INCOMING_HOOK_BODY.post.post_status) {
    //     if (process.env.INCOMING_HOOK_BODY.post.post_status == 'publish') {
    //         console.log('New post published with ID ' + process.env.INCOMING_HOOK_BODY.post_id);

    //         // Use this hook to create posts on bluesky/mastodon and get post URLs to embed in post on build
    //         // Mastodon: 10/10 - The method to post a status returns an object that includes the new status URL.
    //         // Bluesky: 7/10 - The returned object has a "uri" string, and the post ID is at the end of it, needs to be parsed. Example:
    //         //                 https://bsky.social/xrpc/com.atproto.repo.getRecord?repo=cascading.space&collection=app.bsky.feed.post&rkey=3kz56gjn74c2f
    //         //                 Will need to construct the post URL with that: `https://bsky.app/profile/cascading.space/post/${post_id}`
    //         //                 Maybe I need to build the embed card manually as well?
    //     }
    // }

    if (process.env.INCOMING_HOOK_BODY) {
        console.log('Hook title: ' + process.env.INCOMING_HOOK_TITLE);
        console.log('Hook URL: ' + process.env.INCOMING_HOOK_URL);
        console.log('Hook body: ');
        console.log(process.env.INCOMING_HOOK_BODY);
    }

    // General stuff
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addGlobalData('siteRoot', 'https://cascading.space');
    eleventyConfig.addPassthroughCopy('bin');
    eleventyConfig.addPassthroughCopy('img');
    eleventyConfig.addPassthroughCopy('.well-known');

    // Combining the dates from front matter and the dates from
    // APIs to make new, sorted collections
    function mixedSort(a,b){
        const timeA = a.data.post ? a.data.post.date.getTime() : a.data.page.date;
        const timeB = b.data.post ? b.data.post.date.getTime() : b.data.page.date;
        return timeB - timeA; // Most recent at the top
    }
    eleventyConfig.addCollection('alleverything', collection => {
        return collection.getAll().sort(mixedSort);
    });
    eleventyConfig.addCollection('allarticles', collection => {
        return collection.getFilteredByTag('post').sort(mixedSort);
    });

    // Add filters 
    eleventyConfig.addFilter('getMentionsForUrl', function(engagement, url){
        let mentions = {};
        mentions.inReplyTo = engagement.inReplyTo.filter(entry => entry.targetUrl === url);
        mentions.likeOf = engagement.likeOf.filter(entry => entry.targetUrl === url);
        mentions.repostOf = engagement.repostOf.filter(entry => entry.targetUrl === url);
        mentions.others = engagement.others.filter(entry => entry.targetUrl === url);
        return mentions;
    });
    eleventyConfig.addFilter("cssmin", function(code){
        return new CleanCSS({}).minify(code).styles;
    });
    eleventyConfig.addFilter('stringify', function(obj){
        return JSON.stringify(obj, null, '\t');
    });
    eleventyConfig.addFilter("excerpt", (post) => {
        const content = post.replace(/(<([^>]+)>)/gi, "");
        return content;//.substr(0, content.lastIndexOf(" ", 200)) + "...";
    });

    eleventyConfig.addTransform('imgTransform', async function(content){
        const imgRegex = /<img(.*?)>/gs;
        const srcRegex = /src="(.*?)"/g;
        const alttextRegex = /alt="(.*?)"/g;
        const classesRegex = /class="(.*?)"/g;
        const usageRegex = /usage="(.*?)"/g;
        const captionRegex = /data-caption="(.*?)"/g;
        if (this.page.outputFileExtension == 'html') {
            console.log('Scanning: ' + this.page.outputPath);
            if (content.match(imgRegex)) {
                let matches = content.match(imgRegex);
                let newContent = content;

                // Future note: A forEach loop wasn't working. forEach isn't asyncronous, so
                // the return statement wasn't waiting for the Promises within to resolve. A
                // plain for loop saved the day!
                for (let i = 0; i < matches.length; i++) {
                    if (!matches[i].match('notransform')) {
                        let widths = ['auto'];
                        let usage = '';
                        let classes = '';
                        let src = matches[i].match(srcRegex)[0].slice(5, -1);
                        let alt = matches[i].match(alttextRegex)[0].slice(5, -1);
                        if (matches[i].match(classesRegex)) {
                            classes = matches[i].match(classesRegex)[0].slice(7, -1);
                        }
                        if (src.match('system/cache/custom_emoji')) {
                            widths = [25];
                            usage = 'emoji';
                        }
                        if (matches[i].match(usageRegex)) {
                            usage = matches[i].match(usageRegex)[0].slice(7, -1);
                        }
                        let metadata = await Image(src, {
                            formats: ['webp', 'jpeg'],
                            widths: widths,
                            urlPath: '/bin/img',
                            outputDir: './__static/bin/img'
                        });
                        let attributes = {
                            alt,
                            usage,
                            class: classes,
                            loading: 'lazy',
                            decoding: 'async'
                        };
                        let caption = matches[i].match(captionRegex) ? matches[i].match(captionRegex)[0].slice(14, -1) : '';
                        let captionOpening = matches[i].match(captionRegex) ? `<figure>` : '';
                        let captionClosing = matches[i].match(captionRegex) ? `<figcaption>${caption}</figcaption></figure>` : '';
                        newContent = newContent.replace(matches[i], `${captionOpening}${Image.generateHTML(metadata, attributes)}${captionClosing}`);
                    } else {
                        let noTransform = matches[i].replace('notransform', '');
                        newContent = newContent.replace(matches[i], noTransform);
                    }
                }
                
                return newContent;
            } else {
                return content;
            }
        } else {
            return content;
        }
    });

    return {
        dir: {
            output: "__static",
        },
    };
};