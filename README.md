# eleventy-plugin-sharp

**npm**: `npm i eleventy-plugin-sharp`  

Inspired by the [Craft CMS image transform API](https://craftcms.com/docs/3.x/image-transforms.html).  
This plugin gives you the full power of the [sharp](https://sharp.pixelplumbing.com/) library in your [11ty](https://www.11ty.dev/) templates.

## Usage

```js
// .eleventy.js
const sharpPlugin = require('eleventy-plugin-sharp');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(sharpPlugin({
    urlPath: '/images',
    outputDir: 'public/images'
  }));
};
```

## Filters

Filters are used to build up the Sharp instance. Pretty much all the methods that the [Sharp API](https://sharp.pixelplumbing.com/api-constructor) provides can be called. [`output options`](https://sharp.pixelplumbing.com/api-output), [`resizing`](https://sharp.pixelplumbing.com/api-resize), [`operations`](https://sharp.pixelplumbing.com/api-operation), [`colour`](https://sharp.pixelplumbing.com/api-colour), etc.

## Shortcodes

In addition shortcodes are used to execute the async functions of Sharp, something filters don't support.

- `getUrl(instance)` Saves the image to disk and gets the url.
- `getWidth(instance)` Gets the width of the saved image.
- `getHeight(instance)` Gets the height of the saved image.


## Example

```njk
{% set image = "/images/zen-pond.jpg" | sharp %}

<picture>
    <source srcset="{% getUrl image | resize({ width: 1440, height: 460 }) %} 1x, {% getUrl image | resize({ width: 2560, height: 800 }) %} 2x" media="(min-width: 640px)">
    <img class="articleHero-image" srcset="{% getUrl image | resize({ width: 640, height: 320 }) %} 1x, {% getUrl image | resize({ width: 1280, height: 640 }) %} 2x" alt="{{ image.title }}">
</picture>
```


## Another example

```njk
{% set bannerImage = featuredImage.url | webp | resize(1440, 460) %}

{% getUrl bannerImage %}
{% getWidth bannerImage %}
{% getHeight bannerImage %}
```
