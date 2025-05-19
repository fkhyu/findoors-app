import groupBy from 'lodash/groupBy';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
  CalendarProvider,
  ExpandableCalendar,
  TimelineList,
} from 'react-native-calendars';

const ScheduleView = ({ slug }) => {
  // 1) Track the currently selected day:
  const today = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(today);

  // 2) Your raw events in ISO datetime format:
  const rawEvents = [
    {
      id: '1',
      start: '2025-05-18 09:00:00',
      end:   '2025-05-18 10:00:00',
      title:   'Meeting with Client',
      summary: 'Discuss project requirements',
      color:   '#3498db'
    },
    {
      id: '2',
      start: '2025-05-18 13:00:00',
      end:   '2025-05-18 14:00:00',
      title:   'Team Standup',
      summary: 'Weekly progress update',
      color:   '#2ecc71'
    },
    {
      id: '3',
      start: '2025-05-18 16:30:00',
      end:   '2025-05-18 17:30:00',
      title:   'Project Review',
      summary: 'Final design approval',
      color:   '#e74c3c'
    }
  ];

  // 3) Group them by the YYYY-MM-DD date prefix:
  const eventsByDate = groupBy(rawEvents, ev => ev.start.split(' ')[0]);

  // 4) Timeline configuration:
  const timelineProps = {
    format24h: true,
    start: 0,
    end: 24,
    scrollToFirst: false,
    onBackgroundLongPress: (timeString) => {
      console.log('Background long pressed', timeString);
    }
  };

  return (
    <CalendarProvider
      date={currentDate}
      onDateChanged={setCurrentDate}
      showTodayButton
    >
      <ExpandableCalendar
        firstDay={1}
        markedDates={{
          [currentDate]: { selected: true }
        }}
      />

      <TimelineList
        events={eventsByDate}
        timelineProps={timelineProps}
        showNowIndicator
        renderEvent={(event) => (
          <TouchableOpacity
            style={[styles.event, { backgroundColor: event.color }]}
            onPress={() => console.log('Tapped', event)}
          >
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventSummary}>{event.summary}</Text>
          </TouchableOpacity>
        )}
      />
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  event:        { padding: 10, marginVertical: 5, borderRadius: 5 },
  eventTitle:   { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  eventSummary: { color: '#fff', fontSize: 14 },
});

export default ScheduleView;