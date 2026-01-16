import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';
import { Database } from './database.types';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = 'https://bwreaukzhkzplfrinlbi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cmVhdWt6aGt6cGxmcmlubGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NTUzMDMsImV4cCI6MjA3NzAzMTMwM30.mnyaDK5oZdZdEI_osa2kMFa461dlyTUUF2MOUYVRXkc'
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
   auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});