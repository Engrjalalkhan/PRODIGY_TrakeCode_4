import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GameScreen from '../../screens/GameScreen';
import HistoryScreen from '../../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'History') {
            iconName = 'history';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={GameScreen} options={{headerTitleAlign:'center'}}/>
      <Tab.Screen name="History" component={HistoryScreen} options={{headerTitleAlign:'center'}}/>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
