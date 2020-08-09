import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";

import styles from "./styles";
import AsyncStorage from '@react-native-community/async-storage'
import PageHeader from "../../components/PageHeader";
import TeacherItem, { Teacher } from "../../components/TeacherItem";
import { TextInput, BorderlessButton, RectButton } from "react-native-gesture-handler";

import { Feather } from '@expo/vector-icons'
import api from "../../services/api";
import { useFocusEffect } from "@react-navigation/native";

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [subject, setSubject] = useState('');
    const [week_day, setWeek_day] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem("favorites")
            .then((response) => {
                if (response) {
                    const favoritedTeachers = JSON.parse(response);
                    const favoritedTeachersId = favoritedTeachers.map((item: Teacher) => item.id)

                    setFavorites(favoritedTeachersId);
                }
            })
    }

    useFocusEffect(
        React.useCallback(() => {
          loadFavorites();
        }, [])
      )

    function handleToggleIsFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handleFiltersSubmit() {
        loadFavorites();

        const response = await api.get("classes", {
            params: {
                subject,
                week_day,
                time
            }
        });

        handleToggleIsFiltersVisible();
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader title="Proffys disponíves"
                headerRight={(
                    <BorderlessButton onPress={handleToggleIsFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                )}
            >
                {
                    isFiltersVisible &&
                    (
                        <View style={styles.searchForm}>
                            <Text style={styles.label}>
                                Matéria
                        </Text>
                            <TextInput
                                value={subject}
                                onChangeText={(text) => setSubject(text)}
                                placeholderTextColor="#C1BCCC"
                                placeholder="Qual a matéria?"
                                style={styles.input} />
                            <View style={styles.inputGroup}>
                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>
                                        Dia da semana
                                </Text>
                                    <TextInput
                                        value={week_day}
                                        onChangeText={(text) => setWeek_day(text)}
                                        placeholderTextColor="#C1BCCC"
                                        placeholder="Qual o dia?"
                                        style={styles.input} />
                                </View>
                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>
                                        Horário
                                </Text>
                                    <TextInput
                                        value={time}
                                        onChangeText={(text) => setTime(text)}
                                        placeholderTextColor="#C1BCCC"
                                        placeholder="Qual o horário?"
                                        style={styles.input} />
                                </View>
                            </View>

                            <RectButton
                                onPress={handleFiltersSubmit}
                                style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>
                                    Filtrar
                            </Text>
                            </RectButton>
                        </View>
                    )
                }

            </PageHeader>

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
                style={styles.teacherList}>
                {teachers.map((item: Teacher) => (
                    <TeacherItem
                        favorited={favorites.includes(item.id)}
                        teacher={item}
                        key={item.id} />
                ))}
            </ScrollView>
        </View>
    )
}

export default TeacherList;