'use client'

import { PlayIcon } from '@/components/shared/icons'
import Code from '@/components/shared/inputs/code'
import { json } from '@codemirror/lang-json'
import { graphql } from 'cm6-graphql'
import { buildSchema } from 'graphql'
import * as parserGraphql from 'prettier/parser-graphql'
import * as parserBabel from 'prettier/parser-babel'
import * as parserHtml from 'prettier/parser-html'
import * as parserEspree from 'prettier/parser-espree'
import { format } from 'prettier/standalone'
import { useEffect, useState } from 'react'
import { executeQuery } from '../_actions/index'

export default function Gql({
  schema,
  gql,
}: {
  schema: string | null
  gql: string
}) {
  const [query, setQuery] = useState(gql)
  const [response, setResponse] = useState('')

  const gqlSchema = buildSchema(schema ?? '')

  console.log(gqlSchema)

  useEffect(() => {
    async function formatGql(gql: string) {
      setQuery(
        (
          await format(gql, { parser: 'graphql', plugins: [parserGraphql] })
        ).replaceAll('_EMPTY_', ''),
      )
    }

    formatGql(gql)
  }, [gql])

  async function handleExecute() {
    const { success, data } = await executeQuery(query)

    if (success && data) {
      setResponse(
        await format(data.response ?? '', {
          parser: 'json',
          plugins: [parserBabel, parserHtml, parserEspree],
        }),
      )
    }
  }

  return (
    <div className='grid grid-rows-[auto_1fr] divide-y divide-base-200'>
      <div className='flex size-full items-center gap-3 p-2'>
        <button
          type='button' 
          className='btn btn-circle btn-primary'
          onClick={handleExecute}
        >
          <PlayIcon />
        </button>
        <label htmlFor='explorer-drawer' className='btn drawer-button btn-sm'>
          Explorer
        </label>
      </div>
      <div className='grid size-full grid-cols-2'>
        <div className='size-full'>
          <Code
            basicSetup={{ foldGutter: false }}
            extensions={[graphql(gqlSchema)]}
            height='100%'
            value={query}
          />
        </div>
        <Code
          basicSetup={{ lineNumbers: false }}
          editable={false}
          extensions={[json()]}
          height='100%'
          value={response}
        />
      </div>
    </div>
  )
}
