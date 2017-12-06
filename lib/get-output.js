'use strict'

const indentString = require('indent-string')
const { circleDotted, tick, cross } = require('figures')
const table = require('text-table')
const { grey, green, red } = require('chalk')
const {
  STATE_WAITING,
  STATE_STARTING,
  STATE_RUNNING,
  STATE_SUCCESS,
  STATE_ERROR
} = require('./states')

module.exports = state => {
  const items = []

  for (const [task, currentState] of state) {
    let message
    let icon

    if (currentState === STATE_WAITING) {
      message = grey('waiting')
      icon = grey(circleDotted)
    }

    if (currentState === STATE_STARTING) {
      message = grey('starting')
      icon = grey(circleDotted)
    }

    if (currentState === STATE_RUNNING) {
      message = grey('running')
      icon = grey(circleDotted)
    }

    if (currentState === STATE_SUCCESS) {
      message = green('success')
      icon = green(tick)
    }

    if (currentState === STATE_ERROR) {
      message = red('error')
      icon = red(cross)
    }

    items.push([icon, ` ${task}: `, message])
  }

  return '\n' + indentString(table(items, { hsep: '' }), 1)
}
