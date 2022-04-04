import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';

import firestore, { firebase } from "@react-native-firebase/firestore"

import LoginApp from './src/LoginApp';


const App = () => {

  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // userDocument();
      // getUserAged();
    // const subscriber = firestore().collection("users")
    //     .doc("3KrdOmeG3XCQRxRxBcd5")
    //     .onSnapshot(doc =>{
    //   setName(doc.data().name)
    // });

    // const userId = "3KrdOmeG3XCQRxRxBcd5"
    // firestore()
    //     .collection('users')
    //     //.where('age', '>=', 20)
    //     .get()
    //     .then(querySnapshot => {
    //       console.log('Total users: ', querySnapshot.size);

    //       querySnapshot.forEach(documentSnapshot => {
    //         console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    //       });
    //     });

      const subscriber = firestore().collection("users")
        .onSnapshot(docs =>{
          let users = []
          docs.forEach(doc => {
            users.push(doc.data())
          });
          setUsers(users)
        });

        // await firestore().settings({
        //   persistence : false
        // })

        return () => subscriber();

  }, []);

    const onPressHandler = async () => {
      let name = Math.random().toString(36).substring(7);
      firestore().collection("users").add({
        name,
        age:20,
      })
    }


   const UpdateAgeUserByID = () => {
     const iduser = "rU1i2viDVrnopn3gDi5g"
    // Create a reference to the post
    const userReference = firestore().doc(`users/${iduser}`);
  
    return firestore().runTransaction(async transaction => {
      // Get post data first
      const postSnapshot = await transaction.get(userReference);
  
      if (!postSnapshot.exists) {
        throw 'User does not exist!';
      }
  
      transaction.update(userReference, {
        age: postSnapshot.data().age + 1,
      });
    });
  }

  const massDeleteUsers = async () => {
    // Get all users
    const usersQuerySnapshot = await firestore().collection('users').get();
  
    // Create a new batch instance
    const batch = firestore().batch();
  
    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.delete(documentSnapshot.ref);
    });
  
    batch.commit();
  }



  
  

  // const getUserAged = async () => {
  //   try {
  //     const users = await firestore()
  //       .collection('users')
  //       // Filter results
  //       .where('age', '>=', 18)
  //       .get()
  //       .then(querySnapshot => {
  //         console.log(querySnapshot)
  //       });
  //   } catch (error) {
  //       console.log(error);
  //   }
  // }

  
  // const userDocument = async () => {
  //   try {
  //       const data = await firestore().collection("users").doc("3KrdOmeG3XCQRxRxBcd5").get();
  //      // setName(data().name)
  //   } catch (error) {
  //       console.log(error);
  //   }
  // }

  return (
    <View style={styles.body}>

      <LoginApp />
       
        <Button onPress={onPressHandler} title="Add User" style={{marginTop:30, padding:20}}></Button>
       
       
        <Button onPress={UpdateAgeUserByID} title="Update Age"></Button>

        <Button onPress={massDeleteUsers} title="Delete all users"></Button>


        {users.map((user, index) => (
        <View key={index}>
      <Text style={styles.text}>User info {user.name}, {user.age}
      </Text>
      </View>
      ))}
     </View>
  );
};


const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#0000ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    fontStyle:'italic',
    margin: 10,
  },
  button: {
    color: 'white',
    fontSize: 20,
    margin: 40,
    backgroundColor:"red"
  },
});


export default App;
