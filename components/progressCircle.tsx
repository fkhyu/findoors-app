import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 90,
  strokeWidth = 10,
  color = '#F4A261',
  backgroundColor = '#E1EDD6',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  useEffect(() => {
    progress.value = withTiming(percentage / 100, { duration: 1000 });
  }, [percentage]); 

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}> 
        <Circle 
          stroke={backgroundColor} 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          strokeWidth={strokeWidth} 
        /> 
        <AnimatedCircle
          stroke={color}
          cx={size / 2}
          cy={size / 2} 
          r={radius} 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference} 
          animatedProps={animatedProps} 
          strokeLinecap="round" 
        />
      </Svg>
      <View style={styles.label}>
        <Text style={styles.percentText}>{`${percentage}%`}</Text>
        <Text style={styles.subText}>Explored</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A685C',
  },
  subText: {
    fontSize: 10,
    color: '#6B7B78',
  },
});

export default ProgressCircle;