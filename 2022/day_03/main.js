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

  _findDuplicate = (first, second) => {
    const a = typeof first === 'string' ? new Set(first.split('')) : new Set(first),
      b = new Set(second.split(''))

    return [...a].filter(x => b.has(x))
  }

  findDuplicate = () => this._findDuplicate(this.compartment1, this.compartment2)

  getPriority = () => scoredAlphabet.indexOf(this.findDuplicate().at(0))
}

class ThreePackRucksack extends Rucksack {
  constructor(first, second, third) {
    super(first)

    this.first = first
    this.second = second
    this.third = third
  }

  findDuplicate = () => this._findDuplicate(this._findDuplicate(this.first, this.second), this.third)
}

const processData = data => {
  console.log({
    results: data.map(x => new Rucksack(x).getPriority()).reduce((pv, cv) => pv + cv, 0),
    records: data.length
  })

  let total = 0

  for (let i = 0; i < data.length - 2; i += 3) {
    total += new ThreePackRucksack(data[i], data[i + 1], data[i + 2]).getPriority()
  }

  console.log({ total, records: data.length })
}

const main = async filename => {
  const data = await readFile(filename, { encoding: 'utf8' })

  processData(data.split(/\n/))
}

await main(process.argv.slice(2)[0])
