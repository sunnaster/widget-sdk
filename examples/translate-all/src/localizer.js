import yandexTranslator from './yandex-translator'
import {arrayLocalizableToTextLocalizables, localeToLanguage} from './helpers.js'

export default class Localizer {
  constructor (options) {
    this._options = options
  }

  localize (localizables) {
    const promises = []
    for (let localizable of localizables) {
      const p = this._handleLocalizable(localizable)
      promises.push(p)
    }
    return Promise.all(promises)
  }

  _handleLocalizable (localizable) {
    const {srcValue, valueType} = localizable
    if (
      ['Symbol', 'Text'].indexOf(valueType) > -1 &&
      typeof srcValue === 'string'
    ) {
      return this._translateLocale(localizable)
    } else if (
      valueType === 'Array' && Array.isArray(srcValue)
    ) {
      const textLocalizables = arrayLocalizableToTextLocalizables(localizable)
      return this.localize(textLocalizables)
    } else {
      return this._handleUntranslatable(localizable)
    }
  }

  _translateLocale (localizable) {
    const {locale, srcLocale, srcValue, localize} = localizable
    const sourceLang = localeToLanguage(srcLocale)
    const targetLang = localeToLanguage(locale)
    return yandexTranslator
      .lookup(srcValue, targetLang, sourceLang)
      .then((result) => {
        if (typeof result === 'string') {
          localize(result)
          return result
        } else {
          return this._handleUntranslatable(localizable)
        }
      })
  }

  _handleUntranslatable (localizable) {
    if (this._options.copyUntranslatableLocales) {
      return this._copyLocale(localizable)
    } else {
      return Promise.resolve()
    }
  }

  _copyLocale ({srcValue, localize}) {
    localize(srcValue)
    return Promise.resolve(srcValue)
  }
}
