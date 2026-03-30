describe('Application Insights', () => {
  const DEFAULT_ENV = process.env
  let useAzureMonitor

  beforeEach(() => {
    jest.resetModules()

    jest.mock('@azure/monitor-opentelemetry', () => ({
      useAzureMonitor: jest.fn()
    }))

    useAzureMonitor = require('@azure/monitor-opentelemetry').useAzureMonitor

    process.env = { ...DEFAULT_ENV }
  })

  afterAll(() => {
    process.env = DEFAULT_ENV
  })

  test('does not setup application insights if no connection string', () => {
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = undefined

    const appInsights = require('../../app/insights')

    appInsights.setup()

    expect(useAzureMonitor).not.toHaveBeenCalled()
  })

  test('does setup application insights if connection string present', () => {
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = 'test-connection-string'

    const appInsights = require('../../app/insights')

    appInsights.setup()

    expect(useAzureMonitor).toHaveBeenCalledTimes(1)
    expect(useAzureMonitor).toHaveBeenCalledWith({
      azureMonitorExporterOptions: {
        connectionString: 'test-connection-string'
      },
      instrumentationOptions: {
        http: {
          enabled: true,
          ignoreIncomingRequestHook: expect.any(Function)
        }
      }
    })

    const options = useAzureMonitor.mock.calls[0][0]
    expect(options.instrumentationOptions.http.ignoreIncomingRequestHook({ url: '/healthz' })).toBe(true)
    expect(options.instrumentationOptions.http.ignoreIncomingRequestHook({ url: '/healthy' })).toBe(true)
    expect(options.instrumentationOptions.http.ignoreIncomingRequestHook({ url: '/foo' })).toBe(false)
  })
})
