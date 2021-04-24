import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentButtonButtonProps extends RectButtonProps {
    title: string;
    active?: boolean;
}

export function EnvironmentButton({ title, active = false, ...rest }: EnvironmentButtonButtonProps) {
    return (
       <RectButton
        style={[
            styles.container,
            active && styles.containerActive,
        ]}
        {...rest}
       >
           <Text style={[
               styles.text,
               active && styles.textActive,
           ]}>
               {title}
           </Text>
       </RectButton>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.shape,
        paddingVertical: 7,
        paddingHorizontal: 20,
        height: 40,
        borderRadius: 12,
        marginRight: 4,
    },
    containerActive: {
        backgroundColor: colors.green_light,
    },
    text: {
        color: colors.heading,
        fontFamily: fonts.text,
    },
    textActive: {
        fontFamily: fonts.heading,
        color: colors.green,
    }
});
