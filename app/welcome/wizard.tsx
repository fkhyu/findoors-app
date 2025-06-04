// WizardScreen.js

import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const houses = [
  {
    id: '1',
    name: 'Atelier',
    location: 'Lower Haight',
    color: '#F6F6D9',
    emoji: '🎨',
    image: require('@/assets/houses/LowerHaight.png'),
  },
  {
    id: '2',
    name: 'Casa',
    location: 'Mission',
    color: '#F9E5DC',
    emoji: '🌵',
    image: require('@/assets/houses/Mission.png'),
  },
  {
    id: '3',
    name: 'Jiā',
    location: 'Sunset',
    color: '#D4ECE8',
    emoji: '🌅',
    image: require('@/assets/houses/Sunset.png'),
  },
];

const pastelGreen = '#E6F5DE';
const mainText = '#5C7C6E';
const accent = '#F4A261';
const CARD_WIDTH = Math.min(340, Dimensions.get('window').width * 0.92);

export default function WizardScreen() {
  const [step, setStep] = useState(1);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);

  const handleHouseSelection = (house) => {
    setSelectedHouse(house);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedHouse(null);
      setArrivalDate(null);
      setDepartureDate(null);
    }
  };

  const handleFinish = () => {
    alert(
      `You booked ${selectedHouse.name} from ${arrivalDate.toDateString()} to ${departureDate.toDateString()}!`
    );
    setStep(1);
    setSelectedHouse(null);
    setArrivalDate(null);
    setDepartureDate(null);
  };

  return (
    <View style={styles.container}>
      {step === 1 && <HouseScreen goToNextStep={handleHouseSelection} />}
      {step === 2 && selectedHouse && (
        <DateScreen
          house={selectedHouse}
          arrivalDate={arrivalDate}
          departureDate={departureDate}
          onSelectArrival={setArrivalDate}
          onSelectDeparture={setDepartureDate}
          onBack={handleBack}
          onFinish={handleFinish}
        />
      )}
    </View>
  );
}

