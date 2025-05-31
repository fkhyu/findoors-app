import { Room } from '@/types'
import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

type Props = {
  item: Room
  onPressRoom: (f: Room) => void
}

const RoomItem: React.FC<Props> = ({ item, onPressRoom }) => (
  <Pressable
    style={styles.container}
    onPress={() => onPressRoom(item)}
  >
    {item.image_url
      ? <Image
          source={{ uri: item.image_url }}
          resizeMode="cover"
          style={styles.image}
        />
      : <View style={styles.placeholder} /> 
    }

    <View style={styles.infoContainer}>
      <Text style={styles.name}>{item.title}</Text>
      <Text style={styles.name}>{item.room_number}</Text>
    </View>
  </Pressable>
)

export default RoomItem

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
    fontWeight: 500,
  },
  address: {
    fontSize: 14,
    color: '#808080',
    marginTop: 4,
  },
})