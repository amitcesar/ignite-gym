import { Platform } from "react-native";
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import { yupResolver } from "@hookform/resolvers/yup";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import BackGroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { signInSchema } from "@services/schemas";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";

type FormDataProps = {
  email: string;
  password: string;
};

export function SignIn() {
  const { signIn } = useAuth();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount() {
    navigation.navigate("signUp");
  }

  const handleLoginSubmit = async ({ email, password }: FormDataProps) => {
    try {
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível entrar. Tente novamente mais tarde.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  };

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

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button title="Acessar" onPress={handleSubmit(handleLoginSubmit)} />
        </Center>

        <Center mt={24}>
          <Text fontFamily="body" fontSize="sm" color={"gray.100"} mb={3}>
            Ainda não tem acesso?
          </Text>
          <Button
            title="Criar conta"
            variant={"outline"}
            onPress={handleNewAccount}
            isLoading={isSubmitting}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
