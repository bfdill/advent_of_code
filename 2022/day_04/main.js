#!/usr/bin/node

import { readFile } from 'node:fs/promises'

const range = (lower, upper) => Array.from(new Array(upper - lower), (x, i) => i + lower)
const parseRow = row => {
  const [first, second] = row.split(',')
  return [...first.split('-'), ...second.split('-')].map(x => Number.parseInt(x))
}
const getArrays = parsedRow => [range(parsedRow[0], parsedRow[1] + 1), range(parsedRow[2], parsedRow[3] + 1)]

const processData = data => {
  const fullyContained = data
    .map(x => {
      const [one, two] = getArrays(parseRow(x))
      const intersection = one.filter(i => two.includes(i))
      const isFullyContained = intersection.length === one.length || intersection.length === two.length

      return isFullyContained
    })
    .filter(x => x)

  console.log({ records: data.length, fullyContained: fullyContained.length })

  const overlaps = data
    .map(x => {
      const [one, two] = getArrays(parseRow(x))
      const intersection = one.filter(i => two.includes(i))
      const hasOverlaps = intersection.length >= 1

      return hasOverlaps
    })
    .filter(x => x)

  console.log({ records: data.length, overlaps: overlaps.length })
}

const main = async filename => {
  const data = await readFile(filename, { encoding: 'utf8' })

  processData(data.split(/\n/))
}

await main(process.argv.slice(2)[0])
