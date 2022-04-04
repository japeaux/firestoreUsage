import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    TouchableOpacity,
    Button,
} from 'react-native';
import firestore, { firebase } from "@react-native-firebase/firestore"

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: '194471721839-g218j1r7l22s854kqcppqcomq5femcd5.apps.googleusercontent.com',
});

export default function LoginApp() {
        
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
  
    // Handle user state changes
    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) setInitializing(false);
    }
  
    useEffect(() => {
        
            
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      

    //   auth()
    //         .signInAnonymously()
    //         .then(() => {
    //             console.log('User signed in anonymously');
    //         })
    //         .catch(error => {
    //             if (error.code === 'auth/operation-not-allowed') {
    //             console.log('Enable anonymous in your firebase console.');
    //             }

    //             console.error(error);
    //         });
        
        
        return subscriber; // unsubscribe on unmount

    }, []);


    const createUserEmail = () =>{
        auth()
            .createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }

    const SignIn = () =>{
        auth()
            .signInWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }


    const Logoff = () =>{
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
    }

    async function onGoogleButtonPress() {
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
      
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
      }
  
    if (initializing) return null;
  
    if (!user) {
      return (
        <View>
            <Text>Login</Text>
            <Button
                title="Google Sign-In"
                onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
                />
            
            <TouchableOpacity
                    onPress={SignIn}
                    style={({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#0f0' })}
            >
                <Text style={styles.text}>
                    Sign In 
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={createUserEmail}
                style={({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#0f0' })}
            >
                <Text style={styles.text}>
                    Create with email
                </Text>
            </TouchableOpacity>


        </View>
      );
    }
  
    return (
      <View>
        <Text>Welcome {user.email}</Text>

            <TouchableOpacity
                onPress={Logoff}
                style={({ pressed }) => ({ backgroundColor: pressed ? '#ddd' : '#0f0' })}
            >
                <Text style={styles.text}>
                    Logoff
          </Text>
            </TouchableOpacity>
      </View>
    );
  
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        margin: 10,
    }
})