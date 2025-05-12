import { Building } from '@/types'
import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

type Props = {
  item: Building
  onPressBuilding: (b: Building) => void
}

const BuildingItem: React.FC<Props> = ({ item, onPressBuilding }) => (
  <Pressable
    style={styles.container}
    onPress={() => onPressBuilding(item)}
  >
    {item.imageUrl
      ? <Image
          source={{ uri: item.imageUrl }}
          resizeMode="cover"
          style={styles.image}
        />
      : <View style={styles.placeholder} />
    }

    <View style={styles.infoContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.address}>{item.address}</Text>
    </View>
  </Pressable>
)

export default BuildingItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  placeholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  address: {
    fontSize: 14,
    color: '#808080',
    marginTop: 4,
  },
})