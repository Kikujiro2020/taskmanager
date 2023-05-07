<!-- index.vue -->
<template>
    <div class="home">
      <!-- タイトル -->
      <h1>業務管理ツール</h1>
  
      <!-- 機能紹介 -->
      <div class="feature-section">
        <!-- 親Task機能 -->
        <div class="feature-team-creation">
        <h2>チーム作成</h2>
        <p>チーム作成フォームにチーム名とメンバーIDを入力して送信することで、新しいチームを作成することができます。作成したユーザーは自動的にリーダーとなり、他のメンバーを選定することができます。</p>
      </div>
        <div class="feature-parent-tasks">
          <h2>親タスク作成</h2>
          <p>チームリーダーが指示（親Task）を出すことができます。</p>
        </div>
  
        <!-- 子Task機能 -->
        <div class="feature-child-tasks">
          <h2>子タスク作成</h2>
          <p>チームメンバーが親Taskを細分化し、子タスクを作成して役割分担することができます。</p>
        </div>
  
        <!-- タスク進捗管理機能 -->
        <div class="feature-task-progress">
          <h2>タスク進捗管理</h2>
          <p>タスクごとにその進捗状況を確認することができ、チームメンバー全体で進捗を見ることができます。</p>
        </div>
  
        <!-- チャット機能 -->
        <div class="feature-chat">
          <h2>チャット</h2>
          <p>メンバーがチャットを使用できます。</p>
        </div>
  
        <!-- 業務時間管理機能 -->
        <div class="feature-work-time">
          <h2>業務時間管理</h2>
          <p>チームメンバーがどの作業にどれくらいの時間を使い、合計で何時間働いていたかを計測することができます。</p>
        </div>
  
        <!-- グラフ分析機能 -->
        <div class="feature-graph-analysis">
          <h2>グラフ分析</h2>
          <p>業務時間のデータをまとめ、自動的に図表に落とし込み、業務改善のための分析ができます。</p>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Home画面全体 */
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* タイトル */
  h1 {
    font-size: 3rem;
    margin: 2rem 0;
  }
  
  /* 機能紹介セクション全体 */
  .feature-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }
  
  /* 各機能セクション */
  .feature-team-creation,
  .feature-parent-tasks,
  .feature-child-tasks,
  .feature-task-progress,
  .feature-chat,
  .feature-work-time,
  .feature-graph-analysis {
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #F7F7F7;
    border-radius: 10px;
    padding: 1rem;
  }
  
  /* セクションタイトル */
  .feature-parent-tasks h2,
  .feature-child-tasks h2,
  .feature-task-progress h2,
  .feature-chat h2,
  .feature-work-time h2,
  .feature-graph-analysis h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  /* セクション説明文 */
  .feature-parent-tasks p,
  .feature-child-tasks p,
  .feature-task-progress p,
  .feature-chat p,
  .feature-work-time p,
  .feature-graph-analysis p {
    font-size: 1.2rem;
  }
  </style>