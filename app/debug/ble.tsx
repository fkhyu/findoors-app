import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BLEScreen = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    setDevices([]); // Clear previous list

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setScanning(false);
        return;
      }

      if (device && device.name) {
        const roomNumber = device.manufacturerData
          ? atob(device.manufacturerData.replace('Room:', ''))
          : 'Unknown';

        setDevices((prevDevices) => {
          const exists = prevDevices.some((d) => d.id === device.id);
          if (!exists) {
            return [...prevDevices, { ...device, roomNumber }];
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const stopScan = () => {
    manager.stopDeviceScan();
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, [manager]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Debug</Text>
      <Text style={styles.description}>Bluetooth Low Energy debugging interface</Text>
      
      <Button
        title={scanning ? "Stop Scanning" : "Start Scanning"}
        onPress={scanning ? stopScan : startScan}
        color={scanning ? '#f44336' : '#4caf50'}
      />

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceContainer}>
            <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
            <Text style={styles.deviceRoom}>Room Number: {item.roomNumber || 'N/A'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noDevices}>No devices found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  deviceContainer: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '100%',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 14,
    color: '#888',
  },
  deviceRoom: {
    fontSize: 16,
    color: '#333',
  },
  noDevices: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default BLEScreen;