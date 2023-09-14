import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import {
  Center,
  VStack,
  ScrollView,
  Skeleton,
  Text,
  Heading,
  Toast,
  useToast,
} from "native-base";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { FileInfo } from "expo-file-system";

const UserImg = "https://github.com/erickcloud.png";
const PHOTO_SIZE = 33;

export function ProfileScreen() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/erickcloud.png"
  );

  const toast = useToast();

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
      if (photoSelected.canceled) {
        return;
      }
      const PhotoURI = photoSelected.assets[0].uri;
      if (PhotoURI) {
        const PhotoInfo = (await FileSystem.getInfoAsync(PhotoURI)) as FileInfo;
        if (PhotoInfo.size && PhotoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: "Imagem maior que 5MB!",
            placement: "top",
            bgColor: "red.500",
          });
        }
        setUserPhoto(PhotoURI);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              rounded={"full"}
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={{ uri: userPhoto }}
              size={PHOTO_SIZE}
              alt="Foto  do usuario"
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontWeight={"bold"}
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input bg={"gray.600"} placeholder="Nome" />
          <Input
            bg={"gray.600"}
            placeholder="erickcloud@email.com"
            isDisabled
          />

          <Heading
            color="gray.200"
            fontSize={"md"}
            alignSelf="flex-start"
            mb={2}
            mt={12}
            fontFamily="heading"
          >
            Alterar senha
          </Heading>

          <Input bg={"gray.600"} placeholder="Senha antiga" secureTextEntry />

          <Input bg={"gray.600"} placeholder="Nova senha" secureTextEntry />
          <Input
            bg={"gray.600"}
            placeholder="confirme a nova senha"
            secureTextEntry
          />

          <Button title="Atualizar" mt={4} />
        </Center>
      </ScrollView>
    </VStack>
  );
}
