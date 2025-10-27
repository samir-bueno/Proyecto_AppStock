import Header from "@/components/global/header";
import { AuthProvider } from "@/contexts/AuthProvider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

test("Al tocar el ícono de cerrar sesión, se muestra un diálogo de confirmación.", async () => {
  render(<Header />, {wrapper: AuthProvider});

  fireEvent.press(screen.getByTestId("logout"));

  await waitFor(() => {
    expect(screen.getByText("¿Cerrar sesión?")).toBeTruthy();
    expect(screen.getByText("Estás a punto de cerrar sesión, ¿estás seguro?")).toBeTruthy();
    expect(screen.getByText("Cancelar")).toBeTruthy();
    expect(screen.getByText("Confirmar")).toBeTruthy();
  });
});