import 'package:flutter/material.dart';

final ThemeData hanoutTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFFFF6F61), // Une couleur corail
    primary: const Color(0xFFFF6F61),
    secondary: const Color(0xFF4CAF50), // Un accent vert
    background: Colors.white,
    surface: Colors.white,
    onPrimary: Colors.white,
    onSecondary: Colors.white,
    onBackground: Colors.black87,
    onSurface: Colors.black87,
    error: Colors.red,
    onError: Colors.white,
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: Color(0xFFFF6F61), // Utilise la couleur primaire
    foregroundColor: Colors.white, // Texte et icônes blancs pour le contraste
    elevation: 0,
  ),
);
