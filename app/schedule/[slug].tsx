import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Timeline } from 'react-native-calendars';

const ScheduleView = () => {
  const { slug } = useLocalSearchParams();
  
  // Current date
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Sample events for the timeline
  const [events, setEvents] = useState([
    {
      day: 1,      // day of month (1-31)
      month: 1,    // month of year (1-12)
      year: 2017,  // year
      id: '1',
      title: 'Meeting with Client',
      summary: 'Discuss project requirements',
      color: '#3498db',
      time: '09:00'
    },
    {
      day: 1,      // day of month (1-31)
      month: 1,    // month of year (1-12)
      year: 2017,  // year
      id: '2',
      title: 'Team Standup',
      summary: 'Weekly progress update',
      color: '#2ecc71',
      time: '13:00'
    },
    {
      day: 1,      // day of month (1-31)
      month: 1,    // month of year (1-12)
      year: 2017,  // year
      id: '3',
      title: 'Project Review',
      summary: 'Final design approval',
      color: '#e74c3c',
      time: '16:30'
    }
  ]);

  const handleEventPress = (event) => {
    console.log('Selected event:', event);
    // Handle event selection - show details, edit, etc.
  };

  const handleTimeSlotPress = (timeString) => {
    console.log('Create event at:', timeString);
    // Logic to create a new event at the selected time
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule: {slug}</Text>
      <Text style={styles.date}>{selectedDate}</Text>
      
      <Timeline
        date={selectedDate}
        events={events}
        renderEvent={(event) => (
          <TouchableOpacity
            style={[styles.event, { backgroundColor: event.color }]}
            onPress={() => handleEventPress(event)}
          >
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventSummary}>{event.summary}</Text>
          </TouchableOpacity>
        )}
        onBackgroundLongPress={handleTimeSlotPress}
        start={8} // Start time: 8 AM
        end={18}  // End time: 6 PM
        format24h={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  date: {
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  event: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventSummary: {
    fontSize: 14,
    color: '#fff',
  },
});

export default ScheduleView;