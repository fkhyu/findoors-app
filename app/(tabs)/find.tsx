import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Find = () => {
  const [ selectedCont, setSelectedCont ] = useState("starts");
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ selectedDuration, setSelectedDuration ] = useState(0);
  const [ selectedPeople, setSelectedPeople ] = useState(2);
  const [ selectedFeatures, setSelectedFeatures ] = useState([]);
  
  const handleDecrement = () => { if (selectedPeople > 1) setSelectedPeople(p => p - 1); };
  const handleIncrement = () => { if (selectedPeople < 50) setSelectedPeople(p => p + 1); };

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
              <Text style={styles.minLeftText}>Date</Text>
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
              <MaterialIcons name="calendar-month" size={28} color="black"  />
              <Text style={styles.minLeftText}>Date</Text>
            </View>
            <View style={styles.minRight}>
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
              <MaterialIcons name="access-time" size={28} color="black"  />
              <Text style={styles.minLeftText}>Duration</Text>
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
              <MaterialIcons name="access-time" size={28} color="black"  />
              <Text style={styles.minLeftText}>Duration</Text>
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
              <Pressable 
                onPress={handleDecrement}
                style={{ 
                  padding: 16, 
                  backgroundColor: '#ebebeb', 
                  borderRadius: 16,
                  opacity: selectedPeople > 1 ? 1 : 0.5 
                }}
              >
                <MaterialIcons name="remove" size={28} color="black"  />
                </Pressable>
              <View>
                <TextInput style={{ fontSize: 28, fontWeight: 'semibold', paddingHorizontal: 24 }}>{selectedPeople}</TextInput>
              </View>
              <Pressable 
                onPress={handleIncrement}
                style={{ 
                  padding: 16, 
                  backgroundColor: '#ebebeb', 
                  borderRadius: 16,
                  opacity: selectedPeople >= 50 ? 0.5 : 1 
                }}
              >
                <MaterialIcons name="add" size={28} color="black" />
              </Pressable>
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
              <Text>{selectedPeople}</Text>
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
              <MaterialIcons name="fact-check" size={28} color="black"  />
              <Text style={styles.minLeftText}>Features</Text>
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
              <MaterialIcons name="fact-check" size={28} color="black"  />
              <Text style={styles.minLeftText}>Features</Text>
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
    height: SCREEN_HEIGHT * 0.16,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    flexDirection: 'column',
  },
  featuresContainer: {

  },
  maxTopContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.08,
    backgroundColor: '#e0e0e0',
    alignContent: 'center',
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 0,
  },
  maxBottomContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
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