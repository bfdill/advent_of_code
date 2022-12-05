#!/usr/bin/node

import { readFile } from 'node:fs/promises'

const hands = {
  A: 'rock',
  B: 'paper',
  C: 'scissors',
  X: 'rock',
  Y: 'paper',
  Z: 'scissors'
}

const newHand = {
  /* loss **/
  AX: 'Z',
  /* draw **/
  AY: 'X',
  /* win **/
  AZ: 'Y',
  /* loss **/
  BX: 'X',
  /* draw **/
  BY: 'Y',
  /* win **/
  BZ: 'Z',
  /* loss **/
  CX: 'Y',
  /* draw **/
  CY: 'Z',
  /* win **/
  CZ: 'X'
}

const outcomes = {
  AX: 'draw',
  AY: 'win',
  AZ: 'loss',
  BX: 'loss',
  BY: 'draw',
  BZ: 'win',
  CX: 'win',
  CY: 'loss',
  CZ: 'draw'
}

const scores = {
  rock: 1,
  paper: 2,
  scissors: 3,
  lost: 0,
  draw: 3,
  win: 6
}

const processData = data => {
  const scorePart1 = data
    .map(x => x[0] + x[2])
    .map(x => (outcomes[x] === 'loss' ? scores[hands[x[1]]] : scores[outcomes[x]] + scores[hands[x[1]]]))
    .reduce((pv, cv) => pv + cv, 0)

  const scorePart2 = data
    .map(x => x[0] + newHand[x[0] + x[2]])
    .map(x => (outcomes[x] === 'loss' ? scores[hands[x[1]]] : scores[outcomes[x]] + scores[hands[x[1]]]))
    .reduce((pv, cv) => pv + cv, 0)

  console.log({ scorePart1, scorePart2 })
}

const main = async filename => {
  const data = await readFile(filename, { encoding: 'utf8' })

  processData(data.split(/\n/))
}

await main(process.argv.slice(2)[0])
