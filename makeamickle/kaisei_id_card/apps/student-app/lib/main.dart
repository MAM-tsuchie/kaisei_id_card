import 'package:flutter/material.dart';

void main() {
  runApp(const KaiseiStudentApp());
}

class KaiseiStudentApp extends StatelessWidget {
  const KaiseiStudentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '開星デジタル学生証',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('開星デジタル学生証'),
        ),
        body: const Center(
          child: Text(
            'Phase 0: Flutter環境構築完了',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}
