// 星座占い専用JavaScript

let selectedZodiac = null;

// 星座占い初期化
function initializeZodiac() {
    setupZodiacCards();
    addZodiacAnimations();
}

// 星座カードの設定
function setupZodiacCards() {
    const zodiacCards = document.querySelectorAll('.zodiac-card');
    
    zodiacCards.forEach((card, index) => {
        // 初期アニメーション設定
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // 順次表示アニメーション
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        // クリックイベント追加
        card.addEventListener('click', () => selectZodiac(card));
        
        // ホバーエフェクト強化
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(-10px) scale(1.05)';
                card.style.boxShadow = '0 15px 30px rgba(255, 215, 0, 0.4)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            }
        });
    });
}

// 星座選択
function selectZodiac(cardElement) {
    const zodiacSign = cardElement.dataset.sign;
    
    // 既に選択済みの場合は無視
    if (selectedZodiac === zodiacSign) {
        return;
    }
    
    // 前の選択をクリア
    const previousSelected = document.querySelector('.zodiac-card.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
        previousSelected.style.transform = 'translateY(0) scale(1)';
        previousSelected.style.boxShadow = '';
    }
    
    // 新しい選択を設定
    selectedZodiac = zodiacSign;
    cardElement.classList.add('selected');
    cardElement.style.transform = 'translateY(-10px) scale(1.1)';
    cardElement.style.boxShadow = '0 20px 40px rgba(255, 215, 0, 0.6)';
    
    // 選択エフェクト
    addSelectionEffect(cardElement);
    
    // 少し待ってから占い開始
    setTimeout(() => {
        startZodiacReading(zodiacSign);
    }, 1000);
}

// 選択エフェクト追加
function addSelectionEffect(cardElement) {
    // 星のパーティクルエフェクト
    createStarParticles(cardElement);
    
    // 選択音効果（視覚的表現）
    const ripple = document.createElement('div');
    ripple.className = 'selection-ripple';
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: rippleEffect 0.8s ease-out;
    `;
    
    cardElement.style.position = 'relative';
    cardElement.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// 星のパーティクル作成
function createStarParticles(cardElement) {
    const particleCount = 8;
    const rect = cardElement.getBoundingClientRect();
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '✨';
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 1rem;
            pointer-events: none;
            z-index: 1000;
            animation: starParticle 1.5s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        
        // ランダムな方向に飛ばす
        const angle = (360 / particleCount) * i;
        const distance = 100;
        const endX = rect.left + rect.width / 2 + Math.cos(angle * Math.PI / 180) * distance;
        const endY = rect.top + rect.height / 2 + Math.sin(angle * Math.PI / 180) * distance;
        
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }
}

// 星座占い開始
function startZodiacReading(zodiacSign) {
    // ローディング表示
    showLoadingSection();
    
    // 占い実行（2秒後）
    setTimeout(() => {
        performZodiacReading(zodiacSign);
    }, 2000);
}

// ローディングセクション表示
function showLoadingSection() {
    const zodiacGrid = document.getElementById('zodiac-grid');
    const loadingSection = document.getElementById('loading-section');
    const instructionText = document.querySelector('.instruction-text');
    
    // 星座グリッドをフェードアウト
    zodiacGrid.style.transition = 'opacity 0.5s ease';
    zodiacGrid.style.opacity = '0';
    instructionText.style.opacity = '0';
    
    setTimeout(() => {
        zodiacGrid.style.display = 'none';
        instructionText.style.display = 'none';
        loadingSection.style.display = 'block';
        
        // ローディングをフェードイン
        setTimeout(() => {
            loadingSection.style.opacity = '1';
        }, 100);
    }, 500);
}

// 星座占い実行
function performZodiacReading(zodiacSign) {
    try {
        // 占いエンジンを使用して結果生成
        const result = fortuneEngine.performZodiacReading(zodiacSign);
        
        // 結果ページに遷移
        goToResult('zodiac', result);
    } catch (error) {
        console.error('星座占いエラー:', error);
        showZodiacError('占いの実行中にエラーが発生しました。もう一度お試しください。');
    }
}

// エラー表示
function showZodiacError(message) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="result-container">
            <h2 class="result-title">エラー</h2>
            <div class="error-message">
                <p>${message}</p>
                <div class="nav-buttons">
                    <button class="btn" onclick="location.reload()">再試行</button>
                    <button class="btn btn-secondary" onclick="goHome()">ホームに戻る</button>
                </div>
            </div>
        </div>
    `;
}

// アニメーション追加
function addZodiacAnimations() {
    // 背景の星アニメーション
    createBackgroundStars();
    
    // 星座の説明ツールチップ
    addZodiacTooltips();
}

// 背景の星作成
function createBackgroundStars() {
    const starCount = 20;
    const container = document.querySelector('.container');
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'background-star';
        star.innerHTML = '✦';
        star.style.cssText = `
            position: absolute;
            color: rgba(255, 215, 0, 0.3);
            font-size: ${Math.random() * 0.5 + 0.5}rem;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            pointer-events: none;
            z-index: -1;
        `;
        
        container.appendChild(star);
    }
}

