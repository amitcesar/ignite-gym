import { useCallback, useEffect, useState } from "react";
import { HStack, VStack, FlatList, Heading, Text, useToast } from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";
import { Loading } from "@components/Loading";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { AppError } from "@utils/AppError";

import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

export function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [groupSelected, setGroupSelected] = useState("antebraço");
  const [groups, setGroups] = useState<string[]>([]);

  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const handleOpenExerciseDetails = (exerciseId: string) => {
    navigation.navigate("exercise", { exerciseId });
  };

  const toast = useToast();

  const fetchGroups = async () => {
    try {
      const response = await api.get("/groups");
      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Grupo não foram carregados, tente novamente mais tarde.";
      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  };

  const fetchExercisesByGroup = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Grupo não foram carregados, tente novamente mais tarde.";
      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()
            }
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack justifyContent={"space-between"} mb={5}>
            <Heading color="gray.200" fontSize={"md"} fontFamily="heading">
              Exercicio
            </Heading>

            <Text color="gray.200" fontSize={"sm"}>
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleOpenExerciseDetails(item.id)}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  );
}