const HouseScreen = ({ goToNextStep }) => {
  const [selected, setSelected] = useState(null);
  const [anim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{
          ...styles.scrollArea,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Pick your House!</Text>
        <Text style={styles.disclaimer}>
          (Just for fun! Doesn’t affect your real house in Neighborhood.)
        </Text>
        <View style={styles.housesList}>
          {houses.map((house, idx) => (
            <Animated.View
              key={house.id}
              style={{
                opacity: anim,
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [60 + idx * 10, 0],
                    }),
                  },
                ],
                width: '100%',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                style={[
                  styles.houseCard,
                  {
                    backgroundColor: house.color,
                    borderColor: selected === house.id ? accent : 'transparent',
                    transform:
                      selected === house.id ? [{ scale: 1.06 }] : [{ scale: 1 }],
                    shadowOpacity: selected === house.id ? 0.19 : 0.11,
                  },
                ]}
                onPress={() => setSelected(house.id)}
                activeOpacity={0.88}
              >
                <Image
                  source={house.image}
                  style={styles.houseImage}
                  resizeMode="cover"
                />
                <Text style={styles.houseName}>
                  {house.name} {house.emoji}
                </Text>
                <Text style={styles.houseLocation}>{house.location}</Text>
                {selected === house.id && (
                  <Text style={styles.selectedText}>✓ Selected</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            opacity: selected ? 1 : 0.6,
            backgroundColor: selected ? accent : '#F8CDA1',
          },
        ]}
        activeOpacity={selected ? 0.87 : 1}
        disabled={!selected}
        onPress={() => {
          const house = houses.find((h) => h.id === selected);
          goToNextStep(house);
        }}
      >
        <Text style={styles.nextButtonText}>When?</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>🏡 Your house, your style!</Text>
    </View>
  );
};

function DateScreen({
  house,
  arrivalDate,
  departureDate,
  onSelectArrival,
  onSelectDeparture,
  onBack,
  onFinish,
}) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    // build arrival slots: June 1 & June 16, then every 2nd Monday through Aug 11
    const arr = [
      new Date(2025, 5, 1),  // June 1
      new Date(2025, 5, 16), // June 16
    ];
    const last = new Date(2025, 7, 11); // Aug 11
    let cursor = new Date(2025, 5, 16);
    while (true) {
      cursor = new Date(cursor.getTime() + 14 * 24 * 60 * 60 * 1000);
      if (cursor > last) break;
      arr.push(new Date(cursor));
    }
    // departure slots: same arrival dates + Aug 30
    const dep = [...arr, new Date(2025, 7, 30)];
    setSlots(arr.map(d => ({ date: d, type: 'arrival' }))
      .concat(dep.map(d => ({ date: d, type: 'departure' }))));
  }, []);

  // available departures after arrival
  const departureOptions = slots
    .filter(s => s.type === 'departure' && arrivalDate && s.date > arrivalDate)
    .map(s => s.date);

  return (
    <View style={styles.dateContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.dateDateContainer}>
      <Text style={styles.dateTitle}>Select arrival date</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.dateList}
        showsHorizontalScrollIndicator={false}
      >
        {slots
          .filter(s => s.type === 'arrival')
          .map(({ date }) => {
            const isSel = arrivalDate && date.getTime() === arrivalDate.getTime();
            return (
              <TouchableOpacity
                key={date.toISOString()}
                onPress={() => {
                  onSelectArrival(date);
                  onSelectDeparture(null);
                }}
                style={[
                  styles.dateCard,
                  {
                    borderColor: isSel ? accent : 'transparent',
                    backgroundColor: isSel ? accent : '#FFF',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    { color: isSel ? '#FFF' : mainText },
                  ]}
                >
                  {date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
      </View>

      <View style={styles.dateDateContainer}>
      {arrivalDate && (
        <>
          <Text style={[styles.dateTitle, { marginTop: 24 }]}>
            Select departure date
          </Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.dateList}
            showsHorizontalScrollIndicator={false}
          >
            {departureOptions.map((date) => {
              const isSel =
                departureDate && date.getTime() === departureDate.getTime();
              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  onPress={() => onSelectDeparture(date)}
                  style={[
                    styles.dateCard,
                    {
                      borderColor: isSel ? accent : 'transparent',
                      backgroundColor: isSel ? accent : '#FFF',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      { color: isSel ? '#FFF' : mainText },
                    ]}
                  >
                    {date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}
      </View>

      <View style={styles.statsContainer}>
        <Text>
          Wow you'll be coding atleast {40 * (departureDate && arrivalDate ? Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24 * 7)) : 0)} hours this summer!
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            opacity: arrivalDate && departureDate ? 1 : 0.6,
            backgroundColor:
              arrivalDate && departureDate ? accent : '#F8CDA1',
          },
        ]}
        disabled={!(arrivalDate && departureDate)}
        onPress={onFinish}
      >
        <Text style={styles.nextButtonText}>Book →</Text>
      </TouchableOpacity>
    </View>
  );          
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pastelGreen,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollArea: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 48 : 26,
    paddingBottom: 200,
    minHeight: Dimensions.get('window').height,
  },
  title: {
    fontSize: 29,
    fontWeight: '900',
    color: mainText,
    textAlign: 'center',
    letterSpacing: 1.2,
    marginBottom: 10,
    fontFamily:
      Platform.OS === 'ios' ? 'AvenirNext-Heavy' : 'sans-serif-condensed',
  },
  disclaimer: {
    fontSize: 13,
    color: '#B4CBA5',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 290,
  },
  housesList: {
    width: '100%',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 34,
  },
  houseCard: {
    width: CARD_WIDTH,
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 18,
    marginBottom: 22,
    alignItems: 'center',
    shadowColor: '#7A8D7B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.11,
    shadowRadius: 11,
    elevation: 5,
    borderWidth: 3,
    marginHorizontal: 2,
  },
  houseImage: {
    width: CARD_WIDTH - 44,
    height: 180,
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: '#FAFDF7',
    borderWidth: 2,
    borderColor: '#E1EDD6',
  },
  houseName: {
    fontSize: 24,
    color: mainText,
    fontWeight: 'bold',
    letterSpacing: 1.1,
    marginBottom: 2,
    textAlign: 'center',
  },
  houseLocation: {
    fontSize: 16,
    color: '#9CB49D',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedText: {
    marginTop: 10,
    color: accent,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  nextButton: {
    position: 'absolute',
    bottom: 62,
    left: '10%',
    right: '10%',
    paddingVertical: 18,
    borderRadius: 33,
    alignItems: 'center',
    shadowColor: accent,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 7,
    zIndex: 2,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#7A8D7B',
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.85,
  },

  // DateScreen styles
  dateContainer: {
    backgroundColor: pastelGreen,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    alignItems: 'flex-start',
    width: '100%',
    height: '100%', 
  },
  backLink: {
    marginLeft: 16,
    marginBottom: 12,
  },
  backLinkText: {
    fontSize: 18,
    color: mainText,
    fontWeight: 'bold',
  },
  dateTitle: {
    fontSize: 24,
    color: mainText,
    marginLeft: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  dateList: {
    paddingHorizontal: 16,
  },
  dateCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 2,
    marginRight: 12,
    backgroundColor: '#FFF',
    height: 60,
    alignContent: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateDateContainer: {
    width: '100%',
    paddingBottom: 24,
    paddingHorizontal: 16,
    height: '20%',
  },
  statsContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'flex-start',
  },
});