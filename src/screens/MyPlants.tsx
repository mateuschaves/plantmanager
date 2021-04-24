import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, FlatList } from 'react-native';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';
import { loadPlants, PlantProps } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWaterd, setNextWaterd] = useState('');

    useEffect(() => {
        loadStorageData();
    }, []);

    async function loadStorageData() {
        const plantsStoraged = await loadPlants();

        const [firstPlant] = plantsStoraged;

        const nextTime = formatDistance(
            new Date(firstPlant.dateTimeNotification).getTime(),
            new Date().getTime(),
            {
                locale: pt,
            }
        );

        setNextWaterd(`Não esqueça de regar a ${firstPlant.name} em ${nextTime}`);

        setMyPlants(plantsStoraged);
        setLoading(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Header
                    avatar="https://pbs.twimg.com/profile_images/1361532415718604800/u3h3yg2D_400x400.jpg"
                />

                <View style={styles.spotlight}>
                    <Image 
                        source={waterdrop}
                        style={styles.spotlightImage}
                    />

                    <Text style={styles.spotlightText}>
                        {nextWaterd}
                    </Text>
                </View>

                <View style={styles.plants}>
                    <Text style={styles.plantsTitle}>
                        Próximas regadas
                    </Text>

                    <FlatList 
                        data={myPlants}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <PlantCardSecondary 
                                data={item}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flex: 1
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingTop: 50,
        backgroundColor: colors.background,
    },
    spotlightImage: {
        width: 60,
        height: 60,
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%',
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20,
    }
});