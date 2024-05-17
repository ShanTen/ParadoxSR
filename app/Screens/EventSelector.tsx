import { StyleSheet , TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { ButtonAnimatedWithLabel } from '../CommonComponents/ButtonAnimated';
import Title from "@/app/CommonComponents/PageTitle";
import { save, getValueFor } from '@/ExpoStoreUtils';

export default function EventSelector({navigation} : { navigation: any}){
    const [token, setToken] = useState(''); 
    const [events, setEvents] = useState<null | any[]>(null);
    const [profile, setProfile] = useState({});

    async function getData(){
        try{        
            let _token = await getValueFor('token');
            let _profileJSON = await getValueFor('profile');
            let _profile = JSON.parse(_profileJSON);
            let _events = _profile.events;
        
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

    return <View style={styles.container}>
        <Title value="Events"/>

        {
            events && events.map((event : any, index : number) => {
                return <ButtonAnimatedWithLabel
                    key={index}
                    value={event.id}
                    onPress={(id: any) => {
                        console.log(`Event id is ${id}`);
                        // save('currentEvent', JSON.stringify(event));
                        // navigation.navigate('QRScanner');
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
    }
})