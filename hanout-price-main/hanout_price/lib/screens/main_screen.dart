import 'package:flutter/material.dart';
import 'package:hanout_price/screens/scan_screen.dart';
import 'package:hanout_price/screens/profile_screen.dart';
import 'package:hanout_price/home_screen.dart';
import 'package:hanout_price/screens/add_price_screen.dart';
import 'package:hanout_price/widgets/bottom_nav_bar.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  // La liste des écrans ne peut plus être 'const' car les constructeurs ne le sont pas toujours.
  final List<Widget> _widgetOptions = <Widget>[
    const HomeScreen(),
    const ScanScreen(),
    const AddPriceScreen(barcode: ''), // Placeholder for manual entry
    const ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // IndexedStack préserve l'état des onglets, y compris la WebView,
      // ce qui évite de la recharger à chaque changement d'onglet.
      body: IndexedStack(index: _selectedIndex, children: _widgetOptions),
      bottomNavigationBar: BottomNavBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}
