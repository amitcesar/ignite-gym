import { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Center,
  VStack,
  ScrollView,
  Skeleton,
  Text,
  Heading,
  useToast,
} from "native-base";

import { FileInfo } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";

import { api } from "@services/api";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { profileSchema } from "@services/schemas";

const PHOTO_SIZE = 33;

type ProfileFormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

export function ProfileScreen() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const { user, updateUserProfile } = useAuth();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema as any),
  });

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

        const fileExtension = PhotoURI.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
          uri: PhotoURI,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);
        const avatarUpdatedResponse = await api.patch(
          "/users/avatar",
          userPhotoUploadForm,
          {
            headers: {
              accept: "application/json",
              "content-type": "multipart/form-data",
            },
          }
        );

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        updateUserProfile(userUpdated);

        toast.show({
          title: "Foto atualizada com sucesso !",
          placement: "top",
          bgColor: "green.500",
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setPhotoIsLoading(false);
    }
  }

  const handleProfileUpdate = async (data: ProfileFormDataProps) => {
    try {
      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", data);
      await updateUserProfile(userUpdated);

      toast.show({
        title: "Perfil atualizado com sucesso! ",
        placement: "top",
        bgColor: "green.500",
      });
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
    }
  };

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
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserPhotoImg
              }
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

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
                bg={"gray.600"}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg={"gray.600"}
                placeholder="E-mail"
                isDisabled
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
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

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                secureTextEntry
                placeholder="senha antiga"
                bg={"gray.600"}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg={"gray.600"}
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isSubmitting}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
