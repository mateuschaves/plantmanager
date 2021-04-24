import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

import { EnvironmentButton } from '../components/EnvironmentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Header } from '../components/Header';
import { Load } from '../components/Load';

import api from '../services/api';

interface Plant {
    id: number,
    name: string,
    about: string,
    water_tips: string,
    photo: string;
    environments: string[];
    frequency: { 
        times: number, 
        repeat_every: 'day' | 'week' 
    };
}

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
    const [plants, setPlants] = useState<Plant[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState<PlantEnvironment>(allPlantsEnvironments);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(true);
    const [loadedAll, setLoadedAll] = useState(false);

    function handleEnvironmentSelected(environmentSelected: PlantEnvironment) {
        setEnvironmentSelected(environmentSelected);
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
        const plantsEnvironmentResponse = await api.get<PlantEnvironment[]>('/plants_environments', {
            params: { 
                _sort: 'title',
                _order: 'asc'
            }
        });

        setEnvironments([
            allPlantsEnvironments,
            ...plantsEnvironmentResponse.data,
        ]);
    }

    async function getPlants() {
        const plants = await api.get<Plant[]>('/plants', {
            params: {
                _sort: 'name',
                _order: 'asc',
                _page: page,
                _limit: 8,
            }
        });
        if(!plants.data)
            return setLoading(true);
        if(page > 1)
            setPlants(oldPlants => [...oldPlants, ...plants.data]);
        else
            setPlants(plants.data);

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
                        name="Mateus"
                        avatar="https://pbs.twimg.com/profile_images/1361532415718604800/u3h3yg2D_400x400.jpg"
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
                                />
                            )}
                            keyExtractor={item => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            onEndReachedThreshold={0.1}
                            onEndReached={({ distanceFromEnd }) => handleFetchMorePlants(distanceFromEnd)}
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