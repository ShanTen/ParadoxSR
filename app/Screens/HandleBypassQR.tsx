
/*
    Alternate Screen if the user wants to enter
    the student's roll number instead of scanning the QR 
*/

import { StyleSheet , TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiRoute from '../../apiRoute';
import { getValueFor } from '../../ExpoStoreUtils';
import { ButtonAnimatedWithLabel } from '../CommonComponents/ButtonAnimated';

export default function ScreenBypassQR({ route, navigation }: { route: any, navigation: any }){
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [routeObj, setRouteObj] = useState<any | undefined>(undefined);

    const handleEmailSubmitCentralCheckIn = async () => {
        const headers = {Authorization: `Bearer ${token}`};
        try{
            let QRid = (await (axios.get(`${apiRoute}/sr/student/${email}/`, {headers}))).data.code;
            const res = (await axios.post(`${apiRoute}/sr/student/fest/checkin/${QRid}/`, {}, {headers})).data;
            Alert.alert("Success", "Fest check-in done", [{text: "OK", onPress: () => {navigation.goBack()}}])
        }
        catch(err : any){
            console.log(err.response.data);
            console.log("Error while performing central check in")
            let _msg = err.response.data.message || "Invalid Email ID"
            Alert.alert("Error", _msg, [{text: "OK", onPress: () => {navigation.goBack()}}])
            return;
        }
    }

    const handleEventAttendance = async () => {
        const headers = {Authorization: `Bearer ${token}`};
        try{
            let QRid = (await (axios.get(`${apiRoute}/sr/student/${email}/`, {headers}))).data.code;
            const res = (await axios.post(`${apiRoute}/sr/student/event/checkin/${route.params.event.id}/${QRid}/`, {}, {headers})).data;
            Alert.alert("Success", "Event Attendance Marked", [{text: "OK", onPress: () => {navigation.goBack()}}])
        }
        catch(err : any){
            console.log(err.response.data);
            console.log("Error while marking event attendance")
            let _msg = err.response.data.message || "Invalid Email ID"
            Alert.alert("Error", _msg, [{text: "OK", onPress: () => {navigation.goBack()}}])
            return;
        }
    }

    const handleButtonPress = async () => {
        if(!routeObj)
            return;
        try{
            if(routeObj.purpose === "centralCheckIN"){
                await handleEmailSubmitCentralCheckIn();
            }
            else if(routeObj.purpose === "eventAttendance"){
                await handleEventAttendance();
            }
            else{
                console.log("Invalid purpose")
            }
        }

        catch(err){
            console.log("Error while performing action")
            console.log(err);
        }

    }

    useEffect(() => {
        setRouteObj(route.params);
        getValueFor('token').then((_token) => {
            setToken(_token);
        }).catch((err) => {
            console.log("Error while fetching token from store...")
            console.log(err);
        })

    }, []);

    return <View style={styles.container}>
        <Text style={styles.headerText}>Enter Student Email</Text>
        <TextInput
            style={styles.input}
            onChangeText={text => setEmail(text)}
            value={email}
            placeholder="Ex: 20f3000001@ds.study.iitm.ac.in"
            placeholderTextColor="grey"
        />
        {
        (routeObj) 
            && 
        <ButtonAnimatedWithLabel
            onPress={handleButtonPress}
            label="Submit"
            style={styles.button}
            animatedViewStyle={{ backgroundColor: 'green' }}
        />
        }
    </View>
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    input: {
        width: 320,
        height: 40,
        borderColor: 'white',
        color: 'white',
        borderWidth: 1,
        margin: 5,
        padding: 5,
        fontSize: 16,
        borderRadius: 5,
        marginBottom: 15,
    },
    button: {
        margin: 10,
    },
});