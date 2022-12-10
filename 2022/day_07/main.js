#!/usr/bin/node

import { readFile } from 'node:fs/promises'
import { inspect } from 'node:util'

class Node {
  constructor(parent, name, size) {
    this.parent = parent
    this.name = name

    if (typeof size === 'string') this.size = Number.parseInt(size)
    if (this.parent !== undefined) this.parent.children.push(this)
    if (this.size === undefined) this.children = []
  }

  get isFile() {
    return this.size !== undefined
  }

  calculateChildrenSize = () =>
    this.children === undefined
      ? undefined
      : this.children.map(n => (n.isFile ? n.size : n.calculateChildrenSize())).reduce((pv, cv) => pv + cv, 0)
}

// i'm mutating all over this file.
// i'm just too lazy to write a class for file system
const root = new Node(undefined, '/', undefined)
let pwd = undefined

const cd = dir => (dir === '..' ? (pwd = pwd.parent) : (pwd = pwd.children.find(x => x.name === dir)))

const processCommand = command => {
  switch (command) {
    case '$ cd /':
      pwd = root
      break
    case '$ ls':
      return
    default:
      if (command.indexOf('$ cd ') === 0) {
        cd(command.substr(5))
        break
      }

      throw new Error(`nope:(${command})`)
  }
}

const processRow = row => {
  if (row.indexOf('$') === 0) {
    processCommand(row)
  } else if (row.indexOf('dir ') === 0) {
    new Node(pwd, row.substr(4), undefined)
  } else {
    const file = row.split(' ')

    if (file.length !== 2) {
      throw new Error(`file length wrong(${row}, ${file})`)
    }

    new Node(pwd, file[1], file[0])
  }
}

const flattenTree = tree => {
  const totesFlat = []

  if (tree.isFile) return undefined

  totesFlat.push(tree)
  totesFlat.push(tree.children.map(flattenTree))

  return totesFlat.flat(Number.MAX_VALUE).filter(x => x)
}

const processData = data => {
  data.forEach(row => {
    processRow(row)
  })

  const flatTree = flattenTree(root)
    .map(x => x.calculateChildrenSize())
    .filter(x => x <= 100000)
    .reduce((pv, cv) => pv + cv, 0)

  console.log({ count: root.calculateChildrenSize(), flatTree })
}

const main = async filename => {
  const data = await readFile(filename, { encoding: 'utf8' })

  processData(data.split(/\n/).filter(x => x))
}

await main(process.argv.slice(2)[0])
