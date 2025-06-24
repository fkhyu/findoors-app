import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { eulaLastUpdatedDate, eulaParagraphs } from './eulacontents';

const pastelGreen = '#E6F5DE';
const mainText = '#5C7C6E';

export default function EULAScreen() {
  const router = useRouter();

  const renderParagraphText = (text: string) => {
    // Split text by newlines and render each line
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <Text key={index} style={styles.paragraph}>
        {line}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'End User License Agreement',
          headerStyle: { backgroundColor: pastelGreen },
          headerTitleStyle: { color: mainText, fontWeight: '900' },
          headerTintColor: mainText,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last updated: {eulaLastUpdatedDate}</Text>
        
        {eulaParagraphs.map((section, index) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {index + 1}. {section.title}
            </Text>
            {renderParagraphText(section.text)}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Findoors, you acknowledge that you have read, understood, and agree to be 
            bound by this End User License Agreement.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pastelGreen,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: mainText,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: mainText,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: mainText,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 6,
    marginLeft: 8,
  },
  footer: {
    marginTop: 32,
    marginBottom: 40,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
  footerText: {
    fontSize: 12,
    color: mainText,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
