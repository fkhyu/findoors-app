import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Find = () => {
  const [ selectedCont, setSelectedCont ] = useState("starts");

  return (
    <SafeAreaView style={styles.container}>
      { 
        selectedCont === "datetime" ? (
          <Pressable style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.startsContainer
            ]}
            onPress={() => setSelectedCont("")}>
            <View style={styles.maxTopContainer}>
              <MaterialIcons name="people" size={28} color="black"  />
              <Text style={styles.minLeftText}>People</Text>
            </View>
            <View style={styles.maxBottomContainer}>
              
            </View>
          </Pressable>
        ) : (
          <Pressable 
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.minContainer
            ]}
            onPress={() => setSelectedCont("datetime")}
          >
            <View style={styles.minLeft}>
              <MaterialIcons name="people" size={28} color="black"  />
              <Text style={styles.minLeftText}>People🔥</Text>
            </View>
            <View style={styles.minRight}>
              {/* People Count */}
              <Text>1</Text>
            </View>
          </Pressable>
        )
      }
      { 
        selectedCont === "duration" ? (
          <Pressable style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.durationContainer
            ]}
            onPress={() => setSelectedCont("")}>
            <View style={styles.maxTopContainer}>
              <MaterialIcons name="people" size={28} color="black"  />
              <Text style={styles.minLeftText}>People</Text>
            </View>
            <View style={styles.maxBottomContainer}>
              
            </View>
          </Pressable>
        ) : (
          <Pressable 
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.minContainer
            ]}
            onPress={() => setSelectedCont("duration")}
          >
            <View style={styles.minLeft}>
              <MaterialIcons name="people" size={28} color="black"  />
              <Text style={styles.minLeftText}>People</Text>
            </View>
            <View style={styles.minRight}>
              {/* People Count */}
              <Text>1</Text>
            </View>
          </Pressable>
        )
      }
      { 
        selectedCont === "people" ? (
          <Pressable style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.peopleContainer
            ]}
            onPress={() => setSelectedCont("")}>
            <View style={styles.maxTopContainer}>
              <MaterialIcons name="people" size={28} color="black"  />
              <Text style={styles.minLeftText}>People</Text>
            </View>
            <View style={styles.maxBottomContainer}>
              
            </View>
          </Pressable>
        ) : (
          <Pressable 
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.minContainer
            ]}
            onPress={() => setSelectedCont("people")}
          >
            <View style={styles.minLeft}>
              <MaterialIcons name="people" size={28} color="black"  />
              <Text style={styles.minLeftText}>People</Text>
            </View>
            <View style={styles.minRight}>
              {/* People Count */}
              <Text>1</Text>
            </View>
          </Pressable>
        )
      }
      { 
        selectedCont === "features" ? (
          <Pressable style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.featuresContainer
            ]}
            onPress={() => setSelectedCont("")}>
            <View style={styles.maxTopContainer}>
              <MaterialIcons name="people" size={28} color="black"  />
              <Text style={styles.minLeftText}>People</Text>
            </View>
            <View style={styles.maxBottomContainer}>
              
            </View>
          </Pressable>
        ) : (
          <Pressable 
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.minContainer
            ]}
            onPress={() => setSelectedCont("features")}
          >
            <View style={styles.minLeft}>
              <MaterialIcons name="people" size={28} color="black"  />
              <Text style={styles.minLeftText}>People</Text>
            </View>
            <View style={styles.minRight}>
              {/* People Count */}
              <Text>1</Text>
            </View>
          </Pressable>
        )
      }
    </SafeAreaView>
  );
}

export default Find;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  startsContainer: {

  },
  durationContainer: {

  },
  peopleContainer: {
    width: '100%',
    height: '16%',
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    flexDirection: 'column',
    padding: 16,
  },
  featuresContainer: {

  },
  maxTopContainer: {
    width: '100%',
    height: '8%',
    backgroundColor: '#e0e0e0',
    alignContent: 'center',
  },
  maxBottomContainer: {
    width: '100%',
    height: '8%',
    backgroundColor: '#e0e0e0',
  },
  minContainer: {
    width: '100%',
    height: '8%',
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    flexDirection: 'row',
    padding: 16,
  },
  minLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  minLeftText: {
    marginLeft: 8,
    fontWeight: 'semibold',
    fontSize: 16,
  },
  minRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});