/*Expo Go's QR Scanner Screen Implementation for Accommodator App

- https://github.com/expo/expo/blob/main/apps/expo-go/src/screens/QRCodeScreen.tsx

Note:
    Fails on expo Camera version >= 15.x
    Works on expo Camera version ~ 14
    
*/

///////////////////////////////////////////////////////////////////////////////
///////////////////////// Imported Modules  ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import * as BarCodeScanner from 'expo-barcode-scanner';
import { BlurView } from 'expo-blur';
import { FlashMode } from 'expo-camera';
import { throttle } from 'lodash';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

import apiRoute from '../../apiRoute';
import { getValueFor } from '../../ExpoStoreUtils';
import axios from 'axios';

import { Camera } from '../CommonComponents/Camera';
import QRFooterButton from '../CommonComponents/QRFooterButton';
import QRIndicator from '../CommonComponents/QRIndicator';


///////////////////////////////////////////////////////////////////////////////
///////////////////////// Page Specific Components  ///////////////////////////
///////////////////////////////////////////////////////////////////////////////

function CurrentPayloadDisplay({payload}: {payload: string | null}){
  return (<View style={Styles.CurrentPayloadDisplay}>
    <Text style={Styles.CurrentPayloadDisplayText}>Current Payload: [{payload || "No Payload Set"}]</Text>
  </View>)
}

function Hint({ children }: { children: string }) {
  return (
    <BlurView style={Styles.hint} intensity={100} tint="dark">
      <Text style={Styles.headerText}>{children}</Text>
    </BlurView>
  );
}

const isLikeQR = (id: string) => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
}


///////////////////////////////////////////////////////////////////////////////
//////////////////////// Main Export Method ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default function BarCodeScreen({ route, navigation }: { route: any, navigation: any }) {
  const [isVisible , setIsVisible] = React.useState(false)
  const [permission , setPermission] = React.useState(false)
  const [QRid , setQRid] = React.useState<string | null>(null)
  const [mountKey, setMountKey] = React.useState(1); //camera hack to force remount
  const [isLit, setLit] = React.useState(false);
  const isFocused = useIsFocused();

  const permissionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    setIsVisible(cameraPermission.status === 'granted');
    setPermission(cameraPermission.status === 'granted');
    if (cameraPermission.status !== 'granted')
      alert('Permission for camera access needed.');
  };

  // set camera permissions
  useEffect(() => {
    permissionFunction();
  }, []);

  //Subsequent focus renders
  useFocusEffect(React.useCallback(() => {
    console.log("params are")
    console.log(route.params)
  }, []));

  const markGateAttendance = (QRid: string, token: string) => {

    const url = `${apiRoute}/sr/student/fest/checkin/${QRid}/`;

    let headers = {
      Authorization: `Bearer ${token}`
    }

    axios.post(url, {}, {headers: headers}).then((response)=>{
      console.log("Gate Attendance Marked")
      Alert.alert("Success", "Fest check-in done", [{text: "OK", onPress: () => {navigation.goBack()}}])
    }).catch((error) => {
      console.log("Error while marking gate check in")
      let _msg = error.response.data.message
      Alert.alert("Error", _msg, [{text: "OK", onPress: () => {navigation.goBack()}}])
    })

  };

  const markEventAttendance = (QRid: string, eventID: number, token: string) => {

    const url = `${apiRoute}/sr/student/event/checkin/${eventID}/${QRid}/`;
                          
    let headers = {
      Authorization: `Bearer ${token}`
    }

    axios.post(url, {}, {headers: headers}).then((response)=>{
      console.log("Event Attendance Marked")
      Alert.alert("Success", "Event Attendance Marked", [{text: "OK", onPress: () => {navigation.goBack()}}])
    }).catch((error) => {
      console.log("Error while marking event attendance")
      let _msg = error.response.data.message
      Alert.alert("Error", _msg, [{text: "OK", onPress: () => {navigation.goBack()}}])
    })

  };

  React.useEffect(() => {
    if (!isVisible && QRid) {
      //sending to server 

      getValueFor('token').then((token) => {

        console.log(`Token retrieved from store is [${token}]`) 

        if(route.params.purpose === "eventAttendance")
          {
            console.log("Running eventAttendance")
            console.log(`QRid: ${QRid}`)
            console.log(`EventID: ${route.params.event.id}`)
            markEventAttendance(QRid, route.params.event.id, token);
          }
        else if(route.params.purpose === "centralCheckIN")
          markGateAttendance(QRid, token);
        else //this should never happen
          {
            console.log(`Invalid purpose: ${route.params.purpose}`)
            throw new Error("Invalid purpose :: How did this happen???")
          }


      })      
    }
  }, [isVisible, QRid]);

  const _handleBarCodeScanned = throttle(({ data: id }) => {
    
    if (id) {
      console.log("Scanned QR")
      console.log(id)

      setQRid(id);
      setIsVisible(false);
    }

    
    
  }, 1000);

  const onRefresh = React.useCallback(() => {
    console.log("Action Cancelled")
    //clear all states
    setQRid(null);
    setIsVisible(true);
    //unmount camera
    setMountKey((key) => key + 1);
  }, []);

  const onFlashToggle = React.useCallback(() => {
    setLit((isLit) => !isLit);
  }, []);

  const onManualEntry = React.useCallback(() => {
    console.log("Bypassing QR...")
    navigation.navigate('HandleBypassQR', route.params);
  }, []);

  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={Styles.container}>
      
      {(isVisible && isFocused) ? (
        <Camera
          ratio="16:9"
          key={mountKey}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={_handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
          flashMode={isLit ? FlashMode.torch : FlashMode.off}
        />
      ) : null}

      <View style={[Styles.header, { top: 40 + top }]}>
        <Hint>Hit refresh button if camera doesn't load</Hint>
      </View>

      <QRIndicator />

      {/* <CurrentPayloadDisplay payload={url}/> */}

      <View style={[Styles.footer, { bottom: 30 + bottom }]}>
        <QRFooterButton onPress={onFlashToggle} isActive={isLit} iconName="flashlight" />
        <QRFooterButton onPress={onManualEntry} iconName="create-outline" />
        <QRFooterButton onPress={onRefresh} iconName="refresh-outline" iconSize={48} />
      </View>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

    </View>
  );
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// Stylesheet  /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
  CurrentPayloadDisplay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 100,
    padding: 20,
    borderRadius: 16,
    color: '#fff',
    backgroundColor: 'transparent',
  },
  CurrentPayloadDisplayText:{
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  }
});