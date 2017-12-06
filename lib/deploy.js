'use strict'

const { join } = require('path')

const netlify = require('netlify')
const execa = require('execa')
const readPackage = require('read-package')

const getToken = require('./get-token')
const getCfg = require('./get-cfg')

module.exports = async () => {
  const access_token = await getToken() // eslint-disable-line camelcase
  const pkg = await readPackage()
  const { name } = await getCfg()
  const client = netlify.createClient({ access_token }) // eslint-disable-line camelcase
  const sites = await client.sites()
  const dir = join(process.cwd(), '.netlify-docs/build')
  const siteName = name || `${pkg.name}-docs`
  let newSite = true

  await execa.shell('cd .netlify-docs && yarn add react-scripts && yarn build')

  sites.forEach(async site => {
    if (site.name === siteName) {
      newSite = false
      const site_id = site.id // eslint-disable-line camelcase

      return netlify.deploy({ access_token, site_id, dir }) // eslint-disable-line camelcase
    }
  })

  if (newSite) {
    const newSite = await client.createSite({ name: siteName })
    return newSite.createDeploy({ dir })
  }
}
