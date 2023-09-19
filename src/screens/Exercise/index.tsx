import { TouchableOpacity } from "react-native";
import {
  VStack,
  Heading,
  Icon,
  HStack,
  Text,
  Image,
  Box,
  ScrollView,
  useToast,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";
type RouteParamsProps = {
  exerciseId: string;
};

export function ExerciseScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [sendingRegister, setSendingRegister] = useState(false);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const { exerciseId } = route.params as RouteParamsProps;

  const fetchExerciseDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Houve um erro, tente novamente mais tarde.";
      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseHistoryRegister = async () => {
    try {
      setSendingRegister(true);
      await api.post("/history", { exercise_id: exerciseId });

      toast.show({
        title: "Exercício registrado com sucesso",
        placement: "top",
        bgColor: "green.700",
      });

      navigation.navigate("history");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel carregar os exercicios.";
      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setSendingRegister(false);
    }
  };

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack
          mt={4}
          mb={8}
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Heading
            fontFamily="heading"
            fontSize={"lg"}
            color="gray.100"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>

          <HStack alignItems={"center"}>
            <BodySvg />
            <Text color="gray.200" textTransform="capitalize" ml={1}>
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView>
        {isLoading ? (
          <Loading />
        ) : (
          <VStack p={8}>
            <Box rounded={"lg"} mb={3} overflow="hidden">
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt="Nome do exercício"
                w="full"
                h={80}
                resizeMode="cover"
                rounded="lg"
              />
            </Box>

            <Box bg="gray.600" rounded={"md"} pb={4} px={4}>
              <HStack
                alignItems={"center"}
                justifyContent="space-around"
                mb={6}
                mt={5}
              >
                <HStack>
                  <SeriesSvg />
                  <Text color="gray.200" ml="2">
                    {exercise.series} séries
                  </Text>
                </HStack>
                <HStack>
                  <RepetitionsSvg />
                  <Text color="gray.200" ml="2">
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>
              <Button
                title="Marcar como realizado"
                isLoading={sendingRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
