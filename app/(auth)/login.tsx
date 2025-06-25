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
	const [isLoading, setLoading] = useState(false);

	const signIn = async () => {
		setLoading(true);
		try {
			await auth().signInWithEmailAndPassword(email, password);
		} catch (e: any) {
			const err = e as FirebaseError;
			Alert.alert('Sign In Failed', err.message);
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
                <Text style={styles.subtitle}>Login to your account</Text>
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

			{isLoading ? (
				<ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 20 }} />
			) : (
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={signIn}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
				</View>
			)}
			<View style={styles.registerContainer}>
				<Text>Don't have an account? <Link href="/(auth)/register" style={styles.registerText} onPress={() => router.push('/register')}>Register</Link></Text>
			</View>
		</KeyboardAvoidingView>
	);
}
