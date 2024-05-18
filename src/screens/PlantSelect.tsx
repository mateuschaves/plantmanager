import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import { useNavigation } from '@react-navigation/native';

import { EnvironmentButton } from '../components/EnvironmentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Header } from '../components/Header';
import { Load } from '../components/Load';

import { PlantProps } from '../libs/storage';

import ApiJson from '../services/server.json';

interface PlantEnvironment {
    id: number,
    key: string;
    title: string;
}

const allPlantsEnvironments = {
    id: 0,
    key: 'all',
    title: 'Todos',
}

export function PlantSelect() {
    const [environments, setEnvironments] = useState<PlantEnvironment[]>();
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState<PlantEnvironment>(allPlantsEnvironments);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(true);

    const navigation = useNavigation();

    function handleEnvironmentSelected(environmentSelected: PlantEnvironment) {
        setEnvironmentSelected(environmentSelected);
    }

    function handlePlantSelect(plant: PlantProps) {
        navigation.navigate('PlantSave', {
            plant
        });
    }

    function filterPlants(environmentSelected: PlantEnvironment) {
       if(environmentSelected.key === 'all')
        setFilteredPlants(plants);
       else
        setFilteredPlants(
            plants.filter(plant => plant.environments.includes(environmentSelected.key))
        );
    }

    useEffect(() => {
        Promise.all([
            getPlantEnvironments(),
            getPlants(),
        ])
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        filterPlants(environmentSelected);
    }, [environmentSelected, plants]);

    async function getPlantEnvironments() {
        setEnvironments(ApiJson.plants_environments);
    }

    async function getPlants() {
        const plants = ApiJson.plants;

        setPlants(plants);

        setLoadingMore(false);
    }

    function handleFetchMorePlants(distance: number) {
        if(distance < 1)
            return;
        
        setLoadingMore(true);
        setPage(oldPage => oldPage + 1);
        getPlants();
    }

    if(loading) 
        return <Load />
    else
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Header 
                        avatar="https://avatar.iran.liara.run/public/boy?username=Ash"
                    />

                    <Text style={styles.title}>
                        {`Em qual ambiente\n`}
                        <Text style={styles.subtitle}>
                            você quer colocar sua planta ?
                        </Text>
                    </Text>


                    <View>
                        <FlatList
                            data={environments}
                            renderItem={({ item }) => (
                                <EnvironmentButton 
                                    title={item.title}
                                    active={item.key === environmentSelected.key || environmentSelected.key === 'all'}
                                    onPress={() => handleEnvironmentSelected(item)}
                                />
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.enviromentList}
                        />
                    </View>

                    <View style={styles.plants}>
                        <FlatList
                            data={filteredPlants}
                            renderItem={({ item }) => (
                                <PlantCardPrimary 
                                    data={item}
                                    onPress={() => handlePlantSelect(item)}
                                />
                            )}
                            keyExtractor={item => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            ListFooterComponent={
                                loadingMore ? <ActivityIndicator color={colors.green}/> : <></>
                            }
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
        backgroundColor: colors.background,
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 40,
    },
    subtitle: {
        fontFamily: fonts.text,
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginVertical: 32,
    },
    plants: {
        flex: 1,
        justifyContent: 'center',
    }
})