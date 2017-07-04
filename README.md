# Biosentiers Landing Page

This repoitory contains the source code for the landing page of the BioSentiers project.

# Gulp Tasks

## `less`

Compiles the `agency.less` files from the `sources/less` directory, and put the resulting `agency.css` file in the `sources/css/` directory.

## `minify-css`

Takes the `agency.css` file from the directory `sources/css`, minify it and put the resulting `agency.min.css` file in the `css` directory.

## `minify-js`

Takes all `.js` files from the `sources/js` directory, minify them and put the resulting `*.min.js` files in the `js` directory.

## `copy`

Copies all relevant libraries from there `node_modules` directory to the `vendor` directory.

## `browserSync`

Starts a browserSync instance from the `/` directory.

## `compile`

Combines the `less`, `minify-css` and `minfy-js` tasks.

## `build`

Uses the `compile` task, then copy all mandatory files for production and put them in a `dist` folder, that can be deploy on the remote server.

## `prod`

Uses the `build` task, then starts a browserSync instance from the `dist` directory.
**This is useful to test the site with only the `dist` files, and see if anything is missing.**

## `dev`

Combines the `compile` and `browserSync` tasks, then watch for any changes in the `sources` directory in order to recompile the sources files and reload the browser.

## `default`

Combines the `compile` and `copy` tasks.