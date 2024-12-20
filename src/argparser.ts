import { parseArgs } from 'node:util'


export interface Args {
  values: {
    help: boolean
    multiple: string | undefined
  }
  positionals: string[]
}

/**
 * get cli args.
 *
 * @param {string[]} args cli args. (※省略すれば自動で検知する)
 * @returns {Args} cli args.
 * @throws {TypeError} when invalid args.
 */
export function getArgs(args: string[] | undefined = undefined): { args?: Args, error?: string } {
  const options = {
    help: {
      type: 'boolean',
      short: 'h',
    },
    multiple: {
      type: 'string',
      short: 'm',
    },
  } as const

  try {
    const { values, positionals } = parseArgs({
      args: args,
      allowPositionals: true,
      options,
    })

    return {
      args: {
        values: {
          help: values.help ?? false,
          multiple: values.multiple ?? undefined,
        },
        positionals,
      },
    }

  } catch (e) {
    return { error: (e as Error).message }
  }
}

/**
 * usage.
 *
 * @returns usage message.
 */
export function usage(): string {
  return `
Usage: npx gear-md [options] [json or yaml file]

Options:
 -h, --help  Show help.
 -m, --multiple {KEY}  Create multiple files by {KEY}.
`.trim()
}
