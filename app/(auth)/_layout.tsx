import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

export default function AuthLayout() {
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e90ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          headerShown: false 
        }}  
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Register',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
} 