import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function ProfileScreen() {

  const { profile } = useAuth();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View>
      <Text>{JSON.stringify(profile)}</Text>

      <Link href="/(user)" asChild>
          <Button text="User" />
        </Link>

      <Button 
        text="Sign out" 
        onPress={handleSignOut}
      />
    </View>
  );
}
