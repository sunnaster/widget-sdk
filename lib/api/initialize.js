import Channel from './channel'
import Signal from './signal'

export default function initializeApi (apiCreator) {
  const channel = new Channel(null, parent.targetWindow)
  let apiInitCallbacks = new Signal()
  let createdApi

  const removeHandler = channel.addHandler('connect', function (params) {
    removeHandler()
    channel.sourceId = params.id

    createdApi = apiCreator(channel, params)

    apiInitCallbacks.dispatch(createdApi)
    apiInitCallbacks = null
  })

  return {init}

  function init (initCb) {
    if (createdApi) {
      initCb(createdApi)
    } else {
      apiInitCallbacks.attach(initCb)
    }
  }
}
