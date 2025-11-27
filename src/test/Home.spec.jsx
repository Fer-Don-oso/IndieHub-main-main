import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/Home";
import { it } from "vitest";

describe("Render de Home", () => {

    it("Render de titulo de Home", () => {
        render(<Home />);

        const titleElement = screen.getByText(/Juegos Indie que podrian gustarte:/i);
        expect(titleElement).toBeInTheDocument();
    });

    it("Render de subtitulo de Home", () => {
        render(<Home />);

        const titleElement = screen.getByText(/Explora nuestra selección de juegos indie únicos y emocionantes/i);
        expect(titleElement).toBeInTheDocument();
    });

    it("Render de botones para agregar al carrito", () => {
      render(<Home />);
      const buttons = screen.getAllByRole("button", { name: /Agregar al carrito/i });
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("Llama a alert al agregar al carrito", () => {
      window.alert = vi.fn();
      render(<Home />);
      const botones = screen.getAllByRole("button", { name: /Agregar al carrito/i });
      fireEvent.click(botones[0]);
      expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/agregado al carrito/i));
    });

});