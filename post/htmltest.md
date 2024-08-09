---
title: HTML Test
eleventyExcludeFromCollections: true
---

# Test post (Heading 1)

The purpose of this HTML is to help determine what default settings are with CSS and to make sure that all possible HTML Elements are included in this HTML so as to not miss any possible Elements when designing a site.

## Heading 2 {#header-id}
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Paragraph

Lorem ipsum dolor sit amet, [test link](https://example.com/) adipiscing elit. Nullam dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu volutpat enim diam eget metus. Maecenas ornare tortor. Donec sed tellus eget sapien fringilla nonummy. Mauris a ante. Suspendisse quam sem, consequat at, commodo vitae, feugiat in, nunc. Morbi imperdiet augue quis tellus.

<img src="https://cascading.space/bin/img/animation.gif" alt="Alt text" class="pixel" width="200">

Lorem ipsum dolor sit amet, emphasis consectetuer adipiscing elit. Nullam dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt nec, gravida vehicula, nisl. Praesent mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu volutpat enim diam eget metus. Maecenas ornare tortor. Donec sed tellus eget sapien fringilla nonummy. Mauris a ante. Suspendisse quam sem, consequat at, commodo vitae, feugiat in, nunc. Morbi imperdiet augue quis tellus.[^1]

## List Types

### Definition List

Definition List Title
: This is a definition list division.

### Ordered List

1. List Item 1
2. List Item 2
3. List Item 3

### Unordered List

- List Item 1
- List Item 2
- List Item 3

### Tables

| Table Header 1 | Table Header 2 | Table Header 3 |
| -------------- | -------------- | -------------- |
| Division 1     | Division 2     | Division 3     |
| Division 1     | Division 2     | Division 3     |
| Division 1     | Division 2     | Division 3     |

### Misc Stuff – abbr, acronym, pre, code, sub, sup, etc.

Lorem ^superscript^ dolor ~subscript~ amet, consectetuer adipiscing elit. Nullam dignissim convallis est. Quisque aliquam. *italics*. Nunc iaculis **bold** dui. ~~Strikethrough~~. Aliquam ***both*** nisi, imperdiet at, tincidunt nec, gravida vehicula, nisl. ==Highlight==, massa quis luctus fermentum, turpis mi volutpat justo, eu volutpat enim diam eget metus. Maecenas ornare tortor. Donec sed tellus eget sapien fringilla nonummy. <acronym title="National Basketball Association">NBA</acronym> Mauris a ante. Suspendisse quam sem, consequat at, commodo vitae, feugiat in, nunc. Morbi imperdiet augue quis tellus. AVE

```
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam dignissim convallis est. Quisque aliquam. Donec faucibus. 
Nunc iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt nec, gravida vehicula, nisl. 
Praesent mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu volutpat enim diam eget metus. Maecenas ornare tortor. 
Donec sed tellus eget sapien fringilla nonummy. 
Mauris a ante. Suspendisse quam sem, consequat at, commodo vitae, feugiat in, nunc. Morbi imperdiet augue quis tellus.  
```

> “This stylesheet is going to help so freaking much.”
> -Blockquote

[^1]: Footnote content.


<h2>Reply!</h2>
<form class="new-comment flow" name="new-comment" netlify netlify-honeypot="sugaa" style="border: 1px solid black;">
  <div class="visually-hidden">
    <input name="sugaa" />
  </div>
  <input type="hidden" name="path" value="{{ page.url }}" />
  <input type="hidden" name="parent" value="0" />
  <input type="hidden" name="commentId" class="commentId" />
  <p><label>Your name
    <input type="text" name="name" required placeholder="Cascade" />
  </label></p>
  <p><label>Your website or social
    <input type="text" name="url" placeholder="https://cascading.space" />
  </label></p>
  <p><label>Link to avatar
    <input type="text" name="avatar" placeholder="https://cascading.space/bin/img/cascade-icon.jpeg" />
  </label></p>
  <p><label>Comment
    <textarea name="comment" required placeholder="Comment here..."></textarea>
  </label></p>
  <p><button type="submit">Send</button></p>
</form>
<script>
  function newId(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    document.querySelector('form.new-comment .commentId').value = newId();
    const data = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    })
      .then(() => console.log('Form submitted!'))
      .catch((error) => alert(error));
  };
  document.querySelector('form.new-comment').addEventListener('submit', handleSubmit);
</script>