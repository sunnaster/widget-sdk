import initializeApi, {
  __RewireAPI__ as initializeApiRewireApi
} from '../../lib/api/initialize'

const createdApi = {}
initializeApiRewireApi.__Rewire__('createApi', () => {
  return createdApi
})

describe(`initializeApi(apiCreator)`, () => {
  let cfWidget
  beforeEach(() => {
    cfWidget = initializeApi()
  })

  describe(`returned "Contentful widget" object`, () => {
    describe(`.init(callback)`, () => {
      it(`is a function`, () => {
        expect(cfWidget.init).to.be.a('function')
      })

      describe(`called before Widget API is ready`, () => {
        it(`does not invoke callback`, () => {
          const spy = sinon.spy()
          cfWidget.init(spy)
          expect(spy).to.have.callCount(0)
        })
      })

      describe(`called after Widget API is ready`, () => {
        it(`immediately invokes callback`, (done) => {
          signalWidgetReady()
          setTimeout(() => {
            const spy = sinon.spy()
            cfWidget.init(spy)
            expect(spy).to.have.callCount(1)
            done()
          }, 0)
        })
      })

      describe(`callback`, () => {
        it(`gets invoked once ready state got signaled`, (done) => {
          cfWidget.init(() => done())
          signalWidgetReady()
        })
        it(`does not get called again if ready state is signaled again`, (done) => {
          const spy = sinon.spy()
          cfWidget.init(spy)
          signalWidgetReady()
          signalWidgetReady()
          setTimeout(() => {
            expect(spy).to.have.callCount(1)
            done()
          }, 0)
        })
        it(`provides the api created by the 'createApi' dependency`, (done) => {
          cfWidget.init((api) => {
            expect(api).to.equal(createdApi)
            done()
          })
          signalWidgetReady()
        })
      })
    })
  })

  function signalWidgetReady () {
    window.postMessage({
      method: 'connect',
      params: [{
        id: 'foo'
      }]
    }, '*')
  }
})
