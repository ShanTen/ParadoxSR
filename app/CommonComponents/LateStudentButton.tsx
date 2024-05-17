import { StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import {useState, useEffect} from 'react';
import * as Linking from "expo-linking"

function StudentProfilePicture({url} : {url: string}){
    return (
      <Image 
      source={{uri: url}} 
      style={{width: 40, height: 40, borderRadius: 40/2}} 
      />
    )
  }

function openWithLinking(phoneNumber: number){
    Linking.openURL(`tel:+91 ${phoneNumber}`)
}

type UpcomingStudentProps = {
    id: string, 
    name: string, 
    phoneNumber: number
}

export default function UpcomingStudent({ id, name, phoneNumber } : UpcomingStudentProps) {
    const [opacity] = useState(new Animated.Value(1));
  
    const handlePressIn = () => {
      Animated.timing(opacity, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }).start();
    };
  
    const handlePressOut = () => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      console.log(`Student ${id} clicked`);
      openWithLinking(phoneNumber);
    };
  
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ ...styles.upcomingStudentPressable }}>
        <Animated.View style={{ ...styles.studentContainer, opacity }}>
          <StudentProfilePicture url={`https://ui-avatars.com/api/?name=${name.split(' ').join('+')}&background=1a1a00&color=ffffff`} />
          <Text id={id.toString()} style={styles.studentText}>
            {name}
          </Text>
  
          {(phoneNumber) && <Text style={{...styles.studentText, marginLeft: 'auto'}}>
              Contact
          </Text>}
        </Animated.View>
      </Pressable>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    studentText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      marginLeft: 10,
    },
    studentContainer: {
      marginVertical: 5,
      backgroundColor: 'lightgrey',
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      borderBlockColor: 'black',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },

    upcomingStudentPressable: {
      width: '100%',
    },    
});
  
  