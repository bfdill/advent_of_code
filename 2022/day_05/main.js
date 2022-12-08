#!/usr/bin/node

import { readFile } from 'node:fs/promises'

// seems easy enough to parse. three chars plus a space, empty = missing
const sampleDock = [['Z', 'N'], ['M', 'C', 'D'], ['P']]
const realDock = [
  ['J', 'H', 'G', 'M', 'Z', 'N', 'T', 'F'],
  ['V', 'W', 'J'],
  ['G', 'V', 'L', 'J', 'B', 'T', 'H'],
  ['B', 'P', 'J', 'N', 'C', 'D', 'V', 'L'],
  ['F', 'W', 'S', 'M', 'P', 'R', 'G'],
  ['G', 'H', 'C', 'F', 'B', 'N', 'V', 'M'],
  ['D', 'H', 'G', 'M', 'R'],
  ['H', 'N', 'M', 'V', 'Z', 'D'],
  ['G', 'N', 'F', 'H']
]

const parseRow = row =>
  row
    .split(' ')
    .map(x => Number.parseInt(x))
    .filter(x => !Number.isNaN(x))

// hell yeah!
const applyMovesPart1 = (dock, moves) => {
  for (let i = 0; i < moves[0]; i++) {
    dock[moves[2] - 1].push(dock[moves[1] - 1].pop())
  }
}

const applyMovesPart2 = (dock, moves) => {
  const crates = moves[0]
  const sourceDock = moves[1] - 1
  const targetDock = moves[2] - 1

  dock[targetDock] = [...dock[targetDock], ...dock[sourceDock].slice(dock[sourceDock].length - crates)]
  dock[sourceDock] = dock[sourceDock].slice(0, dock[sourceDock].length - crates)
}

const topRow = stack => stack.map(x => x[x.length - 1]).reduce((pv, cv) => pv + cv, '')

const processData = (data, isSample) => {
  let dock = JSON.parse(JSON.stringify(isSample ? sampleDock : realDock))

  data.forEach(row => {
    applyMovesPart1(dock, parseRow(row))
  })

  console.log({ dock, top: topRow(dock) })

  dock = JSON.parse(JSON.stringify(isSample ? sampleDock : realDock))

  data.forEach(row => {
    applyMovesPart2(dock, parseRow(row))
  })

  console.log({ dock, top: topRow(dock) })
}

const main = async filename => {
  const data = await readFile(filename, { encoding: 'utf8' })

  processData(data.split(/\n/), filename.indexOf('sample') >= 0)
}

await main(process.argv.slice(2)[0])
