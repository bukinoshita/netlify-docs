#!/usr/bin/env node

'use strict'

const { join } = require('path')
const meow = require('meow')
const updateNotifier = require('update-notifier')
const { existsSync } = require('fs-extra')
const shoutSuccess = require('shout-success')
const shoutError = require('shout-error')
const del = require('del')
const pTap = require('p-tap')
const logUpdate = require('log-update')
const ms = require('ms')
const { grey } = require('chalk')

const createPackage = require('./../lib/create-package')
const createLayout = require('./../lib/create-layout')
const createPage = require('./../lib/create-page')
const createComponents = require('./../lib/create-components')
const createDocs = require('./../lib/create-docs')
const createStyles = require('./../lib/create-styles')
const deploy = require('./../lib/deploy')
const getOutput = require('./../lib/get-output')
const {
  STATE_WAITING,
  STATE_STARTING,
  STATE_RUNNING,
  STATE_SUCCESS,
  STATE_ERROR
} = require('./../lib/states')

const cli = meow(
  `
  Usage:
    $ netlify-docs              Deploy \`netlify-docs\`
  Options:
    -h, --help                  Show help options
    -v, --version               Show version
`,
  {
    alias: {
      h: 'help',
      v: 'version'
    }
  }
)

updateNotifier({ pkg: cli.pkg }).notify()

const run = async () => {
  const start_ = new Date()
  const hasDocs = existsSync(join(process.cwd(), 'docs'))
  const theme = 'apex'
  const state = new Map()
  const updateOutput = () => logUpdate(getOutput(state))
  let deployment

  if (!hasDocs) {
    return shoutError("Couldn't find `docs` folder.")
  }

  return Promise.resolve()
    .then(
      pTap(() => {
        state.set('cleaning', STATE_WAITING)
        state.set('building', STATE_WAITING)
        state.set('deploying', STATE_WAITING)
        updateOutput()
      })
    )
    .then(
      pTap(() => {
        state.set('cleaning', STATE_RUNNING)
        updateOutput()
      })
    )
    .then(() => del(join(process.cwd(), '.netlify-docs')))
    .then(
      pTap(() => {
        state.set('cleaning', STATE_SUCCESS)
        state.set('building', STATE_STARTING)
        updateOutput()
      })
    )
    .then(
      pTap(() => {
        state.set('building', STATE_RUNNING)
        updateOutput()
      })
    )
    .then(async () =>
      Promise.all([
        await createPackage(),
        await createComponents(),
        await createLayout(),
        await createPage(),
        await createDocs(),
        await createStyles(theme)
      ])
    )
    .then(
      pTap(() => {
        state.set('building', STATE_SUCCESS)
        state.set('deploying', STATE_STARTING)
        updateOutput()
      })
    )
    .then(
      pTap(() => {
        state.set('deploying', STATE_RUNNING)
        updateOutput()
      })
    )
    .then(() => (deployment = deploy())) // eslint-disable-line no-return-assign
    .then(
      pTap(() => {
        state.set('deploying', STATE_SUCCESS)
        updateOutput()
      })
    )
    .then(async () => {
      const elapsed_ = ms(new Date() - start_)
      const { name, ssl_url } = await deployment // eslint-disable-line camelcase
      logUpdate.done()
      console.log('\n')

      shoutSuccess(
        `\`${name}\` deployed at ${ssl_url}! ${grey('[' + elapsed_ + ']')}` // eslint-disable-line camelcase
      )
    })
    .catch(err => {
      state.set('deploying', STATE_ERROR)
      updateOutput()
      shoutError(err)
    })
}

run()
