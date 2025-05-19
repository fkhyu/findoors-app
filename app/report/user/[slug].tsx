import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const UserReport = () => {
  const { slug } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Report</Text>
      <Text style={styles.description}>
        This is the user report page. You can report users here.
      </Text>
      <Text style={styles.description}>
        User ID: {slug}
      </Text>
    </View>
  );
}

export default UserReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
});