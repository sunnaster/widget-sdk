import Channel from './channel'
import Signal from './signal'
import createApi from './create-api'

export default function initializeApi () {
  const channel = new Channel(window.parent)
  let apiInitCallbacks = new Signal()
  let createdApi

  const removeHandler = channel.addHandler('connect', function (params) {
    removeHandler()
    channel.sourceId = params.id

    createdApi = createApi(channel, params)

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
