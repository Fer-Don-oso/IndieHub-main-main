import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import { vi } from "vitest";

describe("Render de login", () => {
    
    beforeAll(() => {
        window.alert = vi.fn();
    });

    it("Render de bienvenida", () => {
        render(
            <MemoryRouter>
                <Login setIsLoggedIn={() => {}} />
            </MemoryRouter>
        );
        expect(screen.getByText("Por favor, inicia sesión")).toBeInTheDocument();
    });

    it("Render de boton Iniciar sesión", () => {
        render(
            <MemoryRouter>
                <Login setIsLoggedIn={() => {}} />
            </MemoryRouter>
        );
        expect(screen.getByRole("button", { name: /Iniciar sesión/i })).toBeInTheDocument();
    });

    it("Muestra mensaje al hacer click en Iniciar sesión", () => {
        render(
            <MemoryRouter>
                <Login setIsLoggedIn={() => {}} />
            </MemoryRouter>
        );
        const boton = screen.getByRole("button", { name: /Iniciar sesión/i });
        fireEvent.click(boton);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Correo o contraseña incorrectos./i));
    });

});