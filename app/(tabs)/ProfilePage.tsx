import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import ProfileBar from '@/app/CommonComponents/ProfileBar';
import Title from '@/app/CommonComponents/PageTitle'
import { ButtonAnimatedWithLabel } from '@/app/CommonComponents/ButtonAnimated';
import { router } from 'expo-router';
import axios from 'axios';
import { save, getValueFor } from '@/ExpoStoreUtils';
import apiRoute from '@/apiRoute';
import { Toast } from 'toastify-react-native'
import { Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import EventCard from '@/app/CommonComponents/EventCard';


const getUniqueID = (email: string): string => {
  return email.split('@')[0];
}

const getProfilePicture = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${name.split(' ').join('+')}&?background=000000&color=0D8ABC&?format=svg?size=256`
}

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

// type EventCardProps = {
//   eventName: string | null,
//   eventStartTime: string | null,
//   eventEndTime: string | null,
// }

// const EventCard = ({ eventName, eventStartTime, eventEndTime }: EventCardProps) => {
//   return (
//     <View style={styles.eventCard}>
//       <Text style={styles.eventCardTitle}>{eventName}</Text>
//       <Text style={styles.eventCardTime}>Starts at {eventStartTime}</Text>
//       <Text style={styles.eventCardTime}>Ends at {eventEndTime}</Text>
//     </View>
//   )
// }

const screenWidth = Dimensions.get('window').width;

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [volunteerEventObjects, setVolunteerEventObjects] = useState<any[]>([]);

  useEffect(() => {
    getValueFor('token').then((token: any) => {
      if (token === null) return;
      setToken(token);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  useEffect(()=>{
    //get the profile from the cache
    if(token === null) return;
    getValueFor('profile').then(async (profile: any) => {
      let profileValue = JSON.parse(profile);
      try{
        let headers = { Authorization : `Bearer ${token}` }
        let requiredEventsIDs = profileValue["events"].map((event: any) => event.id);
        for(let _id of requiredEventsIDs){
          let response = (await axios.get(`${apiRoute}/sr/events/${_id}/`, { headers })).data;
          let volunteerEventObjectsCopy = volunteerEventObjects;
          //check if object is not already in the array
          if(volunteerEventObjectsCopy.filter((event: any) => event.id === response.id).length === 0){
            volunteerEventObjectsCopy.push(response);
            setVolunteerEventObjects(volunteerEventObjectsCopy);
          }
          setVolunteerEventObjects(volunteerEventObjectsCopy);
        }
        
        setProfile(profileValue);
      }
      catch(err){
        console.log(err)
      }
    }).catch(error => {
      console.log(error);
    });
  }, [token])
  
  const logout = async () => {
    try {
      await save('logout', 'yes');
      router.navigate('/');
    }
    catch (e) {
      console.log(e);
      Toast.error('An error occurred while logging out', 'Top');
    }

  }

  return (
    <View style={styles.container}>
      <Title value="Profile" LineStyle={{ marginBottom: 20 }} />
      {(profile) && <ProfileBar profileName={profile.name} profilePicture={getProfilePicture(profile.name)} uniqueID={getUniqueID(profile.email)} />}
      <ScrollView style={{ marginTop: 10 }} contentContainerStyle={
        {
          alignContent: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          width: Math.floor(screenWidth * 0.95),
          alignItems: 'center',
        }}>
          { 
            (profile && volunteerEventObjects) ? 
              volunteerEventObjects.map(
                (event: any, index: number) => 
                  {
                    return <EventCard 
                      eventName={event.name} 
                      eventStartTime={epochToHuman(event.starttime)} 
                      eventEndTime={epochToHuman(event.endtime)} 
                      key={event.id}
                    />
                  }
              ) 
              : <Text>Loading...</Text>
          }

          {/* <View style={styles.logOutButtonContainer}>
        <ButtonAnimatedWithLabel label='Logout' onPress={logout} animatedViewStyle={{ backgroundColor: '#9a0612' }} style={{}}/>
      </View> */}

          <ButtonAnimatedWithLabel label='Logout' onPress={logout} animatedViewStyle={{ backgroundColor: '#9a0612' }} style={{}} />
        
      </ScrollView>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  eventsContainer: {
    flex: 0,
    alignItems: 'center',
    alignContent: 'center',
    width: Math.floor(screenWidth),
    paddingVertical: 10,
  }
});

// eventCard: {
//   width: '95%',
//   backgroundColor: '#1E1E1E',
//   padding: 10,
//   margin: 5,
//   borderRadius: 10,
//   alignContent: 'center',
//   justifyContent: 'center',
// },
// eventCardTitle: {
//   fontSize: 16,
//   fontWeight: 'bold',
//   color: '#E3E3E3',
//   textAlign: 'center',
// },
// eventCardTime: {
//   fontSize: 14,
//   color: '#E3E3E3',
//   textAlign: 'center',
// },