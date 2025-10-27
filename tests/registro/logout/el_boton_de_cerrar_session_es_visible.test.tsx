import Header from "@/components/global/header";
import { AuthProvider } from "@/contexts/AuthProvider";
import { render, screen } from "@testing-library/react-native";

test("Debe existir un botón de cerrar sesión visible en el header de la aplicación.", () => {
  render(<Header />, {wrapper: AuthProvider});

  expect(screen.getByTestId("logout")).toBeTruthy();
});