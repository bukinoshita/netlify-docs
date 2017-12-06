'use strict'

const { join } = require('path')

const readPackage = require('read-package')
const { exists } = require('fs-extra')
const readJSON = require('load-json-file')

module.exports = async () => {
  const dotNetlifyDocs = await exists(join(process.cwd(), '.netlify-docs.json'))
  const { netlifyDocs } = await readPackage()

  if (dotNetlifyDocs) {
    const netlifyDocsCfg = await readJSON(
      join(process.cwd(), '.netlify-docs.json')
    )

    return netlifyDocsCfg
  }

  if (netlifyDocs) {
    return netlifyDocs
  }

  return false
}
