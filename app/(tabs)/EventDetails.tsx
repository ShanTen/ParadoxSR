/*
    Event Object (for now*) gotten from GET  -  /API/SR/EventDetails/<event-id>
        - ID
        - Name
        - StartTime
        - EndTime

    * - For now, the event object will only contain the above fields.

    The EventDetails page will display the details of the event in a card format.
*/

import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import Title from '@/app/CommonComponents/PageTitle'
import { Picker } from '@react-native-picker/picker';
import EventCard from '@/app/CommonComponents/EventCard';
import { ButtonAnimatedWithLabel } from '@/app/CommonComponents/ButtonAnimated';
import {useState, useEffect} from 'react';
import {getValueFor} from '@/ExpoStoreUtils';
import axios from 'axios';
import apiRoute from '@/apiRoute';
import LateStudentButton from '@/app/CommonComponents/LateStudentButton';


const getTimeWithoutSeconds = (timeStr: string): string => {
    return timeStr.split(":").slice(0, 2).join(":");
  }
  
const epochToHuman = function (epochTime: number) {
    let date = new Date(epochTime).toLocaleDateString("en-IN");
    let buf_time = new Date(epochTime).toLocaleTimeString("en-IN");
    let AM_OR_PM = buf_time.split(" ")[1];
    let time = getTimeWithoutSeconds(buf_time);
    return `${date} ${time} ${AM_OR_PM}`;
}

export default function EventDetails(){
    const [token, setToken] = useState<string | null>(null);
    const [eventID, setEventID] = useState<any>(null);
    const [allVolunteerEvents, SetAllVolunteerEvents] = useState<any[]>([]);
    const [eventDetails, setEventDetails] = useState<any>(null);
    
    useEffect(() => {
        getValueFor('token').then((token: any) => {
            setToken(token);
        }).catch((error) => {
            console.log(error);
        });

        getValueFor('profile').then((profile: any) => {
            let _profile = JSON.parse(profile);
            let _volunteerEvents = _profile.events;
            SetAllVolunteerEvents(_volunteerEvents);
        }).catch((error) => {
            console.log(error);
        });
    

    }, []);
  
    useEffect(() => {
        if(eventID && token){
            let headers = {Authorization: `Bearer ${token}`}
            axios.get(`${apiRoute}/sr/events/${eventID}/`, {headers})
                .then( (res) => {
                    console.log(res.data)
                    setEventDetails(res.data)
                } )
                .catch((err) => {
                    console.log("Error in fetching event details")
                    console.log(err)
                })
        }
    }, [eventID]);

    return (
        <View style={styles.container}>
            <Title value="Event Details" LineStyle={{marginBottom: 20}}/>
            <View style={styles.pickerContainer}>
            <Picker 
            style={styles.picker}
            selectedValue={eventID}
            onValueChange={(itemValue, itemIndex) => setEventID(itemValue)}
            >
                {allVolunteerEvents && allVolunteerEvents.map(
                    (event : any, idx : number) => {
                    return <Picker.Item key={idx} label={event.name} value={event.id}/>
                })}
            </Picker>
            </View>
            {eventDetails && <EventCard 
                eventName={eventDetails.name}
                eventStartTime={epochToHuman(eventDetails.starttime)}
                eventEndTime={epochToHuman(eventDetails.endtime)}
            />}

            <ButtonAnimatedWithLabel label="Get late participants" onPress={() => console.log("Get late participants")} animatedViewStyle={{}} style={{marginTop: 5}}/>

            <ScrollView style={styles.lateParticipantsScrollView}>
                <LateStudentButton
                id='1'
                name='Swag Mans'
                phoneNumber={8637643053}
                />
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    pickerContainer:{
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderRadius: 10,
        borderColor: 'white',
        marginBottom: 10,

    },
    picker: {
        width: '100%',
        backgroundColor: 'white',
    },
    lateParticipantsScrollView:{
        width: '90%',
        marginTop: 5,
    }
});