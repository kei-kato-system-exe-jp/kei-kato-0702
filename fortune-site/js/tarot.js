// タロット占い専用JavaScript

let selectedCards = [];
let cardCount = 1;
let tarotCards = [];

// タロット占い初期化
function initializeTarot() {
    // タロットカードデータを準備
    prepareTarotCards();
    
    // ステップ表示の初期化
    showStep(1);
}

// タロットカードデータ準備
function prepareTarotCards() {
    const defaultCards = [
        { id: 0, name: '愚者', symbol: '🃏' },
        { id: 1, name: '魔術師', symbol: '🎩' },
        { id: 2, name: '女教皇', symbol: '👸' },
        { id: 3, name: '女帝', symbol: '👑' },
        { id: 4, name: '皇帝', symbol: '👨‍💼' },
        { id: 5, name: '教皇', symbol: '🧙‍♂️' },
        { id: 6, name: '恋人', symbol: '💕' },
        { id: 7, name: '戦車', symbol: '🏛️' },
        { id: 8, name: '力', symbol: '💪' },
        { id: 9, name: '隠者', symbol: '🕯️' },
        { id: 10, name: '運命の輪', symbol: '☸️' },
        { id: 11, name: '正義', symbol: '⚖️' },
        { id: 12, name: '吊られた男', symbol: '🙃' },
        { id: 13, name: '死神', symbol: '💀' },
        { id: 14, name: '節制', symbol: '🏺' },
        { id: 15, name: '悪魔', symbol: '😈' },
        { id: 16, name: '塔', symbol: '🗼' },
        { id: 17, name: '星', symbol: '⭐' },
        { id: 18, name: '月', symbol: '🌙' },
        { id: 19, name: '太陽', symbol: '☀️' },
        { id: 20, name: '審判', symbol: '📯' },
        { id: 21, name: '世界', symbol: '🌍' }
    ];
    
    tarotCards = defaultCards;
}

// 占い方法選択
function selectTarotMethod(count) {
    cardCount = count;
    selectedCards = [];
    
    // 選択されたカード数を表示
    document.getElementById('remaining-cards').textContent = count;
    
    // カードデッキを生成
    generateTarotDeck();
    
    // ステップ2に進む
    showStep(2);
    
    // アニメーション効果
    setTimeout(() => {
        const cards = document.querySelectorAll('.tarot-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) rotateY(0deg)';
            }, index * 50);
        });
    }, 100);
}

// タロットデッキ生成
function generateTarotDeck() {
    const deckContainer = document.getElementById('tarot-deck');
    deckContainer.innerHTML = '';
    
    // カードをシャッフル
    const shuffledCards = Utils.shuffleArray(tarotCards);
    
    // 表示用のカードを生成（22枚全て表示）
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'tarot-card';
        cardElement.dataset.cardId = card.id;
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(20px) rotateY(180deg)';
        cardElement.style.transition = 'all 0.6s ease';
        
        cardElement.innerHTML = `
            <div class="card-back">
                <div class="card-symbol">🔮</div>
                <div class="card-pattern"></div>
            </div>
            <div class="card-front">
                <div class="card-symbol">${card.symbol}</div>
                <div class="card-name">${card.name}</div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => selectCard(card.id, cardElement));
        deckContainer.appendChild(cardElement);
    });
}

// カード選択
function selectCard(cardId, cardElement) {
    // 既に選択済みの場合は無視
    if (selectedCards.includes(cardId)) {
        return;
    }
    
    // 必要枚数に達している場合は無視
    if (selectedCards.length >= cardCount) {
        return;
    }
    
    // カードを選択状態にする
    selectedCards.push(cardId);
    cardElement.classList.add('selected');
    
    // カードフリップアニメーション
    cardElement.style.transform = 'rotateY(180deg) scale(1.1)';
    setTimeout(() => {
        cardElement.style.transform = 'rotateY(0deg) scale(1.1)';
    }, 300);
    
    // 残り枚数更新
    const remaining = cardCount - selectedCards.length;
    document.getElementById('remaining-cards').textContent = remaining;
    
    // 必要枚数に達したら占い開始ボタンを有効化
    if (remaining === 0) {
        document.getElementById('start-reading-btn').disabled = false;
        document.getElementById('start-reading-btn').textContent = '占いを開始';
        
        // 選択されていないカードを薄くする
        const allCards = document.querySelectorAll('.tarot-card:not(.selected)');
        allCards.forEach(card => {
            card.style.opacity = '0.3';
            card.style.pointerEvents = 'none';
        });
    }
}

// 占い開始
function startTarotReading() {
    if (selectedCards.length !== cardCount) {
        alert(`${cardCount}枚のカードを選択してください。`);
        return;
    }
    
    // ローディング画面表示
    showStep(3);
    
    // 占い実行（2秒後）
    setTimeout(() => {
        performTarotReading();
    }, 2000);
}

// タロット占い実行
function performTarotReading() {
    try {
        // 占いエンジンを使用して結果生成
        const result = fortuneEngine.performTarotReading(selectedCards);
        
        // 結果ページに遷移
        goToResult('tarot', result);
    } catch (error) {
        console.error('タロット占いエラー:', error);
        showError('占いの実行中にエラーが発生しました。もう一度お試しください。');
    }
}

// 方法選択に戻る
function goBackToMethod() {
    selectedCards = [];
    cardCount = 1;
    showStep(1);
}

// ステップ表示制御
function showStep(stepNumber) {
    // 全てのステップを非表示
    const steps = document.querySelectorAll('.tarot-step');
    steps.forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // 指定されたステップを表示
    const targetStep = document.getElementById(`tarot-step-${stepNumber}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        setTimeout(() => {
            targetStep.classList.add('active');
        }, 50);
    }
}

