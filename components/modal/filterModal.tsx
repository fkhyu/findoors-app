// components/modal/FilterModal.tsx
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface FilterOptions {
  category?: string;
  price?: { min: number; max: number };
  sortBy?: string;
  bookable?: boolean;
  equipment?: string[];
}

interface FilterModalProps {
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const FilterModal = forwardRef<BottomSheetModal, FilterModalProps>(
  ({ onClose, onApplyFilters, initialFilters = {} }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [filters, setFilters] = useState(initialFilters);
  const snapPoints = useMemo(() => ['80%'], []);

  // expose present/dismiss to parent
  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }), []);

  useEffect(() => {
    // sync filters when opening
    bottomSheetRef.current?.present();
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleApply = () => {
    onApplyFilters(filters);
    bottomSheetRef.current?.dismiss();
  };

  const handleReset = () => setFilters({});

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={styles.modalContent}
      onDismiss={onClose}
    >
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={() => bottomSheetRef.current?.dismiss()}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filtersContainer}>
          {/* Your filter controls */}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.applyButton]}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
}
);

FilterModal.displayName = 'FilterModal';

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  closeButton: { fontSize: 20 },
  filtersContainer: { flex: 1 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: { paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  resetButton: { flex: 1, marginRight: 10, backgroundColor: '#f1f1f1' },
  applyButton: { flex: 2, backgroundColor: '#007BFF' },
  resetButtonText: { color: '#333' },
  applyButtonText: { color: '#fff', fontWeight: '600' },
});

export default FilterModal;