import { JwtPayload, decode } from 'jsonwebtoken'
import ms from 'ms'

import { APIError, HTTPError } from './errors'
import {
  AdminQuery,
  AdminVariables,
  Assigned,
  Config,
  ErrorNonJson,
  Health,
  LoginResponse,
  Mutation,
  Operation,
  Options,
  Payload,
  Request,
  Response,
  TxnContext,
  UiKeywords,
} from './types'
import { mutations, queries } from './gql'

/**
 * Stub is a stub/client connecting to a single dgraph server instance.
 */
export class DgraphClientStub {
  private readonly url: string
  private readonly options: Options
  private readonly jsonParser: (text: string) => any
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private autoRefresh: boolean = true
  private autoRefreshTimer: NodeJS.Timeout | null = null

  constructor(
    url = 'http://localhost:8080',
    stubConfig: {
      jsonParser?(text: string): any
    } = {},
    options: Options = {},
  ) {
    this.url = `${url}${url.endsWith('/') ? '' : '/'}`
    this.options = options

    this.jsonParser = stubConfig.jsonParser ?? JSON.parse.bind(JSON)
  }

  public getURL() {
    return this.url
  }

  public async detectApiVersion() {
    const health = await this.getHealth()
    return health.at(0)?.version ?? 'unknown'
  }

  public alter(op: Operation): Promise<Payload> {
    let body: string
    if (op.schema !== undefined) {
      body = op.schema
    } else if (op.dropAttr !== undefined) {
      body = JSON.stringify({ drop_attr: op.dropAttr })
    } else if (op.dropAll) {
      body = JSON.stringify({ drop_all: true })
    } else {
      return Promise.reject('Invalid op argument in alter')
    }

    return this.callAPI('alter', { body })
  }

