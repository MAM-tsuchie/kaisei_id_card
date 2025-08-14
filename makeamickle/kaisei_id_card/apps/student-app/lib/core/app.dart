import 'package:flutter/material.dart';

/// 開星デジタル学生証アプリのメインウィジェット
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
      home: const HomePage(),
    );
  }
}

/// ホームページウィジェット
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('開星デジタル学生証'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Phase 0: Flutter環境構築完了',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            Text(
              '基盤整備が完了しました',
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}