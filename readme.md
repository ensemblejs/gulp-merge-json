# gulp-concat-json

A plugin for Gulp to deep merge supplied files against a base set. I built this because we have a set of il8n files (en.json, fr.json) that [ensemblejs](http://ensemblejs.com) uses. We also want consumers of ensemblejs to be able to supply their own translations and have those take precedence.

## Usage

First, install `gulp-merge-json` as a development dependency:

```shell
npm i gulp-mege-json -D
```

Then, add it to your `gulpfile.js`:

```javascript
var mergeJson = require('gulp-merge-json');

gulp.src('path/to/input/*.json')
  .pipe(mergeJson('path/to/base/json'))
  .pipe(gulp.dest('path/to/out'));
```