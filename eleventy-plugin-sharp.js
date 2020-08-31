const path = require('path');
const sharp = require('sharp');
const debug = require('debug')('EleventyPluginSharp');

const exclude = [
  'clone',
  'metadata',
  'stats',
  'trim', // trim is a built-in filter for most templating languages
  'toFile',
  'toBuffer',
];

const forwardMethods = Object.keys(sharp.prototype).filter((method) => {
  return !method.startsWith('_') && !exclude.includes(method);
});

const globalOptions = {
  urlPath: '/images',
  outputDir: 'public/images',
};

function createSharpPlugin(options) {
  options = Object.assign({}, globalOptions, options);

  return function sharpPlugin(eleventyConfig) {
    /**
     * Sharp filters
     */
    eleventyConfig.addFilter('sharp', sharp);

    forwardMethods.forEach((method) => {
      eleventyConfig.addFilter(method, function (instance, ...args) {
        if (typeof instance === 'string') instance = sharp(instance);
        return instance[method](...args);
      });
    });

    eleventyConfig.addFilter('toFile', function (instance, fileOut) {
      if (typeof instance === 'string') instance = sharp(instance);
      instance.fileOut = fileOut;
      return instance;
    });

    /**
     * Async shortcodes
     */
    eleventyConfig.addAsyncShortcode('getUrl', async function (instance) {
      if (!instance.fileOut) {
        instance.fileOut = path.join(
          options.outputDir,
          createFileOutName(instance.options)
        );
      }

      debug('Writing %o', instance.fileOut);
      await instance.toFile(instance.fileOut);
      return path.join(options.urlPath, path.basename(instance.fileOut));
    });

    eleventyConfig.addAsyncShortcode('getWidth', async function (instance) {
      const metadata = await getMetadata(instance);
      return `${metadata.width}`;
    });

    eleventyConfig.addAsyncShortcode('getHeight', async function (instance) {
      const metadata = await getMetadata(instance);
      return `${metadata.height}`;
    });

    eleventyConfig.addAsyncShortcode('getMetadata', getMetadata);

    function getMetadata(instance) {
      if (typeof instance === 'string') instance = sharp(instance);
      return instance.metadata();
    }

    eleventyConfig.addAsyncShortcode('getStats', function (instance) {
      if (typeof instance === 'string') instance = sharp(instance);
      return instance.stats();
    });
  };
}

/**
 * Adds a postfix to the file out name.
 * @param  {Object} options
 * @return {String}
 */
function createFileOutName(opts) {
  const { width, height, formatOut } = opts;

  let postfix = '';
  if (width > 0 || height > 0) {
    if (width) {
      postfix += width;
      if (height) postfix += 'x';
    }
    if (height) {
      postfix += height;
      if (!width) postfix += 'h';
    }
  }
  if (postfix) postfix = `-${postfix}`;

  const input = opts.input.file;
  const extname = formatOut === 'input' ? path.extname(input) : `.${formatOut}`;
  const basename = path.basename(input, path.extname(input));

  return `${basename}${postfix}${extname}`;
}

module.exports = createSharpPlugin;
