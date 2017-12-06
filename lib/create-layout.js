'use strict'

const { join } = require('path')
const { writeFile, mkdir } = require('fs-extra')

const page = require('./layouts/page')

module.exports = async () => {
  const path = join(process.cwd(), '.netlify-docs/src/layouts')

  try {
    Promise.all([
      await mkdir(path),
      await writeFile(`${path}/page.js`, await page())
    ])
  } catch (err) {}
}
