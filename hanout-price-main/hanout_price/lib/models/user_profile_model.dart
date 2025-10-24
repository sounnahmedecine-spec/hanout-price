import 'package:cloud_firestore/cloud_firestore.dart';

class UserProfile {
  final String uid;
  final String name;
  final String email;
  final String? avatarUrl;
  final int points;
  final int contributionCount;
  final Timestamp memberSince;

  UserProfile({
    required this.uid,
    required this.name,
    required this.email,
    this.avatarUrl,
    required this.points,
    required this.contributionCount,
    required this.memberSince,
  });

  factory UserProfile.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return UserProfile(
      uid: doc.id,
      name: data['username'] ?? 'Utilisateur Anonyme',
      email: data['email'] ?? '',
      avatarUrl: data['avatarUrl'],
      points: data['points'] ?? 0,
      contributionCount: data['contributions'] ?? 0,
      memberSince: data['createdAt'] ?? Timestamp.now(),
    );
  }
}
