import { floors } from '@/assets/placeholder/floors'
import FloorItem from '@/components/floorItem'
import { Floor } from '@/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

export default function TabTwoScreen() {
  const router = useRouter()
  const { slug } = useLocalSearchParams();

  // <-- define your handler here:
  const handlePressFloor = (floor: Floor) => {
    // e.g. navigate or show an alert
    router.push(`/buildings/floors/${floor.id}`)
  }

  const filteredFloors = floors.filter((floor) => floor.buildingId === slug)

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 16 }}
        data={filteredFloors}
        keyExtractor={f => f.id}
        renderItem={({ item }) => (
          <FloorItem
            item={item}
            onPressFloor={handlePressFloor}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
})