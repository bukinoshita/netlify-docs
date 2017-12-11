'use strict'

const { join } = require('path')
const { copy, mkdir } = require('fs-extra')
const globalModules = require('global-modules')

module.exports = async () => {
  const path = join(process.cwd(), '.netlify-docs/src/components')
  const pathSrc = join(process.cwd(), '.netlify-docs/src')
  const pathPublic = join(process.cwd(), '.netlify-docs/public')

  try {
    Promise.all([
      await mkdir(pathSrc),
      await mkdir(path),
      await mkdir(pathPublic),
      await copy(
        join(`${globalModules}/netlify-docs`, `/lib/components/index.js`),
        `${pathSrc}/index.js`
      ),
      await copy(
        join(`${globalModules}/netlify-docs`, `/lib/public/index.html`),
        `${pathPublic}/index.html`
      ),
      await copy(
        join(`${globalModules}/netlify-docs`, `/lib/components/header.js`),
        `${path}/header.js`
      ),
      await copy(
        join(`${globalModules}/netlify-docs`, `/lib/components/sidebar.js`),
        `${path}/sidebar.js`
      ),
      await copy(
        join(`${globalModules}/netlify-docs`, `/lib/components/footer.js`),
        `${path}/footer.js`
      )
    ])
  } catch (err) {}
}
