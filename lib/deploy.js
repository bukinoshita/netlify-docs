'use strict'

const { join } = require('path')

const netlify = require('netlify')
const execa = require('execa')
const readPackage = require('read-package')
const uid = require('uid-promise')

const getToken = require('./get-token')
const getCfg = require('./get-cfg')

module.exports = async () => {
  const access_token = await getToken() // eslint-disable-line camelcase
  const { name } = await getCfg()
  const client = netlify.createClient({ access_token }) // eslint-disable-line camelcase
  const sites = await client.sites()
  const dir = join(process.cwd(), '.netlify-docs/build')
  let pkg = {}
  let newSite = true

  try {
    pkg = await readPackage()
  } catch (err) {}

  const siteName = name || `${pkg.name}-docs`

  await execa.shell('cd .netlify-docs && yarn add react-scripts && yarn build')

  sites.forEach(async site => {
    if (site.name === siteName) {
      newSite = false
      const site_id = site.id // eslint-disable-line camelcase

      return netlify.deploy({ access_token, site_id, dir }) // eslint-disable-line camelcase
    }
  })

  if (newSite) {
    try {
      const newDocs = await client.createSite({ name: siteName })
      return newDocs.createDeploy({ dir })
    } catch (err) {
      const id = await uid(5)
      const newDocs = await client.createSite({ name: `${siteName}-${id}` })
      return newDocs.createDeploy({ dir })
    }
  }
}
