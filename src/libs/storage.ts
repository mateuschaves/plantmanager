import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as Notification from 'expo-notifications';

export interface PlantProps {
    id: string,
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
        data: PlantProps,
        notificationId: string;
    }
}

export async function plantSave(plant: PlantProps): Promise<void> {
    try {
        const nextTime = new Date(plant.dateTimeNotification);
        const now = new Date();

        const { times, repeat_every } = plant.frequency;

        if(repeat_every === 'week') {
            const interval = Math.trunc( 7 / times );
            nextTime.setDate(now.getDate() + interval);
        } else {
            nextTime.setDate(nextTime.getDate() + 1);
        }

        const seconds = Math.abs(
            Math.ceil((now.getTime() - nextTime.getTime()) / 1000)
        );

        const notificationId = await Notification.scheduleNotificationAsync({
            content: {
                title: 'Heeeyy, planta faz isso ?🌱',
                body: `Está na hora de cuidar da sua ${plant.name}`,
                sound: true,
                priority: Notification.AndroidNotificationPriority.HIGH,
                data: {
                    plant,
                },
            },
            trigger: {
                seconds: seconds < 60 ? 60 : seconds,
                repeats: true,
            }
        });

        const plantsOnStorage = JSON.parse(await AsyncStorage.getItem('@plantmanager/plants') || '{}') as StoragePlantProps;
        const newPlant = {
            [plant.id]: {
                data: plant,
                notificationId,
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

export async function removePlant(plant: PlantProps): Promise<void> {
    try {
        const plants = JSON.parse(await AsyncStorage.getItem('@plantmanager/plants') || '{}') as StoragePlantProps[];
        const notificationId = plants[plant.id].notificationId;
        delete plants[plant.id];
        await AsyncStorage.setItem('@plantmanager/plants', JSON.stringify(plants));
        await Notification.cancelScheduledNotificationAsync(
            notificationId
        );
    } catch (error) {
        throw new Error(error);
    }
}