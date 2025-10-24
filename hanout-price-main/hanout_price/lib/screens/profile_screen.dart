import 'package:flutter/material.dart';
import 'package:hanout_price/models/product_model.dart';
import 'package:hanout_price/models/user_profile_model.dart';
import 'package:hanout_price/services/firebase_service.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:hanout_price/screens/leaderboard_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final firebaseService = context.read<FirebaseService>();
    final currentUser = firebaseService.currentUser;

    if (currentUser == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Profil')),
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.person_off_outlined, size: 80, color: Colors.grey),
              SizedBox(height: 16),
              Text(
                'Veuillez vous connecter',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              Text(
                'Connectez-vous pour voir votre profil.',
                style: TextStyle(color: Colors.grey),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: theme.colorScheme.primary,
        foregroundColor: theme.colorScheme.onPrimary,
        title: const Text('Profil'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.leaderboard_outlined),
            onPressed: () {
              // Correction : Il y avait deux MaterialPageRoute en double.
              // On n'en garde qu'un seul.
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const LeaderboardScreen(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await firebaseService.signOut();
              // The auth state change will be caught by a listener at the root of the app
              // which will handle navigation, but for immediate feedback:
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Vous avez été déconnecté.')),
                );
              }
            },
          ),
        ],
      ),
      body: FutureBuilder<DocumentSnapshot<Map<String, dynamic>>>(
        future: firebaseService.getUserProfile(
          currentUser.uid,
        ), // Assurez-vous que cette méthode existe
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          // Gestion d'erreur plus détaillée
          if (snapshot.hasError) {
            // Log l'erreur pour le débogage
            print("Erreur de chargement du profil: ${snapshot.error}");
            return Center(
              child: Text(
                'Une erreur est survenue: ${snapshot.error}',
                textAlign: TextAlign.center,
              ),
            );
          }

          // Cas où le document du profil n'existe pas dans Firestore
          if (!snapshot.hasData || !snapshot.data!.exists) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.person_search_outlined,
                    size: 80,
                    color: Colors.grey,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Profil non trouvé',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'Le profil pour ${currentUser.email} n\'a pas encore été créé.',
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            );
          }

          final userProfile = UserProfile.fromFirestore(snapshot.data!);

          return ListView(
            padding: const EdgeInsets.all(16.0),
            children: [
              _buildProfileHeader(context, theme, userProfile),
              const SizedBox(height: 24),
              _buildSectionTitle('Badges (à venir)', theme),
              _buildBadges(context, theme),
              const SizedBox(height: 24),
              _buildSectionTitle('Vos Contributions', theme),
              _UserContributions(uid: userProfile.uid),
            ],
          );
        },
      ),
    );
  }

  Widget _buildProfileHeader(
    BuildContext context,
    ThemeData theme,
    UserProfile user,
  ) {
    // Helper to get initials from name
    String getInitials(String name) {
      List<String> names = name.split(" ");
      return names
          .map((e) => e.isNotEmpty ? e[0] : "")
          .take(2)
          .join()
          .toUpperCase();
    }

    return Column(
      children: [
        CircleAvatar(
          radius: 50,
          backgroundImage: user.avatarUrl != null
              ? NetworkImage(user.avatarUrl!)
              : null,
          backgroundColor: Colors.grey.shade200,
          child: user.avatarUrl == null
              ? Text(
                  getInitials(user.name),
                  style: theme.textTheme.headlineSmall?.copyWith(
                    color: theme.primaryColor,
                  ),
                )
              : null,
        ),
        const SizedBox(height: 16),
        Text(
          user.name,
          style: theme.textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          // Using a simpler date format as intl is removed.
          'Membre depuis ${user.memberSince.toDate().day}/${user.memberSince.toDate().month}/${user.memberSince.toDate().year}',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: Colors.grey.shade600,
          ),
        ),
        const SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildStatColumn('Points', user.points.toString(), theme),
            _buildStatColumn(
              'Contributions',
              user.contributionCount.toString(),
              theme,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title, ThemeData theme) {
    return Text(
      title,
      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
    );
  }

  Widget _buildStatColumn(String label, String value, ThemeData theme) {
    return Column(
      children: [
        Text(
          value,
          style: theme.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.primary,
          ),
        ),
        Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  Widget _buildBadges(BuildContext context, ThemeData theme) {
    // Placeholder for badges
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(24.0),
        child: Center(
          child: Text(
            'Les badges seront bientôt disponibles !',
            style: TextStyle(color: Colors.grey),
          ),
        ),
      ),
    );
  }
}

class _UserContributions extends StatelessWidget {
  final String uid;
  const _UserContributions({required this.uid});

  @override
  Widget build(BuildContext context) {
    final firebaseService = context.read<FirebaseService>();

    return StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
      stream: firebaseService.getUserContributionsStream(
        uid,
      ), // Assurez-vous que cette méthode existe
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 32.0),
              child: CircularProgressIndicator(),
            ),
          );
        }

        if (snapshot.hasError) {
          return Center(child: Text('Erreur: ${snapshot.error}'));
        }

        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return const Card(
            child: Padding(
              padding: EdgeInsets.all(24.0),
              child: Center(
                child: Text(
                  'Aucune contribution pour le moment.',
                  style: TextStyle(color: Colors.grey),
                ),
              ),
            ),
          );
        }

        final contributions = snapshot.data!.docs
            .map((doc) => Product.fromFirestore(doc))
            .toList();

        return Card(
          clipBehavior: Clip
              .antiAlias, // Ensures the dividers don't overflow the card's rounded corners
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: contributions.length,
            separatorBuilder: (context, index) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final contrib = contributions[index];
              return ListTile(
                leading: const Icon(Icons.add_shopping_cart_outlined),
                title: Text(
                  contrib.name,
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                subtitle: Text(contrib.storeName),
                trailing: Text(
                  '${contrib.price.toStringAsFixed(2)} MAD',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
