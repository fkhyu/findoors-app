import { buildings } from '@/assets/placeholder/buildings'
import { floors } from '@/assets/placeholder/floors'
import BuildingItem from '@/components/buildingItem'
import FloorItem from '@/components/floorItem'
import FilterModal from '@/components/modal/filterModal'
import { Building, Floor } from '@/types'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import React, { useRef } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function TabTwoScreen() {
  const router = useRouter()
  const [selectedFilters, setSelectedFilters] = React.useState({})
  const filterModalRef = useRef<BottomSheetModal>(null);

  const handlePressBuilding = (building: Building) => {
    router.push(`/buildings/${building.id}`)
  }

  const handlePressFloor = (floor: Floor) => {
    router.push(`/buildings/floors/${floor.id}`)
  }
  
  const filteredFloors = floors.filter((floor) => floor.buildingId === buildings[0].id)
  

  if (buildings.length === 1) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Floors</Text>
          <TouchableOpacity
            onPress={() => filterModalRef.current?.present()}
            style={{ marginTop: 16, padding: 8, backgroundColor: '#007AFF', borderRadius: 5 }}
          >
            <Text style={{ color: '#fff' }}>Filter</Text>
          </TouchableOpacity>
        </View>
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

  return (
    <View style={{ flex: 1 }}>
    <BottomSheetModalProvider>
      <View style={styles.header}>
        <Text style={styles.headerText}>Buildings</Text>
        <TouchableOpacity
          onPress={() => filterModalRef.current?.present()}
          style={{ marginTop: 16, padding: 8, backgroundColor: '#007AFF', borderRadius: 5 }}
        >
          <Text style={{ color: '#fff' }}>Filter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 16 }}
        data={buildings}
        keyExtractor={b => b.id}
        renderItem={({ item }) => (
          <BuildingItem
            item={item}
            onPressBuilding={handlePressBuilding}
          />
        )}
      />

      <FilterModal
          ref={filterModalRef}
          initialFilters={selectedFilters}
          onClose={() => {/* hide UI state if needed */}}
          onApplyFilters={f => setSelectedFilters(f)}
        />
    </BottomSheetModalProvider>
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