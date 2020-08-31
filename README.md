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
    outputDir: 'public/images'
  }));
};
```


```njk
{% set image = "/images/zen-pond.jpg" | sharp %}

<picture>
    <source srcset="{% getUrl image | resize({ width: 1440, height: 460 }) %} 1x, {% getUrl image | resize({ width: 2560, height: 800 }) %} 2x" media="(min-width: 640px)">
    <img class="articleHero-image" srcset="{% getUrl image | resize({ width: 640, height: 320 }) %} 1x, {% getUrl image | resize({ width: 1280, height: 640 }) %} 2x" alt="{{ image.title }}">
</picture>
```
