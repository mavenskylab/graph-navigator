import { DgraphClientStub } from './client-stub'
import { ERR_NO_CLIENTS } from './errors'
import { Txn } from './txn'
import { AdminQuery, AdminVariables, Operation, TxnOptions } from './types'
import { stringifyMessage } from './util'

/**
 * Client is a transaction aware client to a set of Dgraph server instances.
 */
export class DgraphClient {
  private readonly clients: DgraphClientStub[]
  private debugMode: boolean = false
  private queryTimeout: number = 600

  /**
   * Creates a new Client for interacting with the Dgraph store.
   *
   * The client can be backed by multiple connections (to the same server, or
   * multiple servers in a cluster).
   */
  constructor(...clients: DgraphClientStub[]) {
    if (clients.length === 0) {
      throw ERR_NO_CLIENTS
    }

    this.clients = clients
  }

  /**
   * Set timeout applied to all queries made via this client.
   */
  public setQueryTimeout(timeout: number): DgraphClient {
    this.queryTimeout = timeout
    return this
  }

  public getQueryTimeout() {
    return this.queryTimeout
  }

  /**
   * By setting various fields of api.Operation, alter can be used to do the
   * following:
   *
   * 1. Modify the schema.
   * 2. Drop a predicate.
   * 3. Drop the database.
   */
  public async alter(op: Operation) {
    this.debug(`Alter request:\n${stringifyMessage(op)}`)

    const c = this.anyClient()
    return c.alter(op)
  }

  public async admin<T extends AdminQuery>(
    queries: T,
    variables: AdminVariables[T],
  ) {
    this.debug(`Admin request:\n${stringifyMessage({ queries, variables })}`)

    const c = this.anyClient()

    if (queries === 'dropData') return c.alter({ dropAll: true })

    return c.admin(queries, variables)
  }

  public async query<T>(queries: any, variables: any) {
    this.debug(`Query request:\n${stringifyMessage({ queries, variables })}`)

    const c = this.anyClient()

    return c.query(queries, variables)
  }

  public async validateSchema(schema: string) {
    this.debug(`Admin request:\n${stringifyMessage({ schema })}`)

    const c = this.anyClient()
    return c.validateSchema(schema)
  }

  public setAlphaAuthToken(authToken: string) {
    this.clients.forEach((c: DgraphClientStub) =>
      c.setAlphaAuthToken(authToken),
    )
  }

  public setCloudApiKey(apiKey: string) {
    this.clients.forEach((c: DgraphClientStub) => c.setCloudApiKey(apiKey))
  }

  /**
   * login obtains access tokens from Dgraph Server
   */
  public async login(userid: string, password: string) {
    this.debug(`Login request:\nuserid: ${userid}`)

    const c = this.anyClient()
    return c.login(userid, password)
  }

  /**
   * loginIntoNamespace obtains access tokens from Dgraph Server for the particular userid & namespace
   */
  public async loginIntoNamespace(
    userid: string,
    password: string,
    namespace?: number,
  ) {
    this.debug(`Login request:\nuserid: ${userid}`)

    const c = this.anyClient()
    return c.loginIntoNamespace(userid, password, namespace)
  }

  /**
   * logout - forget all access tokens.
   */
  public logout() {
    this.debug('Logout')
    this.clients.forEach((c: DgraphClientStub) => c.logout())
  }

  /**
   * newTxn creates a new transaction.
   */
  public newTxn(options?: TxnOptions) {
    return new Txn(this, options)
  }

  /**
   * setDebugMode switches on/off the debug mode which prints helpful debug messages
   * while performing alters, queries and mutations.
   */
  public setDebugMode(mode: boolean) {
    this.debugMode = mode
  }

  public fetchUiKeywords() {
    return this.anyClient().fetchUiKeywords()
  }

  /**
   * getHealth gets client or cluster health
   */
  public async getHealth(all = true) {
    return this.anyClient().getHealth(all)
  }

  /**
   * getState gets cluster state
   */
  public async getState() {
    return this.anyClient().getState()
  }

  /**
   * debug prints a message on the console if debug mode is switched on.
   */
  public debug(msg: string) {
    if (this.debugMode) {
      console.log(msg)
    }
  }

  public anyClient() {
    return this.clients[Math.floor(Math.random() * this.clients.length)]
  }
}
