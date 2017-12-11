'use strict'

const { join } = require('path')

const readPackage = require('read-package')
const { exists } = require('fs-extra')
const readJSON = require('load-json-file')

module.exports = async () => {
  let pkg
  const dotNetlifyDocs = await exists(join(process.cwd(), '.netlify-docs.json'))

  try {
    pkg = await readPackage()
  } catch (err) {}

  if (dotNetlifyDocs) {
    const netlifyDocsCfg = await readJSON(
      join(process.cwd(), '.netlify-docs.json')
    )

    return netlifyDocsCfg
  }

  if (pkg) {
    return pkg.netlifyDocs
  }

  return false
}
