#!/usr/bin/node

import { readFile } from 'node:fs/promises'

const createElfCreator = () => {
  let elfCounter = 0

  return () => {
    elfCounter++

    return { idx: elfCounter, calories: 0 }
  }
}

const elves = {
  max: undefined,
  penultimate: undefined,
  propenultimate: undefined
}

const elfSorter = (elf, key = 'max') => {
  let tempElf = elf

  if (elves[key] === undefined) {
    elves[key] = elf
    return
  } else if (elf.calories > elves[key].calories) {
    tempElf = elves[key]
    elves[key] = elf
  }

  switch (key) {
    case 'max':
      elfSorter(tempElf, 'penultimate')
      break
    case 'penultimate':
      elfSorter(tempElf, 'propenultimate')
      break
    default:
      return
  }
}

const processData = data => {
  const createElf = createElfCreator()
  let currentElf = createElf()

  data.forEach(element => {
    if (element.length === 0) {
      elfSorter(currentElf)
      currentElf = createElf()
      return
    }

    currentElf.calories += Number.parseInt(element)
  })

  elfSorter(currentElf)

  console.log({
    elves,
    topThree: elves.max.calories + elves.penultimate.calories + elves.propenultimate.calories,
    dataElements: data.length,
    numberOfElves: createElf().idx - 1
  })
}

const main = async filename => {
  const data = await readFile(filename, { encoding: 'utf8' })

  processData(data.split(/\n/))
}

await main(process.argv.slice(2)[0])
