#!/bin/bash

# Java環境設定スクリプト
# Firebase エミュレータ用のJava環境を設定

# Java 11のパスを確認
JAVA_PATH="/opt/homebrew/opt/openjdk@11"

if [ ! -d "$JAVA_PATH" ]; then
    echo "❌ Java 11がインストールされていません"
    echo "以下のコマンドでインストールしてください："
    echo "brew install openjdk@11"
    exit 1
fi

# 環境変数を設定
export JAVA_HOME="$JAVA_PATH"
export PATH="$JAVA_HOME/bin:$PATH"

echo "✅ Java環境設定完了"
echo "JAVA_HOME: $JAVA_HOME"
$JAVA_HOME/bin/java --version