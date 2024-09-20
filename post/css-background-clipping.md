---
title: Background Clipping
tags: [css, tutorial, snippet, background]
excerpt: 'A neat effect to use text as a window to the universe!'
bskyLink: ''
mastoLink: ''
reply: ''
like: ''
repost: ''
date: 2024-09-20
category: Article
---

# Background Clipping

There's a little-used property in CSS called `background-clip`. There's many other properties that adjust how backgrounds look. These can let you do things like change the color, add images, resize them, move them around, etc. What `background-clip` focuses on is where the edges of the viewable background are trimmed.

In it's usual use cases, you give it CSS box model values like `content-box` or `border-box`, which cut off the background right where the edges of the content are and where the outside edges of the border are, respectively. For all the possible values, check a source like [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip#syntax).

The one I wanted to highlight here is a bit of a outlier compared to the other box model values. Setting `background-clip: text` will trim the viewable background all the way down to where the edges of the text letters are. As is, it will look like the thing doesn't have a background at all - but if you also set the text color to be `transparent`, then you can see "through" the text to the background behind! <sup><a href="#fn:1" id="fnref:1" rel="footnote">[1]</a></sup>

<div class="demoarea">
<p class="specialtext">OOH LOOKIT!<p>
</div>

```css
p {
    background-image: url('background-image.jpg');
    background-clip: text;
    color: transparent;
}
```

Here's a bonus trick as well, while we're here. You can adjust that background with all the usual background-related properties - including keeping the image fixed to the viewport. Add one line and the image will appear to move behind the text as you scroll, giving an extra dimension to the window illusion!

<div class="demoarea">
<p class="specialtext extra">HOW FANCY!</p>
</div>

```css
p {
    background-image: url('background-image.jpg');
    background-clip: text;
    background-attachment: fixed;
    color: transparent;
}
```

## Compatibility and Accessibility

As always, think about accessibility as part of your designs. If you use this method, make sure to choose a combination of image, background color, and font/font size that will make sure it remains readable, and with enough color contrast. Automated tools are especially bad at figuring out color contrast when an image is involved, so some human double-checking will definitely be needed in cases like these. Choosing a nice think block font and whacking the size way up always helps as well.

Both `background-clip` and `background-attachment` are pretty well supported across the board. But in the spirit of not being too careful, we should put these sorts of less common CSS methods behind an [`@supports` rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) - this will make sure the browser actually understands the property, and at the same time keep the newer, funkier rules out of sight and out of mind for older browsers. If they don't know what `@supports` does, nothing in that block will run at all, letting you put together a functional fallback style.

```css
p {
    color: #ddd;
}
@supports (background-clip: text) {
    p {
        background-image: url('background-image.jpg');
        background-clip: text;
        background-attachment: fixed;
        color: transparent;
    }
}
```

Lastly, I discovered that there's [reports of a bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1543117) [or two](https://bugzilla.mozilla.org/show_bug.cgi?id=1313757) [specific to Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1545128) that come into play once `background-clip: text` and `background-attachment: fixed` are both involved. While I don't _officially_  recommend hacks, you can usually make sure that Firefox users get the fallback version instead of the busted one with some more `@supports` trickery:

```css
p {
    color: #ddd;
}
@supports (background-clip: text) {
    p {
        background-image: url('background-image.jpg');
        background-clip: text;
        background-attachment: fixed;
        color: transparent;
    }
}
@supports (-moz-appearance: none) {
    p {
        background-attachment: revert;
    }
}
```

So, Firefox users, if you were confused about the "How fancy!" demo above being, in fact, equally as fancy as the first one, that would be why. It's set `background-attachment` back to what it was at first, so that it looks as good as it's currently capable of looking for you. Credit for this particular hack goes to [laaposto](https://stackoverflow.com/a/32455002) on StackOverflow. To clarify what's going on, `-moz-` is a [vendor prefix](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) - a way for Firefox to try pushing new features without breaking anything CSS was normally doing. Theoretically, only Firefox recognizes properties that start with `-moz-`.<sup><a href="#fn:2" id="fnref:2" rel="footnote">[2]</a></sup> Now that we're in an era where vendor prefixes aren't much of a thing anymore, there's something kinda nice about those old things still being useful, even in a ghost-form like this.

<style>
    .demoarea {
        background-color: #121212;
        border-image:  url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAVKADAAQAAAABAAAAVAAAAAC3aM1AAAAB7klEQVR4Ae3cUUoDMRSFYav7EbcjLk+K23FDik1BuLRN6CHnJpnO36eY3jkm32QggaGHp8U+798fP8+nTxnW7+nz9XZ8aQ1RrW9lOb47D9wR5Mr4xyx5sV3LjzWxXavP7l8ONHvC2fmAmoUBBdQsYI5jhe4JtGyblPmq9Ur2vbWHewuz6uI+svyP4+tnc0xqfda4a7nTH3l176jW1yae1T8dNGtis3IBNcsDCqhZwBzHCgXULGCOY4UCahYwx7FCHxlUPYur9Wa7m3HNc/PNKzo71bO4Wt85vO7Lhz/y6llcre8W6QwYDto53uUvB9R8iwAF1CxgjmOFbh007h1juzavWBPbtXr6EUAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEErgWGv2N/PYR2T3zHvrwstvrvOC3/OmN8xz62a7ch1sR2rd7dvzyoe8LZeYCahQEF1CxgjmOF7hlUfcderXfYLrcPjfvOMsGt/Y7Tco+8undU6x2rsJWxHGhrsFv4DlDzXQIUULOAOY4VCqhZwBzHCgXULGCOY4XuCVQ9i6v1Zstz3PSz/NbP7pc3Zfojr57F1frLCWf/PR00e4Kj8wE1iwMKqFnAHMcKfTTQuHeM7do8Y01s1+pH9/8B4lCAazDT1iQAAAAASUVORK5CYII=") 28 / 28px / 0 round;
        border-width: 28px;
        border-style: solid;
        position: relative;
        padding: 2em 0;
        &::before, &::after {
            content: 'DEMO';
            display: block;
            position: absolute;
            left: -25px; top: -28px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 30px;
            line-height: 28px;
            color: #00ffa0;
            color: color(srgb 0.3568 0.8235 0.3647);
            background-color: #121212;
            padding-inline: 0 10px;
        }
        &::after {
            content: 'END DEMO';
            left: unset; right: -25px;
            top: unset; bottom: -28px;
            padding-inline: 10px 0;
        }
    }
    @supports (background-clip: text) {
        .specialtext {
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
            font-size: 8em;
            font-weight: bold;
            background-color: #ddd;
            background-image: url('/bin/img/unsplash-rivers-mountains-by-Nathan-Queloz.jpg');
            background-clip: text;
            color: transparent;
        }
        .extra {
            background-attachment: fixed;
        }
    }
    @supports (-moz-appearance: none) {
        .extra {
            background-attachment: initial;
        }
    }
</style>

## Footnotes and Credits

<ol class="footnotes">
<li><p id="fn:1">Example photo by <a href="https://unsplash.com/@nathan030997?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Nathan Queloz</a> on <a href="https://unsplash.com/photos/a-painting-of-a-river-running-through-a-rocky-area-b75_hLFriqE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>. <a href="#fnref:1">↩</a></p></li>
<li><p id="fn:2">Safari has a similar one with <code>-webkit-</code>. Internet Explorer and Opera had their own prefixes back in the day too. <a href="#fnref:2">↩</a></p></li>
</ol>


