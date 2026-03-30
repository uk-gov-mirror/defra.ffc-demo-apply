const joi = require('joi')

const queueSchema = joi.object({
  address: joi.string().required()
})

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    type: joi.string(),
    username: joi.string().optional(),
    password: joi.string().optional(),
    managedIdentityClientId: joi.string().optional(),
    useEmulator: joi.bool().default(false)
  },
  applyQueue: queueSchema
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'queue',
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
    useEmulator: process.env.NODE_ENV !== 'production'
  },
  applyQueue: {
    address: process.env.APPLY_QUEUE_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const applyQueue = {
  ...mqResult.value.messageQueue,
  ...mqResult.value.applyQueue
}

module.exports = {
  applyQueue
}
