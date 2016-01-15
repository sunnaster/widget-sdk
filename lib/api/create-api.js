import FieldLocale from './field-locale'
import createWindow from './window'
import createEntry from './entry'
import createSpace from './space'

export default function createAPI (channel, {entry, locales, field, fieldInfo}) {
  return {
    locales,
    field: new FieldLocale(channel, field),
    entry: createEntry(channel, entry, fieldInfo, locales.default),
    space: createSpace(channel),
    window: createWindow(channel)
  }
}
