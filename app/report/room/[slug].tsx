import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const RoomReport = () => {
  const { slug } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Report</Text>
      <Text style={styles.description}>
        This is the room report page. You can report rooms here.
      </Text>
      <Text style={styles.description}>
        Room ID: {slug}
      </Text>
    </View>
  );
}

export default RoomReport;

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