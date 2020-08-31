# eleventy-plugin-sharp

**npm**: `npm i eleventy-plugin-sharp`  

Inspired by the [Craft CMS image transform API](https://craftcms.com/docs/3.x/image-transforms.html).  
This plugin gives you the full power of the awesome [sharp](https://sharp.pixelplumbing.com/) library in your [11ty](https://www.11ty.dev/) templates.


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

- `getUrl(instanceOrFilepath)` Saves the image to disk and gets the url.
- `getWidth(instanceOrFilepath)` Gets the width of an image.
- `getHeight(instanceOrFilepath)` Gets the height of an image.
- `getMetadata(instanceOrFilepath)` Gets the metadata of an image.
- `getStats(instanceOrFilepath)` Gets the stats of an image.


## Responsive images using `<picture>`

The `sharp` filter is optional if the input file is followed by any Sharp transform.

```njk
{% set image = "src/images/zen-pond.jpg" | sharp %}

<picture>
  <source srcset="{% getUrl image | resize({ width: 1440, height: 460 }) | webp %} 1x, {% getUrl image | resize({ width: 2560, height: 800 }) | webp %} 2x" media="(min-width: 640px)">
  <source srcset="{% getUrl image | resize({ width: 640, height: 320 }) | webp %} 1x, {% getUrl image | resize({ width: 1280, height: 640 }) | webp %} 2x">
  <source srcset="{% getUrl image | resize({ width: 1440, height: 460 }) %} 1x, {% getUrl image | resize({ width: 2560, height: 800 }) %} 2x" media="(min-width: 640px)">
  <img class="articleHero-image" srcset="{% getUrl image | resize({ width: 640, height: 320 }) %} 1x, {% getUrl image | resize({ width: 1280, height: 640 }) %} 2x" alt="{{ image.title }}">
</picture>
```


## Get the dimensions of a saved image w/ custom output filepath

```njk
{% set bannerImage = "src/images/zen-pond.jpg" | resize(1440, 460) | toFile("public/images/custom-name.webp") %}

{% getUrl bannerImage %}
{% getWidth bannerImage.fileOut %}
{% getHeight bannerImage.fileOut %}
```
