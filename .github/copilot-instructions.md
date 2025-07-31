# Copilot Instructions for GeneradorEC

## Project Overview

This is a full-stack application for generating valid Ecuadorian data (cedulas, names, addresses, phone numbers) similar to generadordni.es but specifically for Ecuador.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: NestJS + TypeScript
- **Deployment**: Docker + Kubernetes + ArgoCD

## Domain & Branding

- Domain: generadorec.dmarmijosa.com
- Support Email: support-client@dmarmijosa.com
- Author: Danny Armijos
- LinkedIn: https://www.linkedin.com/in/dmarmijosa/
- Website: https://www.danny-armijos.com/
- Buy me a coffee: https://coff.ee/dmarmijosa

## Ecuador Color Palette

Use these colors consistently throughout the application:

- ecuador-yellow: #FFDD00
- ecuador-blue: #034EA2
- ecuador-red: #EE1C25

## Code Style Guidelines

- Use TypeScript for all new files
- Follow functional components with hooks in React
- Use Tailwind CSS classes, avoid custom CSS when possible
- Prefer named exports over default exports
- Use environment variables for configuration
- Follow NestJS best practices for backend API
- Use proper error handling and validation

## Ecuador-Specific Data Generation

When creating data generators, ensure:

- Cedula validation follows Ecuadorian algorithm
- Use real Ecuadorian province and canton names
- Generate typical Ecuadorian names and surnames
- Use correct Ecuadorian phone number formats
- Include realistic Ecuadorian addresses
- Generate proper business names for Ecuador

## Important Notes

- All generated data must be fictional
- Focus on educational and development purposes
- Maintain responsive design for all screen sizes
- Ensure accessibility compliance
- Use semantic HTML structure
