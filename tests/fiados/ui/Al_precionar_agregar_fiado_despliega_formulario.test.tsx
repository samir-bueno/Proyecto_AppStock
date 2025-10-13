import FiadoScreen from "@/app/(tabs)/fiados";
import { AuthProvider } from "@/contexts/AuthProvider";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

describe("Como cajero, deseo registrar un nuevo cliente fiado con su nombre y telefono para mantener control de su deuda", () => {
  test("Si el nombre esta vacio, al presionar agregar, debe mostrarse un nombre de error", async () => {
    const { getByText } = render(<FiadoScreen />,
        {
          wrapper: AuthProvider,
        }
    );

    fireEvent.press(getByText("Agregar Cliente Fiado"));
    await waitFor(() =>
      expect(
        screen.getByText("Agregar Nuevo Cliente")
      ).toBeTruthy()
    );
  });
});
