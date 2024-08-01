import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(0);
  const rotateValue = useRef(new Animated.Value(0)).current;
  const progressBarWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation for rotating the logo with milliseconds precision
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000, // Rotate in 1 second
        useNativeDriver: true,
      })
    ).start();

    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(timer);
          navigation.navigate('Main');
        }
        return prev + 0.01; // Increase progress
      });
    }, 10); // Update every 10 milliseconds for smoother progress

    // Animation for filling the progress bar
    Animated.timing(progressBarWidth, {
      toValue: progress * 300, // 300 is the width of the progress bar
      duration: 10,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(timer);
  }, [navigation, rotateValue, progress]);

  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Tic Tac Toe</Text>
      <Animated.Image
        source={require('../images/logo.png')}
        style={[styles.logoImage, { transform: [{ rotate: rotateInterpolation }] }]}
      />
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[styles.progressFill, { width: progressBarWidth }]}
          />
          <Text style={styles.progressText}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 25,
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  progressBackground: {
    width: '100%',
    height: 15, // Updated height
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#6200EE',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 15, // Center text vertically with updated height
    color: 'white',
    fontSize: 14,
  },
});

export default SplashScreen;
