import { STAMP_DEFINITIONS } from '@/lib/stamps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

const STORAGE_KEY = 'achievements';

const AchievementsContext = createContext({
  achievements: [],
  unlockAchievement: (achievementOrId) => {},
});

export const AchievementsProvider = ({ children }) => {
  const [achievements, setAchievements] = useState([]);
  console.log('[Achievements] 🎉 Provider rendered');

  // Load and normalize persisted achievements
  useEffect(() => {
    console.log('[Achievements] Loading achievements from AsyncStorage...');
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('[Achievements] Raw data:', raw);
        if (raw) {
          const parsed = JSON.parse(raw);
          console.log('[Achievements] Parsed raw:', parsed);
          const normalized = parsed
            .map(item => {
              if (typeof item === 'string') {
                const def = STAMP_DEFINITIONS.find(s => s.id === item);
                return {
                  id: item,
                  title: def?.name || item,
                  description: def?.description || '',
                };
              } else if (item && typeof item === 'object') {
                return item;
              }
              return null;
            })
            .filter(Boolean);
          console.log('[Achievements] Normalized achievements:', normalized);
          setAchievements(normalized);
        } else {
          console.log('[Achievements] No achievements found.');
        }
      } catch (e) {
        console.error('[Achievements] Error loading achievements:', e);
      }
    })();
  }, []);

  // Unlock by id or full object
  const unlockAchievement = async (achievementOrId) => {
    console.log('[Achievements] unlockAchievement called with:', achievementOrId);
    const achievementObj =
      typeof achievementOrId === 'string'
        ? {
            id: achievementOrId,
            title:
              STAMP_DEFINITIONS.find(s => s.id === achievementOrId)?.name || achievementOrId,
            description:
              STAMP_DEFINITIONS.find(s => s.id === achievementOrId)?.description || '',
          }
        : achievementOrId;

    // avoid duplicates
    if (achievements.some(a => a.id === achievementObj.id)) {
      console.log('[Achievements] Already unlocked, skipping:', achievementObj.id);
      return;
    } else {
      console.log('[Achievements] Unlocking new achievement:', achievementObj.id);
    }

    const updated = [...achievements, achievementObj];
    console.log('[Achievements] Updated list:', updated);
    setAchievements(updated);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('[Achievements] Successfully saved to AsyncStorage.');
    } catch (e) {
      console.error('[Achievements] Error saving achievements:', e);
    }

    console.log('[Achievements] Showing toast for:', achievementObj.title);
    Toast.show({
      type: 'success',
      text1: `🏆 ${achievementObj.title}`,
      text2: achievementObj.description || '',
      visibilityTime: 8000,
      position: 'top',
    });
  };

  return (
    <AchievementsContext.Provider value={{ achievements, unlockAchievement }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  useEffect(() => {
    console.log('[Achievements] Count now →', context.achievements.length);
  }, [context.achievements.length]);
  return context;
};