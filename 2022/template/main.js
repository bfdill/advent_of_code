#!/usr/bin/node

import { readFile } from 'node:fs/promises'

const processData = data => {}

const main = async filename => {
  const data = await readFile(filename, { encoding: 'utf8' })

  processData(data.split(/\n/).filter(x => x))
}

await main(process.argv.slice(2)[0])
