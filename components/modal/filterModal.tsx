import React, { useEffect, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Define types for filter options
export interface FilterOptions {
  // Add your filter properties here, for example:
  category?: string;
  price?: {
    min: number;
    max: number;
  };
  sortBy?: string;
  bookable?: boolean;
  equipment?: string[];
  // Add more filter options as needed
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters)

  // ← only reset when `visible` changes
  useEffect(() => {
    if (visible) {
      setFilters(initialFilters)
    }
  }, [visible])   // ← remove initialFilters here

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filtersContainer}>
            {/* Add your filter controls here */}
            {/* For example: */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Category</Text>
              {/* Add category selection UI here */}
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              {/* Add price range controls here */}
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              {/* Add sorting options here */}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleResetFilters}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
  },
  filtersContainer: {
    flex: 1,
  },
  filterSection: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#f1f1f1',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#007BFF',
  },
  resetButtonText: {
    color: '#333',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default FilterModal;