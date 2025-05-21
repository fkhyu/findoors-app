import { default as enMessages, default as fiMessages, default as svMessages } from '@/locales/en/messages.po'
import { i18n } from '@lingui/core'
import { I18nProvider, Trans } from '@lingui/react'
import { getLocales } from 'expo-localization'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

// register catalogs
i18n.load({
  en: enMessages,
  fi: fiMessages,
  sv: svMessages,
})

const GeoJsonImport = () => {
  const locales = getLocales()

  const [locale, setLocale] = useState<string>(
    locales[0].languageCode
  )

  useEffect(() => {
    i18n.activate(locale)
  }, [locale])

  return (
    <I18nProvider i18n={i18n}>
      <View style={styles.container}>
        <Text style={styles.title}>
          <Trans>Select your language</Trans>
        </Text>

        <View style={styles.buttons}>
          <Button title="English" onPress={() => setLocale('en')} />
          <Button title="Suomi" onPress={() => setLocale('fi')} />
          <Button title="Svenska" onPress={() => setLocale('sv')} />
        </View>

        <Text style={styles.description}>
          <Trans>
            The UI will immediately switch to the selected language.
          </Trans>
        </Text>
      </View>
    </I18nProvider>
  )
}

export default GeoJsonImport

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
})