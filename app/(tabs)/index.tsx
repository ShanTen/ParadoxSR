///////////////////////////////////////////////////////////////////////////////
///////////////////////// Imported Modules  ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Title from '@/app/CommonComponents/PageTitle'
import {ButtonAnimatedWithLabel} from '@/app/CommonComponents/ButtonAnimated'
import {Link, useNavigation} from 'expo-router';
import React from 'react';
import { useEffect, useState} from 'react';
import {getValueFor, save} from '@/ExpoStoreUtils';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import HandleBypassQR from '@/app/Screens/HandleBypassQR';
import QRScanner from '@/app/Screens/QRScanner';
import EventSelector from '@/app/Screens/EventSelector';

///////////////////////////////////////////////////////////////////////////////
///////////////////// Navigation Handler For QR Scan //////////////////////////
///////////////////////////////////////////////////////////////////////////////

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const StackNavSupplyHandle = createNativeStackNavigator();

///////////////////////////////////////////////////////////////////////////////
//////////////////////// Main Export Method ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function TabOneScreen({navigation}:{navigation: any}) {
  const dNavigation = useNavigation();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    //call back to prevent user from going back to login screen unless they meant it 
    dNavigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      console.log('onback');
      // Do your stuff here
      getValueFor('logout').then((value : any) => {
          if (value === 'yes') {
            dNavigation.dispatch(e.data.action);
          }
      }).catch((err : any) => {
          console.log(err);
          console.log("Ignore the above error, someone tried going back when they shouldn't have.")
      });
  });

  }, [])

  useFocusEffect(useCallback(
      ()=>{
        getValueFor('profile').then((profile : any) => {
          setProfile(JSON.parse(profile));
      }).catch((error) => {
        console.log(error)
      });
      }
    , []))
  
  return (
    <View style={styles.container}>
      <Title value="Student Relations"/>
      <Link href="/(tabs)" />
      <View style={styles.ButtonsContainer}>

        {/* Both Buttons redirect to QR code but they pass a key called "purpose" to the QR page */}
        {/* "purpose can be either "eventAttendance" or "centralCheckIN", the key is deleted after event is handled in QR */}

        {
          (profile) && (profile.isDoingCentralCheckIn) 
            && 
          <ButtonAnimatedWithLabel 
            label='Fest Check-In' 
            onPress={() => navigation.navigate('QRScanner', {"purpose": "centralCheckIN"})} 
            animatedViewStyle={{}} 
            style={{}}
          />
        }

        {
          (profile) && (profile.events.length > 0)
            && 
          <ButtonAnimatedWithLabel 
            label='Event Attendance' 
            onPress={() => {navigation.navigate("EventSelector")}}  
            animatedViewStyle={{}} 
            style={{}}
          />
        }
        
      </View>

    </View>
  );
}

export default function SupplyHandlerScreen() {
    return <StackNavSupplyHandle.Navigator>
        <StackNavSupplyHandle.Screen name="Home" component={TabOneScreen} options={{headerShown: false}}/>
        <StackNavSupplyHandle.Screen name="HandleBypassQR" component={HandleBypassQR} options={{headerShown: false}}/>
        <StackNavSupplyHandle.Screen name="QRScanner" component={QRScanner} options={{headerShown: false}}/>
        <StackNavSupplyHandle.Screen name="EventSelector" component={EventSelector} options={{headerShown: false}}/>
      </StackNavSupplyHandle.Navigator>
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// Stylesheet  /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  ButtonsContainer:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%',
    marginTop: 20,
  }
});
