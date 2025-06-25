import { MaterialIcons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { Link, router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '@/assets/styles/auth.style';

export default function Index() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setLoading] = useState(false);

	const signUp = async () => {
		setLoading(true);   
		try {
            if (password !== confirmPassword) {
                Alert.alert('Password Mismatch', 'Passwords do not match');
                return;
            }
			await auth().createUserWithEmailAndPassword(email, password);
			Alert.alert('Success', 'Account created! You can now sign in.');
		} catch (e: any) {
			const err = e as FirebaseError;
			Alert.alert('Registration Failed', err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<View style={styles.header}>
				<Text style={styles.title}>Snap News</Text>
                <Text style={styles.subtitle}>Register to get started</Text>
			</View>

			<View style={styles.inputContainer}>
				<MaterialIcons name="alternate-email" size={20} color="#888" style={styles.inputIcon} />
				<TextInput
					style={styles.input}
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					keyboardType="email-address"
					placeholder="Email"
					placeholderTextColor="#aaa"
				/>
			</View>

			<View style={styles.inputContainer}>
				<MaterialIcons name="lock-outline" size={20} color="#888" style={styles.inputIcon} />
				<TextInput
					style={styles.input}
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					placeholder="Password"
					placeholderTextColor="#aaa"
				/>
			</View>
            <View style={styles.inputContainer}>
				<MaterialIcons name="lock-outline" size={20} color="#888" style={styles.inputIcon} />
				<TextInput
					style={styles.input}
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry
					placeholder="Confirm Password"
					placeholderTextColor="#aaa"
				/>
			</View>

			{isLoading ? (
				<ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 20 }} />
			) : (
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={[styles.button]} onPress={signUp}>
						<Text style={styles.buttonText}>Create Account</Text>
					</TouchableOpacity>
				</View>
			)}
			<View style={styles.registerContainer}>
				<Text>Already have an account? <Link href="/(auth)/login" style={styles.registerText} onPress={() => router.push('/login')}>Login</Link></Text>
			</View>
		</KeyboardAvoidingView>
	);
}