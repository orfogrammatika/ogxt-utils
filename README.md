ogxt-utils
==========

OGXT file format utils

## installation ##

```bash
npm install --save orfogrammatika/ogxt-utils
yarn add orfogrammatika/ogxt-utils
```

## convert html to ogxt ##

```javascript
var utils = require('ogxt-utils');

var ogxt = utils.html2ogxt(html);
```

```typescript
import { html2ogxt } from 'ogxt-utils';

const ogxt = html2ogxt(html);
```

## inject annotations \<spans\> into the html ##

```javascript
var utils = require('ogxt-utils');

var annotations = {}; // object received after check

var annotatedHtml = utils.annotate(html, annotations);
```

```typescript
import { annotate } from 'ogxt-utils';

const annotations = {}; // object received after check

const annotatedHtml = annotate(html, annotations);
```

## cleanup annotations \<spans\> from the html ##

```javascript
var utils = require('ogxt-utils');

var cleanHtml = utils.cleanupAnnotations(html);
```

```typescript
import { cleanupAnnotations } from 'ogxt-utils';

const cleanHtml = cleanupAnnotations(html);
```

## webpack demonstration project ##

* demo
  - [https://orfogrammatika.github.io/ogxt-utils-webpack-demo/](https://orfogrammatika.github.io/ogxt-utils-webpack-demo/)
* sources
  - [orfogrammatika/ogxt-utils-webpack-demo: ogxt-utils demo project](https://github.com/orfogrammatika/ogxt-utils-webpack-demo)

