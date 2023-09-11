import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {
  Center,
  VStack,
  ScrollView,
  Skeleton,
  Text,
  Heading,
} from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

const UserImg = "https://github.com/erickcloud.png";
const PHOTO_SIZE = 33;

export function ProfileScreen() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
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
            <UserPhoto src={UserImg} size={PHOTO_SIZE} alt="Foto  do usuario" />
          )}

          <TouchableOpacity>
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
