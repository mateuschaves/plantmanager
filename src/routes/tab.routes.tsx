import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../styles/colors';
import { PlantSelect } from '../screens/PlantSelect';
import { MaterialIcons } from '@expo/vector-icons';
import { MyPlants } from '../screens/MyPlants';

const AppTab = createBottomTabNavigator();

const AuthRoutes = () => {
    return (
        <AppTab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: 'white'
                }
            }}
            tabBarOptions={{
                activeTintColor: colors.green,
                inactiveTintColor: colors.heading,
                labelPosition: 'beside-icon',
                style: {
                    paddingVertical: 20,
                    height: 88,
                }
            }}
        >
        
            <AppTab.Screen 
                name="Nova Planta"
                component={PlantSelect}
                options={{
                    tabBarIcon: (({size, color}) => (
                        <MaterialIcons 
                            name="add-circle-outline"
                            size={size}
                            color={color}
                        />
                    )
                )}}
            />

            <AppTab.Screen 
                name="Minhas Plantas"
                component={MyPlants}
                options={{
                    tabBarIcon: (({size, color}) => (
                        <MaterialIcons 
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    )
                )}}
            /> 
        
        </AppTab.Navigator>
    )
}

export default AuthRoutes;