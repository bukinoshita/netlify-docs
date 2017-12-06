'use strict'

const { join } = require('path')
const { homedir } = require('os')

const { readFile } = require('fs-extra')

module.exports = async () => {
  const netlifyCfg = await readFile(join(homedir(), '.netlify/config'))
  const { access_token } = JSON.parse(netlifyCfg.toString()) // eslint-disable-line camelcase

  return access_token // eslint-disable-line camelcase
}
