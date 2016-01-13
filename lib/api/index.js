import initializeApi from './connect'
import FieldLocale from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'

window.contentfulWidget = initializeApi(createWidgetAPI)
export default window.contentfulWidget

function createWidgetAPI (channel, {entry, locales, field, fieldInfo}) {
  return {
    locales,
    field: new FieldLocale(channel, field),
    entry: createEntry(channel, entry, fieldInfo, locales.default),
    space: createSpace(channel),
    window: createWindow(channel)
  }
}
