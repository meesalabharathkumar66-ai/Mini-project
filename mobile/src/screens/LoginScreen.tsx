import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Platform } from 'react-native';
import { Shield, Fingerprint, Lock, ShieldCheck } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }: any) => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setIsBiometricAvailable(compatible && types.length > 0);
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access S.A.M Vault',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Security Alert', 'Authentication failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected security error occurred.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#020617', '#0f172a', '#020617']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <View style={styles.logo}>
              <ShieldCheck size={48} color="#fff" strokeWidth={2.5} />
            </View>
            <Text style={styles.title}>S.A.M</Text>
            <Text style={styles.subtitle}>SECURE ASSET MANAGER</Text>
            <View style={styles.badge}>
               <Text style={styles.badgeText}>AES-256 ENCRYPTED</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <View style={styles.buttonIcon}>
                 <Shield size={18} color="#0ea5e9" />
              </View>
              <Text style={styles.buttonText}>Authorize with Secure Cloud</Text>
            </TouchableOpacity>

            {isBiometricAvailable && (
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleBiometricAuth}
              >
                <Fingerprint size={24} color="#fff" />
                <Text style={[styles.buttonText, { marginLeft: 12 }]}>Unlock via Biometrics</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
             <Lock size={12} color="#475569" style={{ marginBottom: 4 }} />
             <Text style={styles.footerText}>
               YOUR VAULT IS PROTECTED BY ZERO-KNOWLEDGE SECURITY
             </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoGlow: {
     position: 'absolute',
     width: 120,
     height: 120,
     backgroundColor: '#0284c7',
     borderRadius: 60,
     opacity: 0.15,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: '#0284c7',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  badge: {
     marginTop: 20,
     backgroundColor: 'rgba(14, 165, 233, 0.1)',
     paddingHorizontal: 12,
     paddingVertical: 4,
     borderRadius: 6,
     borderWidth: 1,
     borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  badgeText: {
     color: '#0ea5e9',
     fontSize: 10,
     fontWeight: '900',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
     width: 32,
     height: 32,
     backgroundColor: '#f1f5f9',
     borderRadius: 10,
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 12,
  },
  buttonText: {
    color: '#020617',
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    color: '#475569',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default LoginScreen;
