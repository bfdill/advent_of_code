#!/usr/bin/node

import { readFile } from 'node:fs/promises'

const scoredAlphabet = [undefined]

for (let i = 97; i < 123; i++) scoredAlphabet.push(String.fromCharCode(i))
for (let i = 65; i < 91; i++) scoredAlphabet.push(String.fromCharCode(i))

class Rucksack {
  constructor(supplies) {
    this.compartment1 = supplies.slice(0, supplies.length / 2)
    this.compartment2 = supplies.slice(supplies.length / 2, supplies.length)
  }

  findDuplicate = () =>
    this.compartment1.split('').reduce((pv, cv, i, a) => {
      if (this.compartment2.includes(cv)) {
        a.length = 0
        return cv
      }
    }, '')

  getPriority = () => scoredAlphabet.indexOf(this.findDuplicate())
}

const processData = data => {
  const result = data.map(x => new Rucksack(x).getPriority()).reduce((pv, cv) => pv + cv, 0)

  console.log({ result, records: data.length })
}

const main = async filename => {
  const data = await readFile(filename, { encoding: 'utf8' })

  processData(data.split(/\n/))
}

await main(process.argv.slice(2)[0])
