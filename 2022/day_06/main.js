#!/usr/bin/node

import { readFile } from 'node:fs/promises'

const startOfPacket = 3
const startOfMessage = 13

const signalFinder = (data, location) => {
  data.forEach(row => {
    const chars = row.split('')

    for (let i = location; i < chars.length; i++) {
      const x = new Set(row.slice(i - location, i + 1))

      if (x.size === location + 1) {
        console.log({ steps: i + 1 })
        break
      }
    }
  })
}

const processData = data => {
  signalFinder(data, startOfPacket)
  console.log('------')
  signalFinder(data, startOfMessage)
}

const main = async filename => {
  const data = await readFile(filename, { encoding: 'utf8' })

  processData(data.split(/\n/).filter(x => x))
}

await main(process.argv.slice(2)[0])
