import FeatureSelectButton from "@/components/featureSelectButton";
import FindRoomView from "@/components/findRoomView";
import Spacer from "@/components/Spacer";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Find = () => {
  const [ selectedCont, setSelectedCont ] = useState("starts");
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ selectedDuration, setSelectedDuration ] = useState(15);
  const [ selectedPeople, setSelectedPeople ] = useState(2);
  const [ selectedFeatures, setSelectedFeatures ] = useState([]);
  const [ showSearchBar, setShowSearchBar ] = useState(false); // New state for search bar visibility
  
  const handlePeopleDecrement = () => { if (selectedPeople > 1) setSelectedPeople(p => p - 1); };
  const handlePeopleIncrement = () => { if (selectedPeople < 30) setSelectedPeople(p => p + 1); };
  const handleDurationDecrement = () => { if (selectedDuration > 15) setSelectedDuration(p => p - 15); };
  const handleDurationIncrement = () => { if (selectedDuration < 90) setSelectedDuration(p => p + 15); };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Find a Room</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Pressable 
            onPress={() => {}}
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              { marginRight: 16, }
            ]}
          >
            <MaterialCommunityIcons name="filter-remove" size={28} color="white" />
          </Pressable>
          <Pressable 
            onPress={() => setShowSearchBar(true)} // Show search bar on press
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              { marginRight: 16, }
            ]}
          >
            <MaterialIcons name="search" size={28} color="white" />
          </Pressable>
        </View>
      </View>
      <ScrollView style={{ flex: 1, marginBottom: 48, }}>
      <View style={styles.searchOptionsContainer}>
      { 
        selectedCont === "datetime" ? (
          <Pressable style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.startsContainer
            ]}
            onPress={() => setSelectedCont("")}>
            <View style={styles.maxTopContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="calendar-month" size={28} color="black"  />
                <Text style={styles.minLeftText}>Date</Text>
              </View>
              <Text>{selectedDate.toDateString()}</Text>
            </View>
            <View style={styles.maxBottomContainer}>
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode="time"
                is24Hour={true}
                display="default"
                minuteInterval={15}
                textColor="black"
                onChange={(event, date) => {
                  setSelectedDate(date);
                }}
              />
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode="date"
                is24Hour={true}
                display="default"
                textColor="black"
                maximumDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)}
                minimumDate={new Date(Date.now())}
                onChange={(event, date) => {
                  setSelectedDate(date);
                }}
              />
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
              <Text>{selectedDate.toDateString()}</Text>
            </View>
          </Pressable>
        )
      }
      <Spacer width={99}/>
      { 
        selectedCont === "duration" ? (
          <Pressable style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.durationContainer
            ]}
            onPress={() => setSelectedCont("")}>
            <View style={styles.maxTopContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="access-time" size={28} color="black"  />
                <Text style={styles.minLeftText}>Duration</Text>
              </View>
              <Text>{selectedDuration} min</Text>
            </View>
            <View style={styles.maxBottomContainer}>
              <Pressable 
                onPress={handleDurationDecrement}
                style={{ 
                  padding: 16, 
                  backgroundColor: '#ebebeb', 
                  borderRadius: 16,
                  opacity: selectedDuration > 15 ? 1 : 0.5 
                }}
              >
                <MaterialIcons name="remove" size={28} color="black"  />
                </Pressable>
              <View>
                <TextInput style={{ fontSize: 28, fontWeight: 'semibold', paddingHorizontal: 24 }}>{selectedDuration} min</TextInput>
              </View>
              <Pressable 
                onPress={handleDurationIncrement}
                style={{ 
                  padding: 16, 
                  backgroundColor: '#ebebeb', 
                  borderRadius: 16,
                  opacity: selectedDuration >= 90 ? 0.5 : 1 
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
            onPress={() => setSelectedCont("duration")}
          >
            <View style={styles.minLeft}>
              <MaterialIcons name="access-time" size={28} color="black"  />
              <Text style={styles.minLeftText}>Duration</Text>
            </View>
            <View style={styles.minRight}>
              <Text>{selectedDuration} min</Text>
            </View>
          </Pressable>
        )
      }
      <Spacer width={99}/>
      { 
        selectedCont === "people" ? (
          <Pressable style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.peopleContainer
            ]}
            onPress={() => setSelectedCont("")}>
            <View style={styles.maxTopContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="people" size={28} color="black"  />
                <Text style={styles.minLeftText}>People</Text>
              </View>
              <Text>{selectedPeople}</Text>
            </View>
            <View style={styles.maxBottomContainer}>
              <Pressable 
                onPress={handlePeopleDecrement}
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
                onPress={handlePeopleIncrement}
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
      <Spacer width={99}/>
      { 
        selectedCont === "features" ? (
          <Pressable style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              styles.featuresContainer
            ]}
            onPress={() => setSelectedCont("")}>
            <View style={styles.maxTopContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="fact-check" size={28} color="black"  />
                <Text style={styles.minLeftText}>Features</Text>
              </View>
              <Text>{selectedFeatures.length}</Text>
            </View>
            <View style={styles.featuresBottomContainer}>
              {/*<View style={styles.featuresRowContainer}>
                <FeatureSelectButton 
                  feature="classroom" 
                  onPress={() => {
                    if (selectedFeatures.includes("classroom")) {
                      setSelectedFeatures(selectedFeatures.filter(f => f !== "classroom"));
                    } else {
                      setSelectedFeatures([...selectedFeatures, "classroom"]);
                    }
                  }} 
                  icon="tv" 
                  title="Classroom"
                />
              </View>*/}
              <View style={styles.featuresRowContainer}>
                <FeatureSelectButton 
                  feature="display" 
                  onPress={() => {
                    if (selectedFeatures.includes("display")) {
                      setSelectedFeatures(selectedFeatures.filter(f => f !== "display"));
                    } else {
                      setSelectedFeatures([...selectedFeatures, "display"]);
                    }
                  }} 
                  icon="tv" 
                  title="Display"
                  selected={selectedFeatures.includes("display")}
                />
                <FeatureSelectButton 
                  feature="blackboard" 
                  onPress={() => {
                    if (selectedFeatures.includes("blackboard")) {
                      setSelectedFeatures(selectedFeatures.filter(f => f !== "blackboard"));
                    } else {
                      setSelectedFeatures([...selectedFeatures, "blackboard"]);
                    }
                  }} 
                  icon="blackboard" 
                  title="Board"
                  selected={selectedFeatures.includes("wifi")}
                />
                <FeatureSelectButton 
                  feature="wifi" 
                  onPress={() => {
                    if (selectedFeatures.includes("wifi")) {
                      setSelectedFeatures(selectedFeatures.filter(f => f !== "wifi"));
                    } else {
                      setSelectedFeatures([...selectedFeatures, "wifi"]);
                    }
                  }} 
                  icon="tv" 
                  title="Display"
                  selected={selectedFeatures.includes("wifi")}
                />
              </View>
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
              <Text>{selectedFeatures.length}</Text>
            </View>
          </Pressable>
        )
      }
      </View>
      <Pressable style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 },
        styles.findContainer
      ]}>
        <Text style={styles.findText}>Find</Text>
      </Pressable>
      <Spacer/>
      <View style={{ padding: 8, paddingBottom: 0, }}>
        <Text>Favourites:</Text>
      </View>
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        keyExtractor={(item) => item.toString()}

        renderItem={({ item }) => (
          <FindRoomView/>
        )}
      />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Find;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    width: '100%',
    height: 60,
    backgroundColor: '#4A89EE',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  topBarText: {
    fontSize: 22,
    fontWeight: 'semibold',
    color: '#fff',
    marginLeft: 16,
  },
  searchOptionsContainer: {
    backgroundColor: '#fff',
    padding: 8,
    paddingBottom: 0,
  },
  startsContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.16,
    flexDirection: 'column',
  },
  durationContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.16,
    flexDirection: 'column',
  },
  peopleContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.16,
    flexDirection: 'column',
  },
  featuresContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.16,
    flexDirection: 'column',
  },
  maxTopContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.06,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  maxBottomContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    paddingTop: 0,
  },
  minContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.07,
    marginVertical: 0,
    flexDirection: 'row',
    padding: 8,
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
  findContainer: {
    height: SCREEN_HEIGHT * 0.07,
    backgroundColor: '#3478F5',
    marginVertical: 4,
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  findText: {
    fontWeight: 'semibold',
    fontSize: 20,
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
  },
  featuresBottomContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 8,
    paddingTop: 0,
  },
  featuresRowContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    paddingTop: 0,
  }
});