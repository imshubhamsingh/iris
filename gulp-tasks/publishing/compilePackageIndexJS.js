const gulp = require('gulp');
const rename = require('gulp-rename');
const template = require('gulp-template');
const config = require('../../config');

// Build a list of the components for export from Iris.
gulp.task('compilePackageIndexJS', function () {
	let patternData = require(config.paths.localData + 'componentAPITransformed.json');
	patternData = {"patterns": [patternData]};
	return gulp.src('./templates/_package-index.js.template')
	.pipe(template(patternData))
	.pipe(rename('index.ts'))
	.pipe(gulp.dest('src'));
});
