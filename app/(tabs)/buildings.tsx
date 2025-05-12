import { buildings } from '@/assets/placeholder/buildings'
import BuildingItem from '@/components/buildingItem'
import FilterModal from '@/components/modal/filterModal'
import { Building } from '@/types'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function TabTwoScreen() {
  const router = useRouter()
  const [selectedFilters, setSelectedFilters] = React.useState({})
  const [isFilterModalVisible, setIsFilterModalVisible] = React.useState(false)

  // <-- define your handler here:
  const handlePressBuilding = (building: Building) => {
    // e.g. navigate or show an alert
    router.push(`/buildings/${building.id}`)
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Buildings</Text>
        <TouchableOpacity
          onPress={() => setIsFilterModalVisible(true)}
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
          // <-- pass both item & handler
          <BuildingItem
            item={item}
            onPressBuilding={handlePressBuilding}
          />
        )}
      />

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApplyFilters={filters => {
          setSelectedFilters(filters)
          setIsFilterModalVisible(false)
        }}
        initialFilters={selectedFilters}
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