// 星座ツールチップ追加
function addZodiacTooltips() {
    const zodiacInfo = {
        '牡羊座': '情熱的で行動力があり、リーダーシップを発揮します。新しいことに挑戦するのが得意です。',
        '牡牛座': '安定を求め、堅実で忍耐強い性格です。美しいものや快適さを愛します。',
        '双子座': '好奇心旺盛で社交的、コミュニケーション能力に長けています。',
        '蟹座': '感情豊かで家族思い、直感力に優れています。',
        '獅子座': '自信に満ち、創造性豊かでドラマチックな表現を好みます。',
        '乙女座': '完璧主義で分析力があり、細かいところまで気を配ります。',
        '天秤座': 'バランス感覚に優れ、調和と美を重視します。',
        '蠍座': '深い洞察力を持ち、情熱的で神秘的な魅力があります。',
        '射手座': '自由を愛し、冒険心旺盛で哲学的思考を持ちます。',
        '山羊座': '責任感が強く、目標達成に向けて着実に努力します。',
        '水瓶座': '独創的で未来志向、人道的な理想を持ちます。',
        '魚座': '想像力豊かで共感力が高く、芸術的センスがあります。'
    };
    
    const zodiacCards = document.querySelectorAll('.zodiac-card');
    zodiacCards.forEach(card => {
        const sign = card.dataset.sign;
        const tooltip = document.createElement('div');
        tooltip.className = 'zodiac-tooltip';
        tooltip.textContent = zodiacInfo[sign];
        tooltip.style.cssText = `
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ffd700;
            padding: 10px;
            border-radius: 8px;
            font-size: 0.8rem;
            width: 200px;
            text-align: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            border: 1px solid rgba(255, 215, 0, 0.3);
        `;
        
        // 矢印追加
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid rgba(0, 0, 0, 0.9);
        `;
        tooltip.appendChild(arrow);
        
        card.style.position = 'relative';
        card.appendChild(tooltip);
        
        // ホバーイベント
        card.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        card.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
}

// CSS追加（星座専用スタイル）
const zodiacStyles = `
<style>
.zodiac-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin: 30px 0;
    transition: opacity 0.5s ease;
}

.zodiac-card {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 15px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    position: relative;
    overflow: visible;
}

.zodiac-card:hover {
    border-color: #ffd700;
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 30px rgba(255, 215, 0, 0.3);
}

.zodiac-card.selected {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.2);
    transform: translateY(-10px) scale(1.1);
    box-shadow: 0 20px 40px rgba(255, 215, 0, 0.6);
}

.zodiac-icon {
    font-size: 2.5rem;
    margin-bottom: 10px;
    display: block;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

.zodiac-name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #ffd700;
    margin-bottom: 5px;
}

.zodiac-period {
    font-size: 0.8rem;
    color: #e6e6fa;
    opacity: 0.8;
}

.loading-section {
    text-align: center;
    padding: 60px 20px;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.loading-section .loading {
    margin: 0 auto 20px;
}

.loading-section p {
    font-size: 1.2rem;
    color: #e6e6fa;
    margin-top: 20px;
}

.instruction-text {
    text-align: center;
    margin: 20px 0;
    font-size: 1.1rem;
    color: #e6e6fa;
    transition: opacity 0.5s ease;
}

@keyframes rippleEffect {
    0% {
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        width: 200px;
        height: 200px;
        opacity: 0;
    }
}

@keyframes starParticle {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(var(--end-x, 0), var(--end-y, 0)) scale(0);
        opacity: 0;
    }
}

@keyframes twinkle {
    0%, 100% {
        opacity: 0.3;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.2);
    }
}

.background-star {
    position: absolute;
    pointer-events: none;
    z-index: -1;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    .zodiac-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
    }
    
    .zodiac-card {
        padding: 15px;
    }
    
    .zodiac-icon {
        font-size: 2rem;
    }
    
    .zodiac-name {
        font-size: 1rem;
    }
    
    .zodiac-period {
        font-size: 0.7rem;
    }
    
    .zodiac-tooltip {
        width: 150px !important;
        font-size: 0.7rem !important;
    }
}

@media (max-width: 480px) {
    .zodiac-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
    
    .zodiac-card {
        padding: 12px;
    }
    
    .zodiac-icon {
        font-size: 1.8rem;
        margin-bottom: 8px;
    }
    
    .zodiac-name {
        font-size: 0.9rem;
        margin-bottom: 3px;
    }
    
    .zodiac-period {
        font-size: 0.6rem;
    }
    
    .zodiac-tooltip {
        width: 120px !important;
        font-size: 0.6rem !important;
        padding: 8px !important;
    }
}
</style>
`;

// スタイルを追加
document.head.insertAdjacentHTML('beforeend', zodiacStyles);

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    if (getCurrentPage() === 'zodiac') {
        initializeZodiac();
    }
});