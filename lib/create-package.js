'use strict'

const readPackage = require('read-package')
const writePkg = require('write-pkg')

const getCfg = require('./../lib/get-cfg')

module.exports = async () => {
  let pkg = {}
  const netlifyDocsCfg = await getCfg()

  try {
    pkg = await readPackage()
  } catch (err) {}

  const newPkg = {
    name: netlifyDocsCfg.name || `${pkg.name}-docs`,
    version: '0.0.0',
    description: pkg.description || '',
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build'
    },
    dependencies: {
      react: '^16.2.0',
      'react-dom': '^16.2.0',
      'react-scripts': '1.0.17',
      'react-helmet': '^5.0.0'
    },
    netlifyDocs: {
      name: netlifyDocsCfg.name || `${pkg.name}-docs`
    }
  }

  return writePkg('.netlify-docs', newPkg)
}
