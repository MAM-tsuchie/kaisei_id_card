// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:kaisei_student_app/main.dart';

void main() {
  testWidgets('App loads successfully', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const KaiseiStudentApp());

    // Verify that the app title is displayed
    expect(find.text('開星デジタル学生証'), findsWidgets);
    
    // Verify that the Phase 0 message is displayed
    expect(find.text('Phase 0: Flutter環境構築完了'), findsOneWidget);
  });
}
