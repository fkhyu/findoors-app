import RoomItem from '@/components/RoomItem';
import { Room } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';

type AccordionProps = {
  title: string;
  data: Room[];
  handleRoomPress: (f: Room) => void
};

const Accordion: React.FC<AccordionProps> = ({ title, data, handleRoomPress }) => {
  // start open
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(o => !o);
  };

  return (
    <View style={styles.accordion}>
      <TouchableOpacity onPress={toggleCollapse} style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color="#333"
          style={{
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
          }}
        />
      </TouchableOpacity>

      <Collapsible collapsed={!isOpen} align="top">
        <View style={styles.contentWrapper}>
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <RoomItem item={item} onPressRoom={handleRoomPress} />
            )}
            nestedScrollEnabled={true}
          />
        </View>
      </Collapsible>
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  accordion: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  accordionHeader: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  contentWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

