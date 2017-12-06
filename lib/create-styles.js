'use strict'

const { join } = require('path')
const { copy, mkdir } = require('fs-extra')

module.exports = async theme => {
  const path = join(process.cwd(), '.netlify-docs/src/styles')

  try {
    Promise.all([
      await mkdir(path),
      await copy(
        join(process.cwd(), `lib/styles/${theme}.css`),
        `${path}/styles.css`
      )
    ])
  } catch (err) {}
}