// エラー表示
function showError(message) {
    const errorHtml = `
        <div class="result-container">
            <h2 class="result-title">エラー</h2>
            <div class="error-message">
                <p>${message}</p>
                <div class="nav-buttons">
                    <button class="btn" onclick="goBackToMethod()">最初から始める</button>
                    <button class="btn btn-secondary" onclick="goHome()">ホームに戻る</button>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.main-content').innerHTML = errorHtml;
}

// CSS追加（タロット専用スタイル）
const tarotStyles = `
<style>
.tarot-step {
    display: none;
    opacity: 0;
    transition: opacity 0.6s ease;
}

.tarot-step.active {
    display: block;
    opacity: 1;
}

.tarot-method-selection {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin: 30px 0;
}

.tarot-method-selection .selection-card {
    padding: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tarot-method-selection .selection-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(255, 215, 0, 0.3);
}

.tarot-method-selection .card-description {
    margin-top: 15px;
    font-size: 0.9rem;
    color: #e6e6fa;
    opacity: 0.8;
}

#tarot-deck {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 15px;
    margin: 30px 0;
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255, 215, 0, 0.2);
}

.tarot-card {
    aspect-ratio: 2/3;
    background: linear-gradient(135deg, #4a0e4e, #2d1b69);
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    transform-style: preserve-3d;
    overflow: hidden;
}

.tarot-card:hover {
    transform: translateY(-5px) scale(1.05);
    border-color: #ffd700;
    box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
}

.tarot-card.selected {
    border-color: #ffd700;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #2d1b69;
    transform: scale(1.1);
    box-shadow: 0 15px 30px rgba(255, 215, 0, 0.5);
}

.card-back,
.card-front {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    text-align: center;
}

.card-back {
    background: linear-gradient(135deg, #4a0e4e, #2d1b69);
}

.card-front {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #2d1b69;
    transform: rotateY(180deg);
}

.tarot-card.selected .card-front {
    transform: rotateY(0deg);
}

.card-symbol {
    font-size: 1.5rem;
    margin-bottom: 5px;
}

.card-name {
    font-size: 0.7rem;
    font-weight: bold;
    line-height: 1.2;
}

.card-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
    opacity: 0.5;
}

.instruction-text {
    text-align: center;
    margin: 20px 0;
    font-size: 1.1rem;
    color: #e6e6fa;
}

.loading-container {
    text-align: center;
    padding: 40px;
}

.loading-container .loading {
    margin: 0 auto 20px;
}

.error-message {
    text-align: center;
    padding: 30px;
    color: #ff6b6b;
}

.error-message p {
    margin-bottom: 30px;
    font-size: 1.1rem;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    .tarot-method-selection {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    #tarot-deck {
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 10px;
        max-height: 300px;
    }
    
    .card-symbol {
        font-size: 1.2rem;
    }
    
    .card-name {
        font-size: 0.6rem;
    }
}

@media (max-width: 480px) {
    #tarot-deck {
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
    }
    
    .card-symbol {
        font-size: 1rem;
    }
    
    .card-name {
        font-size: 0.5rem;
    }
}
</style>
`;

// スタイルを追加
document.head.insertAdjacentHTML('beforeend', tarotStyles);

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    if (getCurrentPage() === 'tarot') {
        initializeTarot();
    }
});