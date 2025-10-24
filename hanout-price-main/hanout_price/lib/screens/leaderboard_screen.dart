import 'package:flutter/material.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Classement"),
        backgroundColor: const Color(0xFFFF6F61),
      ),
      body: const Center(
        child: Text("Classement à venir 🏆", style: TextStyle(fontSize: 18)),
      ),
    );
  }
}