  public async admin<T extends AdminQuery>(
    query: T,
    variables: AdminVariables[T],
  ) {
    return this.callAPI<T>('admin', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { ...queries, ...mutations }[query],
        variables,
      }),
    })
  }

  public async slash<T extends AdminQuery>(
    query: T,
    variables: AdminVariables[T],
  ) {
    return this.callAPI('admin/slash', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { ...queries, ...mutations }[query],
        variables,
      }),
    })
  }

  public async query<T extends any>(query: T, variables: any) {
    return this.callAPI<T>('graphql', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  }

  public async validateSchema(schema: string) {
    return this.callAPI('admin/schema/validate', {
      body: schema,
    })
  }

  // public query(req: Request): Promise<Response> {
  //   if (req.vars) {
  //     req.query = JSON.stringify({
  //       query: req.query,
  //       variables: req.vars,
  //     })
  //   }

  //   let url = 'query'

  //   const params: { key: string; value: string }[] = []
  //   if (req.startTs !== 0) {
  //     params.push({
  //       key: 'startTs',
  //       value: `${req.startTs}`,
  //     })
  //   }
  //   if (req.timeout! > 0) {
  //     params.push({
  //       key: 'timeout',
  //       value: `${req.timeout}s`,
  //     })
  //   }
  //   if (req.debug) {
  //     params.push({
  //       key: 'debug',
  //       value: 'true',
  //     })
  //   }
  //   if (req.readOnly) {
  //     params.push({
  //       key: 'ro',
  //       value: 'true',
  //     })
  //   }
  //   if (req.bestEffort) {
  //     params.push({
  //       key: 'be',
  //       value: 'true',
  //     })
  //   }
  //   if (req?.hash?.length! > 0) {
  //     params.push({
  //       key: 'hash',
  //       value: `${req.hash}`,
  //     })
  //   }
  //   if (params.length > 0) {
  //     url += '?'
  //     url += params
  //       .map(
  //         ({ key, value }: { key: string; value: string }): string =>
  //           `${key}=${value}`,
  //       )
  //       .join('&')
  //   }

  //   return this.callAPI(url, {
  //     headers: {
  //       'Content-Type': `application/${req.vars ? 'json' : 'graphql+-'}`,
  //     },
  //     body: req.query,
  //   })
  // }

  public mutate(mu: Mutation): Promise<Assigned> {
    let body: string
    let usingJSON: boolean = false
    if (mu.setJson !== undefined || mu.deleteJson !== undefined) {
      usingJSON = true
      const obj: { [k: string]: object } = {}
      if (mu.setJson !== undefined) {
        obj.set = mu.setJson
      }
      if (mu.deleteJson !== undefined) {
        obj.delete = mu.deleteJson
      }

      body = JSON.stringify(obj)
    } else if (mu.setNquads !== undefined || mu.deleteNquads !== undefined) {
      body = `{
                ${
                  mu.setNquads === undefined
                    ? ''
                    : `set {
                    ${mu.setNquads}
                }`
                }
                ${
                  mu.deleteNquads === undefined
                    ? ''
                    : `delete {
                    ${mu.deleteNquads}
                }`
                }
            }`
    } else if (mu.mutation !== undefined) {
      body = mu.mutation
      if (mu.isJsonString !== undefined) {
        // Caller has specified mutation type
        usingJSON = mu.isJsonString
      } else {
        // Detect content-type
        try {
          JSON.parse(mu.mutation)
          usingJSON = true
        } catch (e) {
          usingJSON = false
        }
      }
    } else {
      return Promise.reject('Mutation has no data')
    }

    let url = 'mutate'
    let nextDelim = '?'
    if (mu.startTs! > 0) {
      url += `?startTs=` + mu.startTs!.toString()
      nextDelim = '&'
    }

    if (mu?.hash?.length! > 0) {
      url += `${nextDelim}hash=${mu.hash}`
    }

    if (mu.commitNow) {
      url += `${nextDelim}commitNow=true`
    }

    return this.callAPI(url, {
      headers: {
        'Content-Type': `application/${usingJSON ? 'json' : 'rdf'}`,
      },
      body,
    })
  }

  public commit(ctx: TxnContext): Promise<TxnContext> {
    let body: string
    if (ctx.keys === undefined) {
      body = '[]'
    } else {
      body = JSON.stringify(ctx.keys)
    }

    let url = `commit?startTs=${ctx.start_ts}`

    if (ctx?.hash?.length! > 0) {
      url += `&hash=${ctx.hash}`
    }

    return this.callAPI(url, {
      ...this.options,
      method: 'POST',
      body,
    })
  }

  public abort(ctx: TxnContext): Promise<TxnContext> {
    let url = `commit?startTs=${ctx.start_ts}&abort=true`

    if (ctx?.hash?.length! > 0) {
      url += `&hash=${ctx.hash}`
    }

    return this.callAPI(url)
  }

  public async login(
    userid?: string,
    password?: string,
    refreshToken?: string,
  ): Promise<boolean> {
    if (userid && refreshToken) {
      throw new Error(
        'Cannot find login details: neither userid/password nor refresh token are specified',
      )
    }

    const body = userid
      ? {
          userid,
          password,
        }
      : { refreshToken: refreshToken ?? this.refreshToken }

    const res = await this.callAPI<LoginResponse>('login', {
      body: JSON.stringify(body),
    })

    this.accessToken = res.data.accessJWT
    this.refreshToken = res.data.refreshJWT

    this.maybeStartRefreshTimer(this.accessToken)
    return true
  }

  public async loginIntoNamespace(
    userid?: string,
    password?: string,
    namespace?: number,
    refreshToken?: string,
  ): Promise<boolean> {
    if (userid && this.refreshToken) {
      throw new Error(
        'Cannot find login details: neither userid/password nor refresh token are specified',
      )
    }

    const body = userid
      ? {
          userid,
          password,
          namespace,
        }
      : { refreshToken: refreshToken ?? this.refreshToken }

    const res: LoginResponse = await this.callAPI('login', {
      body: JSON.stringify(body),
    })

    this.accessToken = res.data.accessJWT
    this.refreshToken = res.data.refreshJWT

    this.maybeStartRefreshTimer(this.accessToken)
    return true
  }

  public logout() {
    this.accessToken = null
    this.refreshToken = null
  }

  public getAuthTokens() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    }
  }

  public async fetchUiKeywords(): Promise<UiKeywords> {
    return this.callAPI('ui/keywords')
  }

  /**
   * Gets instance or cluster health, based on the all param
   */
  public async getHealth(all = false) {
    return this.callAPI<Health[]>(`health${all ? '?all' : ''}`, {
      acceptRawText: true,
    })
  }

  /**
   * Gets the state of the cluster
   */
  public async getState(): Promise<Response> {
    return this.callAPI('state', this.options)
  }

  public setAutoRefresh(val: boolean) {
    if (!val) {
      this.cancelRefreshTimer()
    }
    this.autoRefresh = val
    this.maybeStartRefreshTimer(this.accessToken)
  }

  public setAlphaAuthToken(authToken: string) {
    if (this.options.headers === undefined) {
      this.options.headers = {}
    }
    this.options.headers['X-Dgraph-AuthToken'] = authToken
  }

  public setCloudApiKey(apiKey: string) {
    if (this.options.headers === undefined) {
      this.options.headers = {}
    }
    this.options.headers['X-Auth-Token'] = apiKey
  }

  private cancelRefreshTimer() {
    if (this.autoRefreshTimer) {
      clearTimeout(this.autoRefreshTimer)
      this.autoRefreshTimer = null
    }
  }

  private maybeStartRefreshTimer(accessToken: string | null) {
    if (!accessToken || !this.autoRefresh) {
      return
    }
    this.cancelRefreshTimer()

    const timeToWait = Math.max(
      2000,
      (decode(accessToken) as JwtPayload).exp! - ms('5s'),
    )

    this.autoRefreshTimer = setTimeout(
      () => (this.refreshToken ? this.login() : 0),
      timeToWait,
    )
  }

  private async callAPI<T>(path: string, init?: Config): Promise<T> {
    const response = await fetch(`${this.url}${path}`, {
      ...this.options,
      method: 'POST',
      ...init,
      headers: {
        ...this.options.headers,
        ...init?.headers,
        ...(this.accessToken &&
          path !== 'login' && { 'X-Dgraph-AccessToken': this.accessToken }),
        'X-Auth-Token': 'MjhiZDIyNWQzM2IwODhlNzJkYjdiNGQwYTEzYTg3MDY=',
      },
      cache: 'no-store',
    })

    if (
      (response.status >= 300 || response.status < 200) &&
      path !== 'admin/schema/validate'
    ) {
      console.log(response.headers, response.url, response.status)
      throw new HTTPError(response)
    }

    let json
    const responseText: string = await response.text()

    try {
      json = this.jsonParser(responseText)
    } catch (e) {
      if (init?.acceptRawText) {
        return responseText as T
      }
      const err: ErrorNonJson = new Error('Response is not JSON')
      err.responseText = responseText
      throw err
    }

    if (
      json.errors &&
      !(
        path === 'admin/schema/validate' &&
        json.errors.at(0).extensions.code === 'success'
      )
    ) {
      console.log(json)
      throw new APIError(this.url, json.errors)
    }

    return json
  }
}
