# Gemini Code Collapser v1.0

Geminiが出力する長大なコードブロックを自動で折りたたみ、チャットの視認性とスクロールの快適さを向上させるUserScriptです。



https://github.com/user-attachments/assets/03ae07c5-f23a-4d98-b29f-9d64061639b3



## 主な機能
* **自動折りたたみ:** Geminiが生成したコードブロックを150pxの高さで自動的に折りたたみます。
* **スクロール追従ボタン:** 展開・折りたたみボタンがコード領域の画面下部に追従し、長いコードの途中でも即座に操作可能です。
* **位置補正（自動スナップ）:** 折りたたみ時にコード領域が画面外に消えた場合、自動で画面中央にスクロールを補正します。
* **テーマ自動追従:** OSやGeminiのライト/ダークテーマ設定に合わせて、UIがシームレスに切り替わります。
* **完全なコピー対応:** 折りたたんだ状態のままGemini標準の「コードをコピー」ボタンを押しても、コード全体を欠落なくクリップボードに取得します。

## デザイン設定機能
Tampermonkeyの拡張機能メニューから「⚙️ デザイン設定」を開くことで、折りたたみボタンの見た目を4種類から自由に変更できます。

<img width="319" height="260" alt="image" src="https://github.com/user-attachments/assets/8b7c869a-5e49-410d-b481-3c9ce17ec52a" />

<img width="381" height="276" alt="image" src="https://github.com/user-attachments/assets/c764bfff-88d2-413c-b827-9576d58d47c6" />


1. **標準（カード型）:** 視認性の高い標準デザイン<img width="690" height="242" alt="image" src="https://github.com/user-attachments/assets/b0e13090-19ef-4f24-857e-d2041c804982" />

2. **シームレスバー型:** エディタのステータスバーのような一体感のあるデザイン<img width="699" height="240" alt="image" src="https://github.com/user-attachments/assets/89fef72c-7f9c-4007-a932-68e7e846f3da" />

3. **フローティングピル型:** 画面を占有しない丸みを帯びたカプセル状のデザイン<img width="704" height="249" alt="image" src="https://github.com/user-attachments/assets/94631573-2076-41c1-b57e-9987d7811d88" />

4. **ミニマルテキスト型:** 背景や枠線を排したリンク風のシンプルなデザイン<img width="694" height="244" alt="image" src="https://github.com/user-attachments/assets/57d0db21-07fd-4f0f-a746-2fe9df71ab5a" />


## インストール方法
1. ブラウザに [Tampermonkey](https://www.tampermonkey.net/) などのUserScriptマネージャーをインストールします。
2. スクリプトを新規作成し、本コードをコピー＆ペーストして保存してください。
3. Geminiのページを再読み込みすると有効になります。

## 仕様
* **作者:** [Yazirusi_okuri](https://x.com/Yazirusi_okuri)
* **バージョン:** 1.0
* **ライセンス:** MIT License
