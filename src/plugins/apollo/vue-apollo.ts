import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { logErrorMessages } from '@vue/apollo-util'
import { setContext } from '@apollo/client/link/context'

// Http endpoint
const httpEndpoint = 'https://countries.trevorblades.com/'

// for cypress need to extend gql request to identify each request
// https://github.com/cypress-io/cypress-documentation/issues/122#issuecomment-634693934
const gqlCypressAddOperationNames = (input: RequestInfo | URL, options: RequestInit) => {
  // @ts-expect-error we know that options.body defined
  return fetch(`${input}?operation=${JSON.parse(options.body).operationName}`, options)
}

const prepareHttpLinkOptions = (uri: string) => {
  return import.meta.env.MODE !== 'production' ? { uri, fetch: gqlCypressAddOperationNames } : { uri }
}

const httpLink = createHttpLink(prepareHttpLinkOptions(httpEndpoint))

// Handle errors globally
// https://v4.apollo.vuejs.org/guide-composable/error-handling.html#network-errors
const errorLink = onError((error) => {
  const { networkError } = error
  if (import.meta.env.MODE !== 'production') {
    logErrorMessages(error)
  }
})

const defaultOptions = {
  cache: new InMemoryCache(), // Cache method implementation
  connectToDevTools: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
}

// Create the apollo client for "API schema"
// @ts-expect-error options correct
export const apolloDefaultClient = new ApolloClient({
  ...{ link: errorLink.concat(httpLink) }, // merge options with link
  ...defaultOptions,
})
