import React, { useEffect } from 'react';
import { HomeScreen, EmployeeFirstPage, OwnerFirstPage } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeDatabase } from './database';
import { startSyncOnConnectivity } from './services/syncService';

const Stack = createStackNavigator();

const Swerise = () => {
  useEffect(() => {
    initializeDatabase();
    const unsubscribe = startSyncOnConnectivity();
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Swerise"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OwnerFirstPage"
          component={OwnerFirstPage}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="EmployeeFirstPage"
          component={EmployeeFirstPage}
          options={{ headerShown: false }}
        />
  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Swerise;
