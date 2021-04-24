import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';


interface HeaderProps {
    name: string;
    avatar: string;
}

export function Header({ name, avatar }: HeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>
                {`Olá\n`}
                <Text style={styles.name}>
                    {name}
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