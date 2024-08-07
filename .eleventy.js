require('dotenv').config();
const CleanCSS = require("clean-css");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image  = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {

    if (process.env.INCOMING_HOOK_BODY) console.log(JSON.stringify(process.env.INCOMING_HOOK_BODY));

    // General stuff
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addGlobalData('siteRoot', 'https://cascading.space');
    eleventyConfig.addPassthroughCopy('bin');
    eleventyConfig.addPassthroughCopy('img');

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
    eleventyConfig.addFilter('getMentionsForUrl', function(webmentions, url){
        let mentions = {};
        mentions.inReplyTo = webmentions.inReplyTo.filter(entry => entry['wm-target'] === url);
        mentions.likeOf = webmentions.likeOf.filter(entry => entry['wm-target'] === url);
        mentions.repostOf = webmentions.repostOf.filter(entry => entry['wm-target'] === url);
        mentions.others = webmentions.others.filter(entry => entry['wm-target'] === url);
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