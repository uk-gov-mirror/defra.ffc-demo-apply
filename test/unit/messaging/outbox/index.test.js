jest.mock('../../../../app/messaging/outbox/publish-pending', () => jest.fn())

describe('messaging/outbox/index', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
    process.env.NODE_ENV = 'test'
    process.env.APPLY_QUEUE_ADDRESS = 'apply-queue'
    process.env.PUBLISH_POLLING_INTERVAL = '2500'
    jest.spyOn(global, 'setInterval').mockImplementation(() => 1)
    jest.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
    jest.restoreAllMocks()
  })

  test('schedules publishPending at configured interval', async () => {
    const outbox = require('../../../../app/messaging/outbox')
    await outbox.start()
    expect(setInterval).toHaveBeenCalled()
    expect(setInterval.mock.calls[0][1]).toBe(2500)
  })
})
