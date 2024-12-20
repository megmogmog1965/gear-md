#!/usr/bin/env npx tsx

import fs from 'fs'
import path from 'path'
import process from 'process'
import YAML from 'yaml'
import { getArgs, usage } from './argparser.js'
import { JsonTypes, parseJsonRecursively, createMarkdownString } from './converter.js'

/**
 * main process.
 *
 * @returns {boolean} true if success.
 */
async function main(): Promise<boolean> {
  const { args, error } = getArgs()

  // invalid cli options.
  if (error || !args) {
    console.log(usage())
    return false
  }

  // invalid cli args.
  if (args.values.help || args.positionals.length === 0) {
    console.log(usage())
    return false
  }

  // choose file loader.
  const filePath = args.positionals[0].trim()
  const loader = filePath.toLocaleLowerCase().endsWith('.json') ? loadJson : loadYaml

  // read local json file.
  const shallow = loader(filePath)
  if (!shallow) {
    console.log(usage())
    return false
  }

  // parse json recursively.
  const deep = parseJsonRecursively(shallow)

  const multipleByKey = args.values.multiple

  // determine output file path(s).
  const jobs: { path: string, obj: JsonTypes }[] = (multipleByKey && Array.isArray(deep))
    ? deep
      .filter((obj) => multipleByKey in obj)
      .map((obj) => ({
        path: path.join(filePath.slice(0, filePath.lastIndexOf('.')), `${obj[multipleByKey]}.md`),
        obj: obj,
      }))
    : [
      {
        path: `${filePath.slice(0, filePath.lastIndexOf('.'))}.md`,
        obj: deep,
      },
    ]

  // convert json to yaml.
  for (const job of jobs) {
    const yaml = createMarkdownString(job.obj)

    // ensure output directory.
    const dir = path.dirname(job.path)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // stdout.
    fs.writeFileSync(job.path, yaml)
  }

  return true
}

/**
 * load json file.
 *
 * @param {string} filePath json file path.
 * @returns {any | undefined} json object or undefined.
 */
function loadJson(filePath: string): any | undefined {  // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const file = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(file)

  } catch (e) {  // eslint-disable-line @typescript-eslint/no-unused-vars
    return undefined
  }
}

function loadYaml(filePath: string): any | undefined {  // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const file = fs.readFileSync(filePath, 'utf-8')
    return YAML.parse(file)
  } catch (e) {  // eslint-disable-line @typescript-eslint/no-unused-vars
    return undefined
  }
}

// call.
const result = await main()
if (!result) {
  process.exit(1)
}
