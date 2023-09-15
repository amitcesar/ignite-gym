import { AuthContext } from "@contexts/AuthContext";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useTheme, Box } from "native-base";
import { useContext } from "react";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { colors } = useTheme();
  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  const contextData = useContext(AuthContext);
  console.log(contextData);
  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}
