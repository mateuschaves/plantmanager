import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface PlantProps {
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
    hour: string;
    dateTimeNotification: Date;
}

export interface StoragePlantProps {
    [id: string]: {
        data: PlantProps
    }
}

export async function plantSave(plant: PlantProps): Promise<void> {
    try {
        const plantsOnStorage = JSON.parse(await AsyncStorage.getItem('@plantmanager/plants') || '{}') as StoragePlantProps;
        const newPlant = {
            [plant.id]: {
                data: plant,
            }
        }

        await AsyncStorage.setItem('@plantmanager/plants', JSON.stringify({
            ...newPlant,
            ...plantsOnStorage,
        }));

    } catch (error) {
        throw new Error(error);
    }
}

export async function loadPlants(): Promise<PlantProps[]> {
    try {
        const plants = JSON.parse(await AsyncStorage.getItem('@plantmanager/plants') || '{}') as StoragePlantProps[];
        
        const plantsSorted = Object
            .keys(plants)
            .map((plant) => {
                return ({
                    ...plants[plant].data,
                    hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
                });
            })
            .sort((a, b) => 
                Math.floor(
                    new Date(a.dateTimeNofitication).getTime() / 1000 -
                    Math.floor(new Date(b.dateTimeNofitication).getTime() / 1000)
                )
            );
        return plantsSorted;
    } catch (error) {
        throw new Error(error);   
    }
}