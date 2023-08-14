import { Platform } from "react-native";
import { VStack, Image, Text, Center, Heading, ScrollView } from "native-base";
import BackGroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount() {
    navigation.navigate("signUp");
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack
        flex={1}
        px={10}
        bg="gray.700"
        pb={Platform.OS === "ios" ? 40 : 16}
      >
        <Image
          source={BackGroundImg}
          defaultSource={BackGroundImg}
          alt="loginImageBackground"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />
          <Text fontFamily="body" fontSize="sm" color={"gray.100"}>
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading fontSize={"xl"} fontFamily="heading" mb={6} color="gray.100">
            Acesse sua conta
          </Heading>

          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input placeholder="Senha" secureTextEntry />
          <Button title="Acessar" />
        </Center>

        <Center mt={24}>
          <Text fontFamily="body" fontSize="sm" color={"gray.100"} mb={3}>
            Ainda não tem acesso?
          </Text>
          <Button
            title="Criar conta"
            variant={"outline"}
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
