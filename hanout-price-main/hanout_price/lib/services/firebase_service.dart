import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';

class FirebaseService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  /// 🔹 Authentification utilisateur
  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  Future<UserCredential> signInWithEmailAndPassword(
    String email,
    String password,
  ) {
    return _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<UserCredential> signUpWithEmailAndPassword(
    String email,
    String password,
    String displayName,
  ) async {
    UserCredential userCredential = await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
    // Create a user profile document
    await _firestore.collection('users').doc(userCredential.user!.uid).set({
      'uid': userCredential.user!.uid,
      'name': displayName,
      'email': email,
      'avatarUrl': null,
      'points': 0,
      'contributionCount': 0,
      'memberSince': FieldValue.serverTimestamp(),
    });
    return userCredential;
  }

  Future<void> signOut() => _auth.signOut();

  /// 🔹 User Profile
  Future<DocumentSnapshot<Map<String, dynamic>>> getUserProfile(String uid) {
    return _firestore.collection('users').doc(uid).get();
  }

  /// 🔹 Contributions
  Stream<QuerySnapshot<Map<String, dynamic>>> getUserContributionsStream(
    String uid,
  ) {
    return _firestore
        .collection('contributions')
        .where(
          'userId',
          isEqualTo: uid,
        ) // Assurez-vous que le champ est 'userId'
        .orderBy('timestamp', descending: true)
        .snapshots();
  }

  Future<void> addPriceContribution({
    required String productName,
    required double price,
    required String storeName,
    String? barcode,
    File? image,
  }) async {
    try {
      // ... (Implementation for image upload and data saving)
    } catch (e) {
      // ... (Error handling)
    }
  }

  /// 🔹 Notifications
  Future<void> initializeNotifications(
    GlobalKey<NavigatorState> navigatorKey,
  ) async {
    // Initialize Firebase messaging
  }

  Future<void> setupInteractedMessage(
    GlobalKey<NavigatorState> navigatorKey,
  ) async {
    // Setup message handling
  }
}
