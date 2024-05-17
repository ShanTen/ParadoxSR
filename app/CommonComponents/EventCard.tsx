import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

type EventCardProps = {
    eventName: string | null,
    eventStartTime: string | null,
    eventEndTime: string | null,
  }

const EventCard = ({ eventName, eventStartTime, eventEndTime }: EventCardProps) => {
    return (
        <View style={styles.eventCard}>
            <Text style={styles.eventCardTitle}>{eventName}</Text>
            <Text style={styles.eventCardTime}>Starts at {eventStartTime}</Text>
            <Text style={styles.eventCardTime}>Ends at {eventEndTime}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    eventCard: {
        width: '95%',
        backgroundColor: '#1E1E1E',
        padding: 10,
        margin: 5,
        borderRadius: 10,
        alignContent: 'center',
        justifyContent: 'center',
    },
    eventCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E3E3E3',
        textAlign: 'center',
    },
    eventCardTime: {
        fontSize: 14,
        color: '#E3E3E3',
        textAlign: 'center',
    },
});

export default EventCard;