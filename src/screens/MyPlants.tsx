import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, FlatList, Alert } from 'react-native';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';
import { loadPlants, PlantProps, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWaterd, setNextWaterd] = useState<string>('');

    useEffect(() => {
        loadStorageData();
    }, []);


    async function handleConfirmRemovePlant(plant: PlantProps) {
        try {
            await removePlant(plant);
            loadStorageData();
        } catch (error) {
            console.error(error);
            Alert.alert(
                'Não conseguimos deletar essa planta', 
                'Nada acontece por acaso 😔✋'
            );
        }
    }

    function handleRemove(plant: PlantProps) {
        Alert.alert(
            'Remover', 
            `Deseja removar a ${plant.name} ?`,
            [
                {
                    text: 'Não 🙏'
                },
                {
                    text: 'Sim 😥',
                    onPress: () => handleConfirmRemovePlant(plant),
                }
            ],
        );
    }

    async function loadStorageData() {
        const plantsStoraged = await loadPlants();

        const [firstPlant] = plantsStoraged;

        if(firstPlant) {
            const nextTime = formatDistance(
                new Date(firstPlant.dateTimeNotification).getTime(),
                new Date().getTime(),
                {
                    locale: pt,
                }
            );
    
            setNextWaterd(`Não esqueça de regar a ${firstPlant.name} em ${nextTime}`);
        } else {
            setNextWaterd('');
        }

        setMyPlants(plantsStoraged);
        setLoading(false);
    }


    function shouldRenderSpotlightCard() {
        return nextWaterd?.trim()?.length > 0;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Header
                    avatar="https://avatar.iran.liara.run/public/boy?username=Ash"
                />

                {shouldRenderSpotlightCard() && (
                    <View style={styles.spotlight}>
                        <Image 
                            source={waterdrop}
                            style={styles.spotlightImage}
                        />

                        <Text style={styles.spotlightText}>
                            {nextWaterd}
                        </Text>
                    </View>
                )}
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
                                handleRemove={() =>  handleRemove(item)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
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