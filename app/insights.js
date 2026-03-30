const { useAzureMonitor } = require('@azure/monitor-opentelemetry')

function setup () {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

  if (connectionString) {
    useAzureMonitor({
      azureMonitorExporterOptions: {
        connectionString
      },
      instrumentationOptions: {
        http: {
          enabled: true,
          ignoreIncomingRequestHook: (request) => {
            const url = request.url ?? ''
            return url.includes('healthz') || url.includes('healthy')
          }
        }
      }
    })

    console.log('Azure Monitor (OpenTelemetry) Running')
  } else {
    console.log('Azure Monitor Not Running!')
  }
}

module.exports = { setup }
