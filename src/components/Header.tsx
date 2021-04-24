import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';


interface HeaderProps {
    avatar: string;
}

export function Header({avatar }: HeaderProps) {
    const [username, setUsername] = useState('');

    useEffect(() => {
        getUserName();
    }, []);


    async function getUserName() {
        setUsername(await AsyncStorage.getItem('@plantmanager/username') || '');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>
                {`Olá,\n`}
                <Text style={styles.name}>
                    {username}
                </Text>
            </Text>
            <Image style={styles.avatar} source={{uri: avatar}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    greeting: {
        fontFamily: fonts.text,
        fontSize: 32,
        lineHeight: 36,
        color: colors.green_dark,
    },
    name: {
        fontFamily: fonts.heading,
        fontSize: 32,
        lineHeight: 36,
        color: colors.green_dark,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 90,
    },
});