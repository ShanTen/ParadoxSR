import { StyleSheet , TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { ButtonAnimatedWithLabel, ButtonAnimatedWithLabelForScrollView } from '../CommonComponents/ButtonAnimated';
import Title from "@/app/CommonComponents/PageTitle";
import { save, getValueFor } from '@/ExpoStoreUtils';
import { ScrollView } from 'react-native';
import apiRoute from "@/apiRoute"
import axios from 'axios';

export default function EventSelector({navigation} : { navigation: any}){
    const [token, setToken] = useState(''); 
    const [events, setEvents] = useState<null | any[]>(null);
    const [profile, setProfile] = useState({});

    async function getData(){
        try{        
            let _token = await getValueFor('token');
            //let _profileJSON = await getValueFor('profile');

            let _profile = (await axios.get(`${apiRoute}/sr/volunteer/profile/`, { headers: { Authorization: `Bearer ${_token}` } })).data
            console.log(`Profile @ event selector`)
            console.log(_profile)
            let _events = _profile.events;

            // let _events2 = [];
            // for(let i = 0; i < 100; i++){
            //     _events2.push({ id: i, name: `Name - ${i}` });
            // }
            // console.log(_events);

            setProfile(_profile);
            setToken(_token);
            setEvents(_events);

            return null;
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(() => {
        getData()
        .then(() => {
            console.log('Data fetched');
        })
        .catch((e) => {
            console.log('An error ocurred when fetching data.');
            console.log(e);
        });
    }, []);

    function handleEventSelection(event : any){
        // save('currentEvent', JSON.stringify(event));
        // navigation.navigate('QRScanner');
    }

    function DBGHandleOnPress(id : any){
        console.log(`Event id is ${id}`);
    }

    return <View style={styles.container}>
        <Title 
            value="Events" 
            LineStyle={{
                marginBottom: 10
            }}
        />

        <ScrollView style={styles.scrollView}>
        {/* {
            Array.from(Array(100).keys()).map((event : any, index: number) => {
                return <ButtonAnimatedWithLabelForScrollView
                    key={index}
                    value={index}
                    onPress={DBGHandleOnPress}
                    label={`${index}`}
                    style={
                        {
                            Text: {
                                color: 'white',
                                textAlign: 'center',
                            },
                        }
                    }
                    animatedViewStyle={{ backgroundColor: 'green'}}
                />
            }) 
        } */}

        {
            
            events && events.map((event : any, index : number) => {
                return <ButtonAnimatedWithLabelForScrollView
                    key={index}
                    value={event.id}
                    onPress={(id: any) => {
                        navigation.navigate('QRScanner', {"event": event, "purpose": "eventAttendance"});
                    }}
                    label={event.name}
                    style={
                        {
                            Text: {
                                color: 'white',
                                textAlign: 'center',
                            },
                        }
                    }
                    animatedViewStyle={{ backgroundColor: 'green'}}
                />
            })
        }
        </ScrollView>

        {/* <ButtonAnimatedWithLabel
            onPress={() => navigation.navigate('QRScanner')}
            label="Handle Supplies"
            style={{}}
            animatedViewStyle={{ backgroundColor: 'green' }}
        /> */}
    </View>

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',    
    },
    scrollView:{
        flex: 1,
        width: '100%',
    }
})