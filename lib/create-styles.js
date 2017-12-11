'use strict'

const { join } = require('path')
const { copy, mkdir } = require('fs-extra')
const globalModules = require('global-modules')

module.exports = async theme => {
  const path = join(process.cwd(), '.netlify-docs/src/styles')

  try {
    Promise.all([
      await mkdir(path),
      await copy(
        join(`${globalModules}/netlify-docs`, `/lib/styles/${theme}.css`),
        `${path}/styles.css`
      )
    ])
  } catch (err) {}
}